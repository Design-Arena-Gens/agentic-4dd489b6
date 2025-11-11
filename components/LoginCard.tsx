"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { ArrowRightIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

type Mode = "signin" | "signup";

export const LoginCard = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } =
    useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    try {
      setWorking(true);
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setWorking(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      toast.error("Enter your email to reset password");
      return;
    }
    try {
      setWorking(true);
      await resetPassword(email);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="max-w-md w-full glass-panel p-10 space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-300">
          Autobiography Data Builder
        </p>
        <h1 className="text-3xl font-semibold">
          Craft your life story with the power of AI
        </h1>
        <p className="text-slate-400 text-sm">
          Sign in to start capturing memories, milestones, and dreams in one
          beautiful narrative.
        </p>
      </div>

      <button
        type="button"
        disabled={working}
        onClick={() => signInWithGoogle().catch((error) => {
          toast.error(error.message || "Google sign-in failed");
        })}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-slate-900 font-medium shadow-lg shadow-primary-500/10 border border-white/20 hover:bg-primary-50 transition"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="h-5 w-5"
        />
        Continue with Google
      </button>

      <div className="flex items-center gap-4">
        <span className="flex-1 h-px bg-slate-700/60" />
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
          or
        </span>
        <span className="flex-1 h-px bg-slate-700/60" />
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Email</label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/70 focus:border-primary-400 rounded-2xl py-3 pl-11 pr-3 outline-none transition text-sm"
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/70 focus:border-primary-400 rounded-2xl py-3 px-3 outline-none transition text-sm"
            placeholder="Create a strong password"
            type="password"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={working}
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 hover:from-primary-400 hover:to-primary-500 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70"
      >
        {mode === "signin" ? "Sign In" : "Create Account"}
        <ArrowRightIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <button
          type="button"
          disabled={working}
          onClick={handleReset}
          className="hover:text-primary-300 transition"
        >
          Forgot password?
        </button>
        <button
          type="button"
          className="hover:text-primary-300 transition"
          disabled={working}
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already registered? Sign in"}
        </button>
      </div>
    </div>
  );
};
