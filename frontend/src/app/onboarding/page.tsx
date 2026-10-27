"use client";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import { useUserStore } from "../../stores/userStore";
import userService from "../../services/userService";
import { supabase } from "@/lib/supabaseClient";
import Header from "../landing-components/Header";
import Image from "next/image";
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
    <div className="min-h-screen bg-slate-50 paper-grid flex items-center justify-center text-slate-900 px-4 pt-16 overflow-x-hidden w-full">
      <Header />
      <div className="max-w-md w-full relative z-10 bg-white rounded-lg shadow-sm p-8 border border-slate-200">
        <p className="section-label text-center mb-1">Step 1 of 1</p>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-6 pb-3 border-b border-slate-200">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              className={`w-full px-4 py-2 rounded-md bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                usernameError ? "border-red-600" : "border-slate-300 focus:border-blue-700"
              }`}
              value={username}
              onChange={handleUsernameChange}
              required
            />
            {usernameError && (
              <p className="text-red-600 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          <p className="text-sm font-medium text-slate-700">Profile Picture</p>
          <div
            className={`w-full h-36 border-2 border-dashed rounded-lg -mt-4 flex flex-col items-center justify-center bg-slate-50 text-slate-500 relative transition-colors duration-200 ${
              dragActive ? "border-blue-700 bg-blue-50" : "border-slate-300"
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
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-emerald-600 text-sm">{message}</p>}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white hover:cursor-pointer bg-blue-700 hover:bg-blue-800 transition-colors duration-200 ${
              (usernameError || !username) && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading || !!usernameError || !username}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
