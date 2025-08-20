"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Orb from "@/components/Orb/Orb";
import Header from "../landing-components/Header";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error){
      setError(error.message);
       console.log("Login error:", error);
    } 
    else {
      setMessage("Login successful!");
      router.replace("/dashboard"); // Redirect to dashboard after login
    }
    setLoading(false);
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else
      setMessage(
        "Signup successful! Check confirmation link in your inbox"
      );
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
    else setMessage("Magic login link sent! Check your inbox");
    setLoading(false);
  };

  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center text-white px-4 overflow-x-hidden w-screen">
      <Header />
      <div className="absolute h-full overflow-hidden pt-6 inset-0 z-0">
        <Orb hoverIntensity={1.2} hue={145} rotateOnHover={true} />
      </div>
      <div className="max-w-md w-full z-5 bg-zinc-900/20 backdrop-blur-xs rounded-lg shadow-xl p-8 border-2 border-zinc-800">
        <h2
          className={`text-3xl font-bold text-center mb-6 ${spaceGrotesk.className}`}
        >
          {isSignup ? "Create an Account" : "Enter the Arena"}
        </h2>
        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-zinc-950/20  focus:border-zinc-700 border border-zinc-700 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!showForgot && (
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-zinc-950/20 border border-zinc-700  focus:border-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && (
            <p className="text-green-500 text-sm">
              {message.includes("inbox") ? (
                <>
                  {message.replace("inbox", "")}
                  <a
                    href="https://gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-green-400 hover:text-green-300 hover:cursor-pointer"
                  >
                    inbox
                  </a>
                  !
                </>
              ) : (
                message
              )}
            </p>
          )}

          {!showForgot ? (
            <button
              type="submit"
              className={`w-full py-2 rounded font-semibold hover:cursor-pointer bg-lime-600 hover:scale-97 transition-transform duration-200`}
              disabled={loading}
            >
              {loading
                ? isSignup
                  ? "Signing up..."
                  : "Loading..."
                : isSignup
                ? "Sign Up"
                : "Login"}
            </button>
          ) : (
            <>
              <p className="text-sm text-center">
                Login without password using a magic login link.
              </p>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full py-2 bg-lime-500 hover:bg-lime-600 rounded font-semibold hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </>
          )}
        </form>

        <div className="mt-4 text-sm text-center flex flex-col gap-2">
          {!showForgot && (
            <>
              <button
                className="text-zinc-400 hover:text-white underline hover:cursor-pointer"
                onClick={() => setIsSignup((prev) => !prev)}
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
              <button
                className="text-zinc-400 hover:text-white underline hover:cursor-pointer"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </>
          )}
          {showForgot && (
            <button
              className="text-zinc-400 hover:text-white underline hover:cursor-pointer"
              onClick={() => setShowForgot(false)}
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
