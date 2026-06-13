"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";
import { supabase } from "@/lib/supabase";

const contactOptions = [
  { icon: "💬", title: "AI Assistant", desc: "Get instant legal guidance", href: "/chat", cta: "Ask Now" },
  { icon: "📞", title: "Helplines", desc: "Emergency legal contacts", href: "/helpline", cta: "View All" },
  { icon: "⚖️", title: "Find a Lawyer", desc: "Connect with advocates", href: "/lawyers", cta: "Browse" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      // Write to Supabase contact_messages table
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            category: formData.category || null,
            message: formData.message.trim(),
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        // Table may not exist yet — show a clear message instead of fake success
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          setErrorMsg(
            "Contact form database table not yet configured. Please email us directly at support@nyayasetu.in"
          );
          setStatus("error");
          return;
        }
        throw error;
      }

      setStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(`Failed to send message: ${msg}`);
      setStatus("error");
    }
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={500} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Get in Touch</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Quick options */}
          <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {contactOptions.map((opt) => (
              <Link
                key={opt.title}
                href={opt.href}
                className="group rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-all card-hover"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-3xl transition-all group-hover:scale-110 group-hover:bg-accent/15">
                  {opt.icon}
                </div>
                <h3 className="font-semibold text-primary">{opt.title}</h3>
                <p className="mt-1 text-sm text-muted">{opt.desc}</p>
                <span className="mt-3 inline-block rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  {opt.cta} →
                </span>
              </Link>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
              <h2 className="mb-6 font-serif text-2xl font-bold text-primary">Send us a Message</h2>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                    ✅
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary">Message Sent!</h3>
                  <p className="mt-2 text-sm text-muted">
                    Thank you for reaching out. We&apos;ll respond to <strong>{formData.email}</strong> within 1–2 business days.
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setFormData({ name: "", email: "", subject: "", category: "", message: "" });
                    }}
                    className="mt-5 rounded-full border border-border px-5 py-2 text-sm text-muted hover:text-primary"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {status === "error" && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                      ❌ {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handle}
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="email"
                        required
                        value={formData.email}
                        onChange={handle}
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handle}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select a category (optional)</option>
                      <option>General Enquiry</option>
                      <option>Technical Issue</option>
                      <option>Partnership / Collaboration</option>
                      <option>Media / Press</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handle}
                      type="text"
                      placeholder="Brief subject"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handle}
                      placeholder="Write your message here…"
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending…" : "Send Message →"}
                  </button>
                </form>
              )}
            </div>

            {/* Info panel */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Nyaya Setu"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                  <div>
                    <p className="font-serif font-bold text-primary">Nyaya Setu</p>
                    <p className="text-xs text-muted">Where Justice Meets Clarity</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-muted">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">📧</span>
                    <div>
                      <p className="font-medium text-primary">Email</p>
                      <a href="mailto:support@nyayasetu.in" className="hover:text-accent">
                        support@nyayasetu.in
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">⏰</span>
                    <div>
                      <p className="font-medium text-primary">Response Time</p>
                      <p>Within 1–2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">🌐</span>
                    <div>
                      <p className="font-medium text-primary">Languages</p>
                      <p>English · हिंदी</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">🇮🇳</span>
                    <div>
                      <p className="font-medium text-primary">Serving</p>
                      <p>All of India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  ℹ️ Platform under active development. We appreciate your feedback and patience.
                </div>
              </div>

              <div className="rounded-3xl bg-primary px-6 py-7 text-white">
                <h3 className="font-serif text-lg font-bold">Need immediate legal help?</h3>
                <p className="mt-2 text-sm text-white/70">
                  Don&apos;t wait — use our AI assistant or call emergency helplines.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/chat"
                    className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-primary hover:bg-accent-light"
                  >
                    AI Chat →
                  </Link>
                  <Link
                    href="/helpline"
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Helplines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
