"use client";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import { useUserStore } from "../../stores/userStore";
import userService from "../../services/userService";
import { supabase } from "@/lib/supabaseClient";
import Orb from "@/components/Orb/Orb";
import Header from "../landing-components/Header";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
import { useRouter } from "next/navigation";
export default function OnboardingPage() {
  // Define the type for supabaseUser to avoid 'unknown' errors
  const router = useRouter();
  interface SupabaseUser {
    id: string;
    [key: string]: any;
  }
  const { supabaseUser, refreshUser } = useUser() as {
    supabaseUser: SupabaseUser | null;
    refreshUser: () => void;
  };
  const { isOnboarded, loading: userLoading, userDataFetched, setIsOnboarded } =
    useUserStore();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // No redirect logic needed - AuthGuard handles this

  const validateUsername = (name: string) => {
    if (!name) {
      setUsernameError("");
      return true;
    }
    if (name.length < 3 || name.length > 20) {
      setUsernameError("Must be 3-20 characters.");
      return false;
    }
    if (/\s/.test(name)) {
      setUsernameError("No spaces allowed.");
      return false;
    }
    const regex = /^[a-zA-Z0-9._-]+$/;
    if (!regex.test(name)) {
      setUsernameError("Only letters, numbers, . _ - are allowed.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    validateUsername(newUsername);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProfilePic(e.dataTransfer.files[0]);
      setPreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setError("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      let profilePicUrl = "";

      if (profilePic) {
        const fileExt = profilePic.name.split(".").pop();
        const fileName = `${supabaseUser?.id || Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from("PFPs")
          .upload(filePath, profilePic, {
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from("PFPs").getPublicUrl(filePath);

        profilePicUrl = data.publicUrl;
      }

      await userService.updateOnboarding(supabaseUser?.id || "", {
        username: username.toLowerCase(),
        profilePic: profilePicUrl,
      });

      setIsOnboarded(true); // Immediate update for fast redirect
      refreshUser();
      setMessage("Profile updated!");
      // Removed inline redirect, useEffect will handle redirect
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Optimal redirect: watch isOnboarded and redirect when true
  useEffect(() => {
    if (isOnboarded) {
      router.replace("/dashboard");
    }
  }, [isOnboarded, router]);

  return userLoading || !userDataFetched || isOnboarded ? (
    <></>
  ) : (
    <div className="h-screen bg-zinc-950 flex items-center justify-center text-white px-4 overflow-x-hidden w-screen">
      <Header />
      <div className="absolute h-full overflow-hidden pt-6 inset-0 z-0">
        <Orb hoverIntensity={1.2} hue={145} rotateOnHover={true} />
      </div>
      <div className="max-w-md w-full z-5 bg-zinc-900/20 backdrop-blur-xs rounded-lg shadow-xl p-8 border-2 border-zinc-800">
        <h2
          className={`text-3xl font-bold text-center mb-6 ${spaceGrotesk.className}`}
        >
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium"
            >
              Forge Your Identity
            </label>
            <input
              type="text"
              id="username"
              placeholder="Choose Your Codename"
              className={`w-full px-4 py-2 rounded bg-zinc-950/20 border ${
                usernameError ? "border-red-500" : "border-zinc-700"
              } focus:border-zinc-700`}
              value={username}
              onChange={handleUsernameChange}
              required
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          <p>Upload Your Avatar</p>
          <div
            className={`w-full h-36 border-2 border-dashed rounded-lg -mt-4 flex flex-col items-center justify-center bg-zinc-950/20 text-gray-400 relative transition-all duration-200 ${
              dragActive ? "border-lime-500 bg-lime-900/20" : "border-zinc-700"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("profilePicInput")?.click()}
            style={{ cursor: "pointer" }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={96}
                height={96}
                className="h-24 w-24 object-cover rounded-full mx-auto"
              />
            ) : (
              <>
                <span className="font-semibold">
                  Upload or drag & drop image
                </span>
                <span className="text-xs mt-1">(JPG, PNG, GIF)</span>
              </>
            )}
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <button
            type="submit"
            className={`w-full py-2 rounded font-semibold hover:cursor-pointer bg-lime-600 hover:scale-97 transition-transform duration-200 ${
              (usernameError || !username) && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading || !!usernameError || !username}
          >
            {loading ? "Saving..." : "Begin Your Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
