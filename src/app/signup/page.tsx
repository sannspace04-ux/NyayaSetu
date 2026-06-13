"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/login`,
        },
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("already registered")) {
          setError("An account with this email already exists. Try logging in.");
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
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
          <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Join Nyaya Setu — free forever</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-lg">
          {success ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                ✅
              </div>
              <h2 className="font-serif text-xl font-bold text-primary">Account Created!</h2>
              <p className="text-sm text-muted">
                We sent a verification email to <strong>{formData.email}</strong>.
                Please click the link in the email to activate your account, then login.
              </p>
              <p className="text-xs text-muted">
                Check your spam folder if you don&apos;t see it within a few minutes.
              </p>
              <Link
                href="/login"
                className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4" noValidate>
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-primary">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handle}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handle}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-primary">
                    Phone <span className="text-xs text-muted">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handle}
                    placeholder="+91 XXXXX"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-primary">
                    City <span className="text-xs text-muted">(optional)</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handle}
                    placeholder="Delhi"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-primary">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handle}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-primary">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handle}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Free Account"}
              </button>

              <p className="text-center text-sm text-muted">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-accent hover:underline">
                  Login
                </Link>
              </p>

              <p className="text-center text-xs text-muted">
                By signing up, you agree to our Terms of Service and Privacy Policy.
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
