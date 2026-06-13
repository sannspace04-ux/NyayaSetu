"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

type Mode = "login" | "forgot" | "forgotSent";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already-authenticated users
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        if (authError.message.toLowerCase().includes("email not confirmed")) {
          setError("Please verify your email first. Check your inbox for the confirmation link.");
        } else if (authError.message.toLowerCase().includes("invalid login")) {
          setError("Incorrect email or password. Please try again.");
        } else {
          setError(authError.message);
        }
        return;
      }
      // onAuthStateChange in AuthContext picks up the session — redirect immediately
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setMode("forgotSent");
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12">
      <WatermarkLogo opacity={0.06} size={520} />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image src="/logo.png" alt="Nyaya Setu" width={72} height={72} className="h-16 w-16 object-contain" />
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-bold text-primary">
            {mode === "login" ? "Welcome back" : "Reset Password"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === "login"
              ? "Login to your Nyaya Setu account"
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-lg">
          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-primary">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setForgotEmail(email); setError(""); }}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-muted">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-accent hover:underline">
                  Sign up free
                </Link>
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-primary"
              >
                ← Back to login
              </button>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="forgotEmail" className="mb-1.5 block text-sm font-medium text-primary">
                  Your Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* Forgot Sent Confirmation */}
          {mode === "forgotSent" && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
                ✅
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Check your inbox</h3>
              <p className="text-sm text-muted">
                We sent a password reset link to <strong>{forgotEmail}</strong>.
                Follow the link in the email to reset your password.
              </p>
              <p className="text-xs text-muted">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setMode("forgot")}
                  className="font-medium text-accent hover:underline"
                >
                  try again
                </button>
                .
              </p>
              <button
                onClick={() => setMode("login")}
                className="w-full rounded-full border border-border py-2.5 text-sm font-medium text-primary hover:border-primary/30"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="hover:text-accent">← Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
