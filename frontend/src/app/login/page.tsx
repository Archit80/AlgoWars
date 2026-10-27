"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "../landing-components/Header";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      console.log("Login error:", error);
    } else {
      setMessage("Login successful!");
      // Let AuthGuard handle redirect based on onboarding status
    }
    setLoading(false);
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage("Signup successful! Check confirmation link in your inbox");
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 paper-grid flex items-center justify-center text-slate-900 px-4 pt-16 overflow-x-hidden w-full">
      <Header />
      <div className="max-w-md w-full relative z-10 bg-white rounded-lg shadow-sm p-8 border border-slate-200">
        <p className="section-label text-center mb-1">
          {isSignup ? "Registration" : "Authentication"}
        </p>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-6 pb-3 border-b border-slate-200">
          {isSignup ? "Create an Account" : "Sign In"}
        </h2>
        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!showForgot && (
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && (
            <p className="text-emerald-600 text-sm">
              {message.includes("inbox") ? (
                <>
                  {message.replace("inbox", "")}
                  <a
                    href="https://gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700 hover:text-blue-800 hover:cursor-pointer"
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
              className="w-full py-2 rounded-md font-semibold text-white hover:cursor-pointer bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-60"
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
              <p className="text-sm text-center text-slate-600">
                Login without password using a magic login link.
              </p>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </>
          )}
        </form>

        {/* Google OAuth Button - always visible */}
        <div className="mt-2">
          <div className="text-center text-xs uppercase tracking-widest text-slate-500 mb-2">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 bg-white text-slate-900 rounded-md font-semibold flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 transition-colors duration-200 hover:cursor-pointer"
            disabled={loading}
          >
            <Image src="/google.svg" alt="Google Logo" width={20} height={20} />
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-sm text-center flex flex-col gap-2">
          {!showForgot && (
            <>
              <button
                className="text-slate-500 hover:text-blue-700 underline hover:cursor-pointer"
                onClick={() => setIsSignup((prev) => !prev)}
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
              <button
                className="text-slate-500 hover:text-blue-700 underline hover:cursor-pointer"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </>
          )}
          {showForgot && (
            <button
              className="text-slate-500 hover:text-blue-700 underline hover:cursor-pointer"
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
