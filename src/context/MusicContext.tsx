"use client";

/**
 * MusicContext — global ambient music state.
 *
 * Architecture:
 *  - A single <audio> element lives in the provider and NEVER unmounts.
 *  - Pages consume context — audio survives client-side navigation.
 *  - User preference (enabled, volume) persisted in localStorage.
 *  - Autoplay is NEVER initiated; the user must explicitly click "Enable".
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const KEY_ENABLED   = "nyayasetu_music_enabled";
const KEY_VOLUME    = "nyayasetu_music_volume";
const KEY_DISMISSED = "nyayasetu_music_dismissed";
const FADE_MS       = 50;  // interval ms between fade steps
const FADE_STEPS    = 40;  // total steps = 2 s fade duration

/**
 * Free, royalty-free ambient piano track from Pixabay.
 * No vocals, no beats — calm corporate/legal atmosphere.
 */
const MUSIC_URL =
  "https://cdn.pixabay.com/audio/2024/02/28/audio_0b1a2e5e2e.mp3";

type MusicCtx = {
  enabled:        boolean;
  playing:        boolean;
  volume:         number;
  promptDismissed:boolean;
  enable:         () => void;
  disable:        () => void;
  toggle:         () => void;
  setVolume:      (v: number) => void;
  dismissPrompt:  () => void;
};

const MusicContext = createContext<MusicCtx>({
  enabled: false, playing: false, volume: 0.10, promptDismissed: false,
  enable: () => {}, disable: () => {}, toggle: () => {},
  setVolume: () => {}, dismissPrompt: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const [enabled,         setEnabled]         = useState(false);
  const [playing,         setPlaying]         = useState(false);
  const [volume,          setVolumeState]     = useState(0.10);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [hydrated,        setHydrated]        = useState(false);

  /* ── Hydrate from localStorage after first mount ── */
  useEffect(() => {
    const storedVol  = localStorage.getItem(KEY_VOLUME);
    const dismissed  = localStorage.getItem(KEY_DISMISSED);
    if (storedVol)  setVolumeState(parseFloat(storedVol));
    if (dismissed)  setPromptDismissed(true);
    setHydrated(true);
  }, []);

  /* ── Create the single Audio element after hydration ── */
  useEffect(() => {
    if (!hydrated) return;

    const audio = new Audio();
    audio.src     = MUSIC_URL;
    audio.loop    = true;
    audio.volume  = 0;       // always start silent; we fade in
    audio.preload = "none";  // don't fetch until user enables

    audio.addEventListener("play",  () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", () => setPlaying(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [hydrated]);

  /* ── Fade helpers ── */
  const stopFade = () => {
    if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null; }
  };

  const fadeIn = useCallback((target: number) => {
    stopFade();
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    const step = target / FADE_STEPS;
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const next = Math.min(audioRef.current.volume + step, target);
      audioRef.current.volume = next;
      if (next >= target) stopFade();
    }, FADE_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fadeOut = useCallback((onDone?: () => void) => {
    stopFade();
    const audio = audioRef.current;
    if (!audio) return;
    const start = audio.volume;
    const step  = start / FADE_STEPS;
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const next = Math.max(audioRef.current.volume - step, 0);
      audioRef.current.volume = next;
      if (next <= 0) { stopFade(); audioRef.current.pause(); onDone?.(); }
    }, FADE_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Public API ── */
  const enable = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.preload = "auto";
    const target = parseFloat(localStorage.getItem(KEY_VOLUME) ?? "0.10");
    audio.play().then(() => {
      fadeIn(target);
      setEnabled(true);
      setPromptDismissed(true);
      localStorage.setItem(KEY_ENABLED,   "true");
      localStorage.setItem(KEY_DISMISSED, "true");
    }).catch(() => {
      // Browser policy blocked play — ignore silently
    });
  }, [fadeIn]);

  const disable = useCallback(() => {
    fadeOut(() => {
      setEnabled(false);
      localStorage.setItem(KEY_ENABLED, "false");
    });
  }, [fadeOut]);

  const toggle = useCallback(() => {
    enabled ? disable() : enable();
  }, [enabled, enable, disable]);

  const setVolume = useCallback((v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    localStorage.setItem(KEY_VOLUME, String(val));
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  const dismissPrompt = useCallback(() => {
    setPromptDismissed(true);
    localStorage.setItem(KEY_DISMISSED, "true");
  }, []);

  return (
    <MusicContext.Provider value={{
      enabled, playing, volume, promptDismissed,
      enable, disable, toggle, setVolume, dismissPrompt,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
