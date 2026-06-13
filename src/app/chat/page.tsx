"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import WatermarkLogo from "@/components/shared/WatermarkLogo";
import { getOfflineAnswer } from "@/lib/offlineKnowledge";

// ── Speech Recognition ────────────────────────────────────────────────────────
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

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isOffline?: boolean;
  attachments?: UploadedFile[];
};

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;      // for image preview
  textContent: string;  // description passed to AI
};

type AssistantMode = "online" | "offline";

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE_MB = 10;

const LEGAL_CATEGORIES = [
  "Consumer Rights", "Women Rights", "Child Rights", "Cyber Crime",
  "Property Disputes", "FIR Process", "Legal Aid / NALSA",
  "Government Schemes", "Court Procedures", "Domestic Violence",
];

const SUGGESTED_PROMPTS = [
  "What are women's rights in India?",
  "What are men's rights in India?",
  "FIR kaise file kare?",
  "Cyber fraud hua hai, kya karu?",
  "Property dispute me kya karna chahiye?",
  "Domestic violence case me kya rights hain?",
];

const HELPLINES = [
  { emoji: "🚨", label: "Emergency", number: "112" },
  { emoji: "👮", label: "Police", number: "100" },
  { emoji: "👩", label: "Women", number: "1091" },
  { emoji: "💻", label: "Cyber", number: "1930" },
  { emoji: "⚖️", label: "NALSA", number: "15100" },
  { emoji: "🧒", label: "Child", number: "1098" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-primary text-base select-none">
        👩‍⚖️
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-border bg-surface px-4 py-3 shadow-sm">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-primary/50"
            style={{ animation: `bounce-dot 0.8s ease-in-out ${delay}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function FilePreviewBadge({ file, onRemove }: { file: UploadedFile; onRemove?: () => void }) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="relative flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-sm max-w-[200px]">
      {isImage ? (
        <img src={file.dataUrl} alt={file.name} className="h-8 w-8 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 text-xs font-bold">PDF</div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-primary truncate max-w-[110px]">{file.name}</p>
        <p className="text-[10px] text-muted">{(file.size / 1024).toFixed(0)} KB</p>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] hover:bg-red-600"
          aria-label="Remove file">✕</button>
      )}
    </div>
  );
}

function MessageBubble({ msg, userInitial }: { msg: Message; userInitial: string }) {
  const isUser = msg.role === "user";

  function renderContent(text: string) {
    return text.split("\n").map((line, li, arr) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={li}>
          {parts.map((part, pi) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={pi}>{part.slice(2, -2)}</strong>
              : <span key={pi}>{part}</span>
          )}
          {li < arr.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{userInitial}</div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light ring-2 ring-accent/20">
          <Image src="/logo.png" alt="AI" width={20} height={20} className="h-4 w-4 object-contain" />
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[84%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {/* Attachments above bubble (user messages only) */}
        {isUser && msg.attachments && msg.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {msg.attachments.map(f => <FilePreviewBadge key={f.id} file={f} />)}
          </div>
        )}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-none bg-primary text-white"
            : "rounded-bl-none border border-border bg-surface text-primary"
        }`}>
          <div className="whitespace-pre-wrap break-words">{renderContent(msg.content)}</div>
          {msg.isOffline && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
              📚 Offline Knowledge Base
            </span>
          )}
          <p className={`mt-1.5 text-xs ${isUser ? "text-white/50" : "text-muted"}`}>
            {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ mode }: { mode: AssistantMode }) {
  if (mode === "online") {
    return (
      <p className="text-xs text-emerald-600 flex items-center gap-1">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Online · Groq AI (Llama 3.3 70B) · Hindi / English / Hinglish
      </p>
    );
  }
  return (
    <p className="text-xs text-amber-600 flex items-center gap-1">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
      Offline Mode · Built-in Legal Knowledge
    </p>
  );
}

// ── File reading utility ──────────────────────────────────────────────────────

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildFileTextDescription(file: UploadedFile): string {
  const isImage = file.type.startsWith("image/");
  return isImage
    ? `[Image file uploaded: "${file.name}" (${(file.size / 1024).toFixed(0)} KB). This appears to be a photo/screenshot. Please acknowledge you've received this image evidence and provide relevant legal guidance based on the context of the user's question.]`
    : `[PDF document uploaded: "${file.name}" (${(file.size / 1024).toFixed(0)} KB). This is a document — it could be an FIR copy, legal notice, agreement, bill, or court document. Please acknowledge receipt and provide relevant legal guidance based on the context of the user's question and the document type.]`;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("online");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [hasTts, setHasTts] = useState(false);
  const [hasStt, setHasStt] = useState(false);

  // Evidence upload state
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Browser capability detection
  useEffect(() => {
    setHasTts(typeof window !== "undefined" && "speechSynthesis" in window);
    setHasStt(!!getSpeechAPI());
  }, []);

  // Welcome message
  useEffect(() => {
    const firstName = user?.full_name?.split(" ")[0] || null;
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: firstName
        ? `Namaste, ${firstName}! 🙏\n\nमैं Nyaya Setu का AI Legal Assistant हूँ। मैं आपको भारतीय कानून, आपके अधिकार और कानूनी प्रक्रियाओं के बारे में **हिंदी, English या Hinglish** में बता सकता हूँ।\n\nI am Nyaya Setu's AI Legal Assistant powered by **Groq AI (Llama 3.3 70B)**. Ask me anything about Indian law.\n\nYou can also **upload evidence** (PDF, images) for analysis. 📎\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.`
        : `Namaste! 🙏\n\nमैं Nyaya Setu का AI Legal Assistant हूँ — powered by **Groq AI (Llama 3.3 70B)**.\n\nमैं हिंदी, English और Hinglish में भारतीय कानून के बारे में जानकारी देता हूँ।\n\nYou can also **upload evidence documents** (PDF, photos, screenshots) for analysis. 📎\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.`,
      timestamp: new Date(),
    }]);
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // TTS
  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !hasTts) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*/g, "").replace(/⚠️[^\n]*/g, "").trim().slice(0, 500);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") || v.name.includes("Google UK English Female") ||
      v.name.toLowerCase().includes("female") ||
      (v.lang.startsWith("hi") && !v.name.toLowerCase().includes("male"))
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled, hasTts]);

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
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    recognitionRef.current = rec;
    rec.start();
  };

  // ── Evidence upload handler ───────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newFiles: UploadedFile[] = [];
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`"${file.name}" is not supported. Upload PDF, JPG, JPEG, or PNG.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        continue;
      }
      const dataUrl = await readFileAsDataUrl(file);
      const uploadedFile: UploadedFile = {
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
        textContent: buildFileTextDescription({
          id: "", name: file.name, type: file.type,
          size: file.size, dataUrl, textContent: "",
        }),
      };
      newFiles.push(uploadedFile);
    }

    setPendingFiles(prev => [...prev, ...newFiles]);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (id: string) => {
    setPendingFiles(prev => prev.filter(f => f.id !== id));
  };

  // ── Core: Groq → offline KB fallback ─────────────────────────────────────
  const getAnswer = async (
    userText: string,
    history: Message[],
    attachments: UploadedFile[]
  ): Promise<{ text: string; isOffline: boolean }> => {
    const messages = [
      ...history
        .filter(m => m.id !== "welcome" && !m.isOffline)
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      { role: "user", content: userText },
    ];

    const evidenceContext = attachments.length > 0
      ? attachments.map(f => f.textContent).join("\n\n")
      : undefined;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, evidenceContext }),
      });

      const data = await res.json();

      if (data.fallback === true) {
        console.warn("[Chat] Groq unavailable — using offline KB");
        setMode("offline");
        return { text: getOfflineAnswer(userText), isOffline: true };
      }

      if (!res.ok || data.error || !data.text) {
        console.warn("[Chat] API error — offline KB:", data.error ?? "no text");
        setMode("offline");
        return { text: getOfflineAnswer(userText), isOffline: true };
      }

      setMode("online");
      console.log("[Chat] ✅ Groq reply:", data.model, `${data.text.length} chars`);
      return { text: data.text as string, isOffline: false };

    } catch {
      console.warn("[Chat] Network error — offline KB");
      setMode("offline");
      return { text: getOfflineAnswer(userText), isOffline: true };
    }
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    const attachmentsToSend = [...pendingFiles];

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date(),
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setPendingFiles([]);
    setUploadError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    setSessionTopics(prev => {
      const topic = userText.slice(0, 45);
      if (prev.length === 0) return [topic];
      if (prev.includes(topic)) return prev;
      return [topic, ...prev].slice(0, 8);
    });

    const { text: aiText, isOffline } = await getAnswer(userText, messages, attachmentsToSend);

    setMessages(prev => [...prev, {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: aiText,
      timestamp: new Date(),
      isOffline,
    }]);
    speak(aiText);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const startNewChat = () => {
    setMessages([{
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: "Namaste! 🙏 New conversation started.\n\nनई बातचीत शुरू हुई। हिंदी, English या Hinglish में अपना कानूनी प्रश्न पूछें।\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.",
      timestamp: new Date(),
    }]);
    setPendingFiles([]);
    setUploadError(null);
    setSidebarOpen(false);
  };

  const userInitial = user
    ? (user.full_name?.charAt(0) || user.email.charAt(0)).toUpperCase()
    : "U";

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nyaya Setu" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-serif text-sm font-bold text-primary">Nyaya Setu</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1 text-muted hover:text-primary lg:hidden" aria-label="Close sidebar">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <button onClick={startNewChat} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-light active:scale-95">
            + New Chat / नई बातचीत
          </button>

          {/* Legal categories */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Legal Areas / कानूनी विषय</p>
            <div className="flex flex-wrap gap-1.5">
              {LEGAL_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => { sendMessage(`Tell me about ${cat} in India`); setSidebarOpen(false); }}
                  className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-all hover:bg-accent/15 hover:text-accent">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency helplines */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Emergency / आपातकाल</p>
            <div className="grid grid-cols-2 gap-1.5">
              {HELPLINES.map(h => (
                <a key={h.number} href={`tel:${h.number}`}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted hover:border-primary/40 hover:text-primary transition-all">
                  <span>{h.emoji}</span>
                  <span className="font-semibold text-primary">{h.number}</span>
                  <span className="text-[10px] text-muted">{h.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Session history */}
          {sessionTopics.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">This Session</p>
              <div className="space-y-1">
                {sessionTopics.map((t, i) => (
                  <div key={i} className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-primary/5 truncate">{t}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          {user
            ? <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted hover:text-primary">← Dashboard</Link>
            : <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-accent hover:underline">Login to save chats →</Link>
          }
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main chat area ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <WatermarkLogo opacity={0.04} size={380} />

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-muted hover:text-primary lg:hidden" aria-label="Open sidebar">☰</button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light ring-2 ring-accent/25 shadow-sm">
              <Image src="/logo.png" alt="AI" width={22} height={22} className="h-5 w-5 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-primary">Nyaya AI Legal Assistant</p>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                  🤖 AI Legal Assistant (Online + Offline Support)
                </span>
              </div>
              <StatusBadge mode={mode} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasTts && (
              <button onClick={() => setTtsEnabled(v => !v)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${ttsEnabled ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-primary/40 hover:text-primary"}`}>
                {ttsEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer bar */}
        <div className="border-b border-amber-100 bg-amber-50/80 px-4 py-1.5 backdrop-blur-sm">
          <p className="text-center text-xs text-amber-700">
            ⚠️ AI responses are informational only — not legal advice. Urgent help: Police <a href="tel:100" className="font-bold underline">100</a> · Women <a href="tel:1091" className="font-bold underline">1091</a> · Cyber <a href="tel:1930" className="font-bold underline">1930</a> · Emergency <a href="tel:112" className="font-bold underline">112</a>
          </p>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-2xl space-y-5">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} userInitial={userInitial} />
            ))}
            {isLoading && <TypingDots />}
            <div ref={endRef} />
          </div>
        </div>

        {/* Suggested prompts — fresh chat only */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="mx-auto max-w-2xl flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted shadow-sm transition-all hover:border-accent hover:bg-accent/5 hover:text-accent">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input area ────────────────────────────────────────────────────── */}
        <div className="border-t border-border bg-surface/90 px-4 py-3.5 backdrop-blur-md">
          <div className="mx-auto max-w-2xl space-y-2">

            {/* Pending file previews */}
            {pendingFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {pendingFiles.map(f => (
                  <FilePreviewBadge key={f.id} file={f} onRemove={() => removePendingFile(f.id)} />
                ))}
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span>⚠️</span> {uploadError}
              </p>
            )}

            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex items-end gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                aria-label="Upload evidence"
              />

              {/* Upload evidence button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Upload Evidence | साक्ष्य अपलोड करें (PDF, JPG, PNG)"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm transition-all hover:border-primary hover:text-primary disabled:opacity-40"
                aria-label="Upload Evidence"
              >
                📎
              </button>

              {/* Textarea */}
              <div className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Hindi, English या Hinglish में पूछें… | Ask your legal question… (Enter to send)"
                  className="w-full resize-none bg-transparent text-sm text-primary outline-none placeholder:text-muted disabled:opacity-50"
                  style={{ maxHeight: "120px", overflowY: "auto" }}
                />
              </div>

              {/* Voice button */}
              {hasStt && (
                <button type="button" onClick={toggleVoiceInput} disabled={isLoading}
                  title={isListening ? "Stop listening" : "Voice input (Hindi/English)"}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all disabled:opacity-40 ${isListening ? "border-red-300 bg-red-50 text-red-500 animate-pulse" : "border-border bg-surface text-muted hover:border-primary hover:text-primary"}`}>
                  🎤
                </button>
              )}

              {/* Send button */}
              <button type="submit" disabled={isLoading || (!input.trim() && pendingFiles.length === 0)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary-light active:scale-95 disabled:opacity-40"
                aria-label="Send message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>

            {/* Upload hint */}
            <p className="text-center text-xs text-muted">
              📎 Upload Evidence / साक्ष्य अपलोड करें (PDF, JPG, PNG) &nbsp;·&nbsp; हिंदी या English में टाइप करें
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
