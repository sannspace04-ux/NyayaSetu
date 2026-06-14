"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// ── Speech Recognition ─────────────────────────────────────────────────────
type SpeechRecognitionCtor = new () => {
  lang: string; interimResults: boolean; maxAlternatives: number;
  onstart: (() => void) | null; onend: (() => void) | null; onerror: (() => void) | null;
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  start: () => void; stop: () => void;
};
function getSpeechAPI(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

// ── Types ──────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isOffline?: boolean;
};

type UploadedFile = {
  id: string; name: string; type: string; size: number; dataUrl: string; textContent: string;
};

// ── Constants ──────────────────────────────────────────────────────────────
const BG    = "#07111F";
const CARD  = "#111827";
const GOLD  = "#D4AF37";

const SAHARA_GREETINGS = {
  en: "Hello! I am Sahara AI, your legal assistant. How may I help you today?",
  hi: "नमस्ते! मैं Sahara AI हूँ। मैं आपकी कानूनी सहायता के लिए यहाँ हूँ। मैं आपकी कैसे मदद कर सकती हूँ?",
  hinglish: "Namaste! Main Sahara AI hoon. Aapke legal questions aur rights ke liye yahan hoon. Batayein, main kaise madad kar sakti hoon?",
};

const LEGAL_CATEGORIES = [
  "Consumer Rights", "Women Rights", "Child Rights", "Cyber Crime",
  "Property Disputes", "FIR Process", "Legal Aid / NALSA",
  "Domestic Violence", "Court Procedures", "Senior Citizen",
];

const SUGGESTED_PROMPTS = [
  "What are women's rights in India?",
  "FIR kaise file kare?",
  "Cyber fraud hua hai, kya karu?",
  "Property dispute me kya karna chahiye?",
  "What is anticipatory bail?",
  "Consumer complaint kaise karein?",
];

const HELPLINES = [
  { e: "🚨", l: "Emergency", n: "112" },
  { e: "👮", l: "Police",    n: "100" },
  { e: "👩", l: "Women",     n: "1091" },
  { e: "💻", l: "Cyber",     n: "1930" },
  { e: "⚖️", l: "NALSA",     n: "15100" },
  { e: "👶", l: "Child",     n: "1098" },
];

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

// ── Sub-components ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-[rgba(212,175,55,0.4)]"
        style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
      >
        <span className="text-sm">👩‍⚖️</span>
      </div>
      <div
        className="flex items-center gap-1.5 rounded-2xl rounded-bl-none px-4 py-3"
        style={{ background: CARD, border: "1px solid rgba(212,175,55,0.2)" }}
      >
        {[0, 0.2, 0.4].map((d, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ background: GOLD, animation: `bounce-dot 0.7s ease-in-out ${d}s infinite`, opacity: 0.8 }}
          />
        ))}
      </div>
    </div>
  );
}

function FilePreviewBadge({ file, onRemove }: { file: UploadedFile; onRemove?: () => void }) {
  const isImage = file.type.startsWith("image/");
  return (
    <div
      className="relative flex items-center gap-2 rounded-xl px-3 py-2 max-w-[180px]"
      style={{ background: CARD, border: "1px solid rgba(212,175,55,0.2)" }}
    >
      {isImage
        ? <img src={file.dataUrl} alt={file.name} className="h-8 w-8 rounded-lg object-cover shrink-0" />
        : <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-900/50 text-red-400 text-xs font-bold">PDF</div>
      }
      <div className="min-w-0">
        <p className="text-xs font-medium text-white truncate max-w-[100px]">{file.name}</p>
        <p className="text-[10px]" style={{ color: "#6B8098" }}>{(file.size / 1024).toFixed(0)} KB</p>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] hover:bg-red-600">✕</button>
      )}
    </div>
  );
}

function renderContent(text: string) {
  return text.split("\n").map((line, li, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={li}>
        {parts.map((part, pi) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={pi} style={{ color: GOLD }}>{part.slice(2, -2)}</strong>
            : <span key={pi}>{part}</span>
        )}
        {li < arr.length - 1 && <br />}
      </span>
    );
  });
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user } = useAuth();

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [input,         setInput]         = useState("");
  const [isLoading,     setIsLoading]     = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [isListening,   setIsListening]   = useState(false);
  const [voiceMuted,    setVoiceMuted]    = useState(false);
  const [hasTts,        setHasTts]        = useState(false);
  const [hasStt,        setHasStt]        = useState(false);
  const [pendingFiles,  setPendingFiles]  = useState<UploadedFile[]>([]);
  const [uploadError,   setUploadError]   = useState<string | null>(null);
  const [greetingLang,  setGreetingLang]  = useState<"en" | "hi" | "hinglish">("en");

  const endRef       = useRef<HTMLDivElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Capability check
  useEffect(() => {
    setHasTts(typeof window !== "undefined" && "speechSynthesis" in window);
    setHasStt(!!getSpeechAPI());
  }, []);

  // Sahara AI voice greeting
  const saharaGreeting = useCallback((lang: "en" | "hi" | "hinglish") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = SAHARA_GREETINGS[lang];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate  = 0.88;
    utterance.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") ||
      v.name.includes("Google UK English Female") ||
      v.name.toLowerCase().includes("female")
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Welcome message + voice greeting
  useEffect(() => {
    const firstName = user?.full_name?.split(" ")[0] || null;
    const welcomeText = firstName
      ? `Namaste, ${firstName}! 🙏\n\nमैं **Sahara AI** हूँ — Nyaya Setu का AI Legal Assistant.\n\nमैं भारतीय कानून, आपके अधिकार और कानूनी प्रक्रियाओं के बारे में **Hindi, English या Hinglish** में बता सकती हूँ।\n\nYou can also **upload evidence** (PDF, images) for analysis. 📎\n\n⚠️ This is general legal information, not formal legal advice. Consult a qualified advocate for your specific situation.`
      : `Namaste! 🙏\n\nमैं **Sahara AI** हूँ — आपका AI Legal Assistant.\n\nभारतीय कानून के बारे में Hindi, English या Hinglish में पूछें। Evidence upload भी कर सकते हैं। 📎\n\n⚠️ General legal information only — not formal legal advice.`;

    setMessages([{ id: "welcome", role: "assistant", content: welcomeText, timestamp: new Date() }]);

    // Auto voice greeting after a short delay
    const t = setTimeout(() => {
      if (!voiceMuted) saharaGreeting(greetingLang);
    }, 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // TTS for AI responses
  const speak = useCallback((text: string) => {
    if (voiceMuted || !hasTts) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*/g, "").replace(/⚠️[^\n]*/g, "").trim().slice(0, 500);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate  = 0.88;
    utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") || v.name.includes("Google UK English Female") ||
      v.name.toLowerCase().includes("female")
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, [voiceMuted, hasTts]);

  // Voice input
  const toggleVoiceInput = () => {
    const API = getSpeechAPI();
    if (!API) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const rec = new API();
    rec.lang = "hi-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onend   = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    recognitionRef.current = rec;
    rec.start();
  };

  // File upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newFiles: UploadedFile[] = [];
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`"${file.name}" not supported. Use PDF, JPG, or PNG.`); continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds 10 MB.`); continue;
      }
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const isImage = file.type.startsWith("image/");
      newFiles.push({
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name, type: file.type, size: file.size, dataUrl,
        textContent: isImage
          ? `[Image uploaded: "${file.name}" — please acknowledge and provide legal guidance]`
          : `[PDF uploaded: "${file.name}" — FIR copy, legal notice, agreement or court document — please acknowledge and advise]`,
      });
    }
    setPendingFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Download chat as text
  const downloadChat = () => {
    const lines = messages.map(m =>
      `[${m.role.toUpperCase()} ${m.timestamp.toLocaleTimeString("en-IN")}]\n${m.content}`
    ).join("\n\n---\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `sahara-ai-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send message
  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    const attachments = [...pendingFiles];
    const userMsg: Message = {
      id: `u-${Date.now()}`, role: "user",
      content: userText + (attachments.length ? `\n📎 ${attachments.map(f => f.name).join(", ")}` : ""),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setPendingFiles([]);
    setUploadError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    setSessionTopics(prev => {
      const topic = userText.slice(0, 45);
      return prev.includes(topic) ? prev : [topic, ...prev].slice(0, 8);
    });

    try {
      const history = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

      const evidenceContext = attachments.map(f => f.textContent).join("\n") || undefined;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: userText }], evidenceContext }),
      });

      const data = await res.json();
      const aiText: string = data.text || data.fallback
        ? (data.text || "I'm currently in offline mode. Please try again shortly.")
        : "I could not process that. Please rephrase your question.";

      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`, role: "assistant",
        content: aiText, timestamp: new Date(), isOffline: !!data.fallback,
      }]);
      speak(aiText);
    } catch {
      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`, role: "assistant",
        content: "I'm having connectivity issues. For urgent help: Police **100** · Women **1091** · Cyber **1930** · Emergency **112**\n\n⚠️ General legal information only — not formal legal advice.",
        timestamp: new Date(), isOffline: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: `welcome-${Date.now()}`, role: "assistant",
      content: "Namaste! 🙏\n\nNew conversation started with **Sahara AI**.\n\nHindi, English या Hinglish में अपना कानूनी प्रश्न पूछें।\n\n⚠️ General legal information only — not formal legal advice.",
      timestamp: new Date(),
    }]);
    setPendingFiles([]); setUploadError(null); setSidebarOpen(false);
    if (!voiceMuted) saharaGreeting(greetingLang);
  };

  const userInitial = user
    ? (user.full_name?.charAt(0) || user.email.charAt(0)).toUpperCase()
    : "U";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BG }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col shadow-2xl transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0B1220", borderRight: "1px solid rgba(212,175,55,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nyaya Setu" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-serif text-sm font-bold text-white">Nyaya<span style={{ color: GOLD }}>Setu</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1 text-[#6B8098] hover:text-white lg:hidden">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <button
            onClick={startNewChat}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-[#07111F] transition-all hover:opacity-90 active:scale-95"
            style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
          >
            + New Chat
          </button>

          {/* Greeting language picker */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B8098" }}>Greeting Language</p>
            <div className="flex gap-1.5">
              {(["en","hi","hinglish"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => { setGreetingLang(l); if (!voiceMuted) saharaGreeting(l); }}
                  className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: greetingLang === l ? `rgba(212,175,55,0.2)` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${greetingLang === l ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.06)"}`,
                    color: greetingLang === l ? GOLD : "#6B8098",
                  }}
                >
                  {l === "en" ? "EN" : l === "hi" ? "HI" : "HGL"}
                </button>
              ))}
            </div>
          </div>

          {/* Legal categories */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B8098" }}>Legal Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {LEGAL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { sendMessage(`Tell me about ${cat} in India`); setSidebarOpen(false); }}
                  className="rounded-full px-2.5 py-1 text-xs font-medium transition-all hover:border-[rgba(212,175,55,0.5)] hover:text-[#D4AF37]"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.14)", color: "#9EADC8" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B8098" }}>Emergency</p>
            <div className="grid grid-cols-2 gap-1.5">
              {HELPLINES.map(h => (
                <a key={h.n} href={`tel:${h.n}`}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.12)" }}
                >
                  <span>{h.e}</span>
                  <span className="font-bold" style={{ color: GOLD }}>{h.n}</span>
                  <span style={{ color: "#6B8098" }}>{h.l}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Session topics */}
          {sessionTopics.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B8098" }}>This Session</p>
              <div className="space-y-1">
                {sessionTopics.map((t, i) => (
                  <div key={i} className="truncate rounded-lg px-3 py-2 text-xs" style={{ color: "#9EADC8", background: "rgba(255,255,255,0.03)" }}>{t}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4" style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}>
          {user
            ? <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#6B8098] hover:text-white">← Dashboard</Link>
            : <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: GOLD }}>Login to save chats →</Link>
          }
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main chat ───────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 backdrop-blur-md"
          style={{ background: "rgba(11,18,32,0.95)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}
        >
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-[#6B8098] hover:text-white lg:hidden">☰</button>

            {/* Sahara AI avatar */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-2 ring-[rgba(212,175,55,0.4)] text-lg"
              style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
            >
              👩‍⚖️
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sahara AI</p>
              <p className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Legal Assistant · Hindi &amp; English &amp; Hinglish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice mute toggle */}
            {hasTts && (
              <button
                onClick={() => setVoiceMuted(v => !v)}
                title={voiceMuted ? "Enable voice" : "Mute voice"}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: voiceMuted ? "rgba(255,255,255,0.06)" : "rgba(212,175,55,0.12)",
                  border: `1px solid ${voiceMuted ? "rgba(255,255,255,0.1)" : "rgba(212,175,55,0.35)"}`,
                  color: voiceMuted ? "#6B8098" : GOLD,
                }}
              >
                {voiceMuted ? "🔇 Muted" : "🔊 Voice"}
              </button>
            )}

            {/* Download chat */}
            <button
              onClick={downloadChat}
              title="Download chat as text"
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[#6B8098] transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              ⬇ Save
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="px-4 py-1.5 text-center text-xs"
          style={{ background: "rgba(212,175,55,0.06)", borderBottom: "1px solid rgba(212,175,55,0.1)", color: "#B8941E" }}
        >
          ⚠️ Sahara AI provides general legal information only — not formal legal advice.
          Urgent: Police <a href="tel:100" className="font-bold underline">100</a> ·
          Women <a href="tel:1091" className="font-bold underline">1091</a> ·
          Cyber <a href="tel:1930" className="font-bold underline">1930</a> ·
          Emergency <a href="tel:112" className="font-bold underline">112</a>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-y-auto px-4 py-6" style={{ background: BG }}>
          <div className="mx-auto max-w-2xl space-y-5">
            {messages.map(msg => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  {isUser ? (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#07111F]"
                      style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
                    >
                      {userInitial}
                    </div>
                  ) : (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 ring-[rgba(212,175,55,0.4)]"
                      style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
                    >
                      👩‍⚖️
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className="max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg"
                    style={isUser
                      ? { background: `linear-gradient(135deg,${GOLD},#B8941E)`, color: "#07111F", fontWeight: 600, borderRadius: "16px 4px 16px 16px" }
                      : { background: CARD, border: "1px solid rgba(212,175,55,0.18)", color: "#E2E8F0", borderRadius: "4px 16px 16px 16px" }
                    }
                  >
                    <div className="whitespace-pre-wrap break-words">{renderContent(msg.content)}</div>
                    {msg.isOffline && (
                      <span
                        className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}
                      >
                        📚 Offline Mode
                      </span>
                    )}
                    <p className="mt-1.5 text-xs" style={{ color: isUser ? "rgba(7,17,31,0.6)" : "#4A5568" }}>
                      {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            {isLoading && <TypingDots />}
            <div ref={endRef} />
          </div>
        </div>

        {/* Suggested prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-2" style={{ background: BG }}>
            <div className="mx-auto max-w-2xl flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-full px-3 py-1.5 text-xs transition-all"
                  style={{
                    background: "rgba(212,175,55,0.07)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "#9EADC8",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#9EADC8"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.2)"; }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div
          className="px-4 py-3.5 backdrop-blur-md"
          style={{ background: "rgba(11,18,32,0.95)", borderTop: "1px solid rgba(212,175,55,0.12)" }}
        >
          <div className="mx-auto max-w-2xl space-y-2">
            {pendingFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {pendingFiles.map(f => <FilePreviewBadge key={f.id} file={f} onRemove={() => setPendingFiles(prev => prev.filter(x => x.id !== f.id))} />)}
              </div>
            )}
            {uploadError && <p className="text-xs text-red-400">⚠️ {uploadError}</p>}

            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex items-end gap-2">
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={handleFileSelect} />

              {/* Attach */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Upload evidence (PDF, JPG, PNG)"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-40 hover:text-[#D4AF37]"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.2)", color: "#9EADC8" }}
              >
                📎
              </button>

              {/* Textarea */}
              <div
                className="flex-1 rounded-2xl px-4 py-3 transition-all"
                style={{
                  background: "rgba(7,17,31,0.8)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
                onFocus={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(212,175,55,0.5)"}
                onBlur={e  => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(212,175,55,0.2)"}
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  disabled={isLoading}
                  placeholder="Hindi, English या Hinglish में पूछें… | Ask Sahara AI…"
                  className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder-[#4A5568] disabled:opacity-50"
                  style={{ maxHeight: "120px", overflowY: "auto" }}
                />
              </div>

              {/* Voice */}
              {hasStt && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  title={isListening ? "Stop listening" : "Voice input"}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-40"
                  style={{
                    background: isListening ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isListening ? "rgba(239,68,68,0.5)" : "rgba(212,175,55,0.2)"}`,
                    color: isListening ? "#EF4444" : "#9EADC8",
                    animation: isListening ? "gold-pulse 0.8s ease-in-out infinite" : "none",
                  }}
                >
                  🎤
                </button>
              )}

              {/* Send */}
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && pendingFiles.length === 0)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#07111F] shadow-md transition-all active:scale-95 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)`, boxShadow: `0 0 14px rgba(212,175,55,0.3)` }}
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>

            <p className="text-center text-xs" style={{ color: "#4A5568" }}>
              Sahara AI · 📎 Upload Evidence · 🎤 Voice Input · ⬇ Save Chat · Hindi / English / Hinglish
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
