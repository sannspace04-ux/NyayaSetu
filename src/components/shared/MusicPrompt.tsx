"use client";

import { useEffect, useState } from "react";
import { useMusic } from "@/context/MusicContext";

/**
 * Shown once to first-time visitors.
 * Asks: "Enable ambient experience?" with two options.
 * Dismissed if user has already made a choice (stored in localStorage).
 */
export default function MusicPrompt() {
  const { promptDismissed, enable, dismissPrompt } = useMusic();
  const [visible, setVisible] = useState(false);

  /* Show the prompt 2.5 s after page load — only if not yet dismissed */
  useEffect(() => {
    if (promptDismissed) return;
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [promptDismissed]);

  if (!visible || promptDismissed) return null;

  const handleEnable = () => {
    enable();
    setVisible(false);
  };

  const handleSkip = () => {
    dismissPrompt();
    setVisible(false);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center pb-8 px-4 sm:items-center sm:pb-0"
      style={{ background: "rgba(4,8,16,0.55)", backdropFilter: "blur(4px)" }}
      aria-modal="true"
      role="dialog"
      aria-label="Ambient music prompt"
    >
      {/* Card */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.06) 50%, rgba(212,175,55,0.35) 100%)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.12)",
          animation: "slide-up 0.45s cubic-bezier(.34,1.4,.64,1) forwards",
        }}
      >
        <div
          className="rounded-3xl px-6 py-7"
          style={{ background: "linear-gradient(160deg, #0F1A2E 0%, #111827 100%)" }}
        >
          {/* Musical note icon */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            >
              🎵
            </div>
            <div>
              <p className="font-serif text-base font-bold text-white">Ambient Experience</p>
              <p className="text-xs text-[#6B8098]">Soft background music</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[#9EADC8]">
            Enable soft ambient piano music to enhance your legal research experience.
            <span className="block mt-1 text-xs text-[#6B8098]">
              Volume is set to 10% · You can adjust or mute anytime.
            </span>
          </p>

          {/* Music visualiser bars (purely decorative) */}
          <div className="my-4 flex items-end justify-center gap-1 h-6">
            {[4, 7, 5, 9, 6, 8, 5, 7, 4, 6, 8, 5].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${h * 2.5}px`,
                  background: "linear-gradient(180deg, #D4AF37, #B8941E)",
                  opacity: 0.5 + (i % 3) * 0.17,
                  animation: `bounce-dot ${0.6 + (i % 4) * 0.12}s ease-in-out ${i * 0.08}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleEnable}
              className="btn-gold flex-1 rounded-full py-2.5 text-sm font-bold"
              style={{ boxShadow: "0 0 18px rgba(212,175,55,0.3)" }}
            >
              🎵 Enable Music
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 rounded-full py-2.5 text-sm font-medium text-[#6B8098] transition-colors hover:text-[#9EADC8]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              Continue Without
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-[#4A5568]">
            Your preference is saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
