"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase redirects here with a session fragment — detect it
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check for existing session from URL hash
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setStatus("loading");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        setStatus("error");
        return;
      }
      setStatus("success");
      setTimeout(() => router.replace("/dashboard"), 2500);
    } catch {
      setError("Something went wrong. Please try again or request a new reset link.");
      setStatus("error");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12">
      <WatermarkLogo opacity={0.06} size={500} />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Nyaya Setu"
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
            />
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Set New Password</h1>
          <p className="mt-1 text-sm text-muted">Enter and confirm your new password below</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8 shadow-lg">
          {status === "success" ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
                ✅
              </div>
              <h2 className="font-serif text-xl font-bold text-primary">Password Updated!</h2>
              <p className="text-sm text-muted">
                Your password has been successfully updated. Redirecting to your dashboard…
              </p>
              <Link
                href="/dashboard"
                className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5" noValidate>
              {!sessionReady && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  ⚠️ Session not detected. Please use the link from your password reset email directly.
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-primary">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-primary">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !sessionReady}
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg disabled:opacity-60"
              >
                {status === "loading" ? "Updating password..." : "Update Password"}
              </button>

              <p className="text-center text-xs text-muted">
                Link expired?{" "}
                <Link href="/login" className="font-medium text-accent hover:underline">
                  Request a new one
                </Link>
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="hover:text-accent">← Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
