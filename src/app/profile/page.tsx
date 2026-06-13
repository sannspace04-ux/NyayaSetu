"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateUserMetadata } from "@/lib/supabase";
import WatermarkLogo from "@/components/shared/WatermarkLogo";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/language";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOut, refreshUser } = useAuth();
  const { lang, setLang } = useLanguage();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ full_name: "", phone: "", city: "" });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Populate form from real user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
      });
    }
  }, [user]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    const error = await updateUserMetadata({
      full_name: formData.full_name,
      phone: formData.phone,
      city: formData.city,
    });
    if (error) {
      setSaveStatus("error");
    } else {
      await refreshUser();
      setSaveStatus("success");
      setEditing(false);
    }
    setSaving(false);
    setTimeout(() => setSaveStatus("idle"), 4000);
  };

  const handleChangePassword = async () => {
    if (!user) return;
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (!error) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.full_name?.trim() || user.email.split("@")[0];
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const memberYear = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <WatermarkLogo opacity={0.05} size={500} />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-10 md:px-8">
        {/* Back */}
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-primary">
          ← {t("back", lang)} to Dashboard
        </Link>

        {/* Header card */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-primary px-6 py-8 text-white relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,164,93,0.2),transparent_60%)]" />
          <div className="relative flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 font-serif text-3xl font-bold text-white backdrop-blur-sm">
              {initials}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">{displayName}</h1>
              <p className="text-sm text-white/70">{user.email}</p>
              <p className="mt-1 text-xs text-white/50">
                {t("memberSince", lang)} {memberYear}
                {user.city ? ` · ${user.city}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Status messages */}
        {saveStatus === "success" && (
          <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✅ Changes saved successfully!
          </div>
        )}
        {saveStatus === "error" && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            ❌ Failed to save changes. Please try again.
          </div>
        )}

        {/* Profile form */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-primary">{t("editProfile", lang)}</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-primary transition-all hover:border-accent hover:text-accent"
              >
                ✏️ {t("editProfile", lang)}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(false); setFormData({ full_name: user.full_name ?? "", phone: user.phone ?? "", city: user.city ?? "" }); }}
                  disabled={saving}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted disabled:opacity-50"
                >
                  {t("cancel", lang)}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-light disabled:opacity-60"
                >
                  {saving ? "Saving..." : t("saveChanges", lang)}
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Email — read-only */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Email Address</label>
              <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                {user.email}
                <span className="ml-2 text-xs text-muted">(cannot be changed)</span>
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handle}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              ) : (
                <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  {user.full_name || <span className="italic text-muted/60">Not set</span>}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handle}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              ) : (
                <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  {user.phone || <span className="italic text-muted/60">Not set</span>}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">City</label>
              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handle}
                  placeholder="e.g. Delhi, Mumbai"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              ) : (
                <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  {user.city || <span className="italic text-muted/60">Not set</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-bold text-primary">Language Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Preferred Language</p>
              <p className="mt-0.5 text-xs text-muted">Affects navigation labels and UI text</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLang("en")}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${lang === "en" ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary/30"}`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${lang === "hi" ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary/30"}`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>

        {/* Account actions */}
        <div className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-bold text-primary">Account</h2>
          <div className="space-y-2">
            <button
              onClick={handleChangePassword}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-primary transition-all hover:bg-primary/5"
            >
              <span>🔒 Change Password (email link)</span>
              <span className="text-muted">→</span>
            </button>

            <button
              onClick={signOut}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-red-500 transition-all hover:bg-red-50"
            >
              <span>🚪 {t("logout", lang)}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Image src="/logo.png" alt="Nyaya Setu" width={28} height={28} className="h-7 w-7 object-contain opacity-40" />
          <p className="text-xs text-muted">Nyaya Setu · Where Justice Meets Clarity</p>
        </div>
      </div>
    </div>
  );
}
