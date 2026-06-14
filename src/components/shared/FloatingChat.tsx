"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FloatingChat() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(true);

  useEffect(() => {
    // Show after 1s
    const t1 = setTimeout(() => setVisible(true), 1000);
    // Hide tooltip after 5s
    const t2 = setTimeout(() => setTooltip(false), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      {tooltip && (
        <div
          className="animate-slide-up relative max-w-[200px] rounded-2xl rounded-br-sm px-4 py-3 text-xs font-medium text-white shadow-2xl"
          style={{
            background: "#111827",
            border: "1px solid rgba(212,175,55,0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.1)",
          }}
        >
          <button
            onClick={() => setTooltip(false)}
            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#374151] text-[#9EADC8] hover:text-white text-xs leading-none"
            aria-label="Close tooltip"
          >
            ×
          </button>
          <p className="text-[#D4AF37] font-semibold">🤖 Nyaya AI</p>
          <p className="mt-0.5 text-[#9EADC8]">Ask me anything about Indian law in Hindi or English!</p>
          {/* Arrow */}
          <div
            className="absolute -bottom-2 right-6 h-0 w-0"
            style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid rgba(212,175,55,0.3)" }}
          />
        </div>
      )}

      {/* Main button */}
      <Link href="/chat" aria-label="Open AI Legal Assistant">
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-chat-pop"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #B8941E 100%)",
            boxShadow: "0 0 28px rgba(212,175,55,0.5), 0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-gold-ring"
            style={{ border: "2px solid rgba(212,175,55,0.6)" }}
          />

          {/* Logo */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1220]">
            <Image src="/logo.png" alt="AI Assistant" width={28} height={28} className="h-7 w-7 object-contain" />
          </div>

          {/* Online dot */}
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full"
            style={{ background: "#0B1220" }}
          >
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-gold-pulse" />
          </span>
        </div>
      </Link>
    </div>
  );
}
