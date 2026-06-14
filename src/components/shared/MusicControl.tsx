"use client";

import { useEffect, useRef, useState } from "react";
import { useMusic } from "@/context/MusicContext";

/* ── SVG icon components (no external library needed) ─────────────────── */

function Volume2Icon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeXIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function Volume1Icon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

/* ── Animated equaliser bars (only visible when playing) ──────────────── */
function EqBars() {
  return (
    <span className="flex items-end gap-px" aria-hidden="true">
      {[3, 5, 4, 6, 3].map((h, i) => (
        <span
          key={i}
          className="inline-block w-0.5 rounded-full"
          style={{
            height: `${h * 1.8}px`,
            background: "#D4AF37",
            animation: `bounce-dot ${0.55 + i * 0.08}s ease-in-out ${i * 0.07}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function MusicControl() {
  const { enabled, playing, volume, enable, disable, toggle, setVolume } = useMusic();
  const [showSlider, setShowSlider] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close panel when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowSlider(false);
      }
    };
    if (showSlider) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSlider]);

  /* Choose icon based on state */
  const Icon = !enabled ? VolumeXIcon : volume > 0.4 ? Volume2Icon : Volume1Icon;

  return (
    <div ref={panelRef} className="relative flex items-center">
      {/* Main button */}
      <button
        onClick={() => {
          if (!enabled) {
            enable();
          } else {
            setShowSlider((v) => !v);
          }
        }}
        onContextMenu={(e) => { e.preventDefault(); toggle(); }}
        title={enabled ? "Music on — click for options, right-click to mute" : "Enable ambient music"}
        aria-label={enabled ? "Music controls" : "Enable ambient music"}
        className="music-btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300"
        style={{
          background: enabled
            ? "rgba(212,175,55,0.12)"
            : "rgba(255,255,255,0.05)",
          border: enabled
            ? "1px solid rgba(212,175,55,0.4)"
            : "1px solid rgba(255,255,255,0.1)",
          color: enabled ? "#D4AF37" : "#6B8098",
        }}
      >
        <Icon size={14} />
        {playing ? <EqBars /> : (
          <span className="hidden sm:inline text-xs">
            {enabled ? "Music" : "Music"}
          </span>
        )}
      </button>

      {/* Volume panel */}
      {showSlider && enabled && (
        <div
          className="absolute right-0 top-full mt-2 z-[100] min-w-[200px] rounded-2xl p-4"
          style={{
            background: "linear-gradient(160deg, #0F1A2E, #111827)",
            border: "1px solid rgba(212,175,55,0.25)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.08)",
            animation: "slide-up 0.25s ease-out forwards",
          }}
        >
          {/* Panel header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">🎵 Ambient</span>
              {playing && <EqBars />}
            </div>
            <button
              onClick={toggle}
              className="rounded-full px-2.5 py-1 text-xs font-medium transition-all"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "#D4AF37",
              }}
            >
              {enabled ? "Mute" : "Unmute"}
            </button>
          </div>

          {/* Volume slider */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-[#6B8098]">Volume</span>
              <span className="text-xs font-semibold text-[#D4AF37]">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="relative flex items-center">
              <VolumeXIcon size={12} />
              <input
                type="range"
                min={0}
                max={0.30}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="music-range mx-2 flex-1"
                aria-label="Adjust music volume"
              />
              <Volume2Icon size={12} />
            </div>
            <p className="mt-2 text-center text-xs text-[#4A5568]">
              Max 30% to keep it subtle
            </p>
          </div>
        </div>
      )}

      <style>{`
        .music-btn:hover {
          background: rgba(212,175,55,0.12) !important;
          border-color: rgba(212,175,55,0.4) !important;
          color: #D4AF37 !important;
        }

        /* Custom range input styling */
        .music-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 99px;
          background: rgba(212,175,55,0.2);
          outline: none;
          cursor: pointer;
        }
        .music-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #B8941E);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(212,175,55,0.5);
          transition: transform 0.15s;
        }
        .music-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .music-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #B8941E);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 6px rgba(212,175,55,0.5);
        }
        .music-range::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 99px;
          background: linear-gradient(
            to right,
            rgba(212,175,55,0.7) 0%,
            rgba(212,175,55,0.7) var(--progress, 33%),
            rgba(212,175,55,0.15) var(--progress, 33%),
            rgba(212,175,55,0.15) 100%
          );
        }
      `}</style>
    </div>
  );
}
