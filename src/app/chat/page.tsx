"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

// ── Speech Recognition (browser-only) ────────────────────────────────────────
type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechAPI(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}
// ─────────────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
};

// Gemini model — try flash first, fall back to pro
const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro",
];

const SYSTEM_INSTRUCTION = `You are Nyaya Setu's AI Legal Assistant — a knowledgeable, empathetic guide specializing in Indian law.

STRICT RULES:
1. Answer only questions about Indian law, legal rights, court procedures, and related topics.
2. ALWAYS respond in the SAME LANGUAGE the user writes in (Hindi → reply in Hindi, English → reply in English).
3. Structure answers with bullet points, numbered steps, and **bold** headings for clarity.
4. Cite the relevant law whenever possible (e.g., IPC Section 498A, DV Act 2005, POSH Act 2013).
5. For urgent safety situations, immediately mention: Police 100, Women Helpline 1091, Cyber Crime 1930.
6. NEVER fabricate legal citations, case names, or judgments.
7. ALWAYS end EVERY response with exactly this disclaimer on a new line:
   ⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। अपनी विशिष्ट स्थिति के लिए किसी योग्य अधिवक्ता से परामर्श करें। | This is general legal information, not formal legal advice. Consult a qualified advocate for your specific situation.`;

const LEGAL_CATEGORIES = [
  "Property Disputes", "Divorce", "Alimony", "Child Custody",
  "Domestic Violence", "False Cases", "Consumer Rights",
  "Cyber Crime", "Workplace Harassment",
];

const SUGGESTED_PROMPTS = [
  "How do I file for divorce in India?",
  "भारत में सम्पत्ति विवाद में मेरे क्या अधिकार हैं?",
  "How to report cyber crime in India?",
  "Section 498A IPC क्या है?",
  "How to file a consumer complaint?",
  "What is anticipatory bail?",
];

// ── Components ────────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary">
        <Image src="/logo.png" alt="AI" width={20} height={20} className="h-4 w-4 object-contain" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-border bg-surface px-4 py-3 shadow-sm">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-primary/50"
            style={{ animation: `bounce-dot 0.8s ease-in-out ${delay}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg, userInitial }: { msg: Message; userInitial: string }) {
  const isUser = msg.role === "user";

  // Parse **bold** and preserve line breaks
  function renderContent(text: string) {
    return text.split("\n").map((line, li) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={li}>
          {parts.map((part, pi) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={pi}>{part.slice(2, -2)}</strong>
              : <span key={pi}>{part}</span>
          )}
          {li < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
          {userInitial}
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light ring-2 ring-accent/20">
          <Image src="/logo.png" alt="AI" width={20} height={20} className="h-4 w-4 object-contain" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-none bg-primary text-white"
            : msg.isError
            ? "rounded-bl-none border border-red-200 bg-red-50 text-red-800"
            : "rounded-bl-none border border-border bg-surface text-primary"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{renderContent(msg.content)}</div>
        <p className={`mt-1.5 text-xs ${isUser ? "text-white/50" : "text-muted"}`}>
          {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [hasTts, setHasTts] = useState(false);
  const [hasStt, setHasStt] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Detect browser capabilities once
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
        ? `Namaste, ${firstName}! 🙏\n\nमैं Nyaya Setu का AI Legal Assistant हूँ। मैं आपको भारतीय कानून, आपके अधिकार और कानूनी प्रक्रियाओं के बारे में अंग्रेजी या हिंदी में बता सकता हूँ।\n\nI am Nyaya Setu's AI Legal Assistant. Ask me anything about Indian law in English or Hindi.\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.`
        : `Namaste! 🙏\n\nमैं Nyaya Setu का AI Legal Assistant हूँ। मैं आपको भारतीय कानून के बारे में हिंदी या अंग्रेजी में बता सकता हूँ।\n\nI am Nyaya Setu's AI Legal Assistant. Ask me about Indian law in English or Hindi.\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.`,
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
    const clean = text
      .replace(/\*\*/g, "")
      .replace(/⚠️[^\n]*/g, "")
      .replace(/#+\s/g, "")
      .trim()
      .slice(0, 500); // limit length for TTS
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    // Try to get a female voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") ||
      v.name.includes("Google UK English Female") ||
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

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new API();
    rec.lang = "hi-IN";          // primary: Hindi
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInput(t);
    };
    recognitionRef.current = rec;
    rec.start();
  };

  // Call Gemini API with model fallback
  const callGemini = async (userText: string, history: Message[]): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("NO_KEY");
    }

    const contents = [
      ...history
        .filter(m => m.id !== "welcome" && !m.isError)
        .map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      { role: "user", parts: [{ text: userText }] },
    ];

    let lastError = "";
    for (const model of GEMINI_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
              contents,
              generationConfig: {
                temperature: 0.35,
                topP: 0.85,
                topK: 40,
                maxOutputTokens: 1200,
              },
              safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
              ],
            }),
          }
        );

        const data = await res.json();

        if (data.error) {
          lastError = data.error.message || "API error";
          // 404 = model not found, try next
          if (data.error.code === 404) continue;
          // 400 with invalid key
          if (data.error.status === "INVALID_ARGUMENT" || data.error.message?.toLowerCase().includes("api key")) {
            throw new Error("INVALID_KEY: " + data.error.message);
          }
          // 400 = bad request
          if (data.error.code === 400) throw new Error(data.error.message);
          // 403 = key not authorised for this API
          if (data.error.code === 403) throw new Error("INVALID_KEY: " + (data.error.message || "API key not authorized"));
          throw new Error(lastError);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response from Gemini");
        return text;
      } catch (e) {
        lastError = e instanceof Error ? e.message : "Unknown error";
        if (lastError === "INVALID_KEY" || lastError.includes("API_KEY")) throw e;
        // Try next model on network/model errors
        continue;
      }
    }

    throw new Error(lastError || "All Gemini models unavailable");
  };

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    // Track topics this session
    setSessionTopics(prev => {
      if (prev.length === 0) return [userText.slice(0, 45)];
      if (prev.find(t => t === userText.slice(0, 45))) return prev;
      return [userText.slice(0, 45), ...prev].slice(0, 8);
    });

    try {
      const aiText = await callGemini(userText, messages);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      speak(aiText);
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Unknown error";

      let friendly: string;
      if (raw === "NO_KEY") {
        friendly = "🔑 Gemini API key not configured.\n\nTo enable the AI assistant:\n1. Go to https://aistudio.google.com/app/apikey\n2. Create a free API key\n3. Add it to .env.local as NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...\n4. Restart the development server\n\n📞 While setting up, call NALSA (15100) for free legal aid.\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.";
      } else if (raw === "INVALID_KEY" || raw.includes("API_KEY") || raw.includes("API key") || raw.includes("invalid") || raw.includes("INVALID")) {
        friendly = "🔑 Invalid Gemini API key.\n\nThe API key in .env.local is not valid. Valid Gemini keys start with 'AIzaSy'.\n\n1. Go to https://aistudio.google.com/app/apikey\n2. Create or copy a valid API key\n3. Update NEXT_PUBLIC_GEMINI_API_KEY in .env.local\n4. Restart the dev server\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.";
      } else if (raw.includes("quota") || raw.includes("QUOTA") || raw.includes("429")) {
        friendly = "⏳ Rate limit reached\n\nGemini API quota exceeded. Please wait a moment and try again. If this persists, check your API quota at aistudio.google.com.\n\n📞 While waiting, you can call NALSA (15100) for free legal aid.\n\n⚠️ Disclaimer: This is general legal information, not formal legal advice.";
      } else if (raw.includes("fetch") || raw.includes("network") || raw.includes("Failed to fetch")) {
        friendly = "📡 Network error\n\nCould not reach the AI service. Please check your internet connection and try again.\n\n📞 For urgent legal help: Police 100 · Women Helpline 1091 · Cyber Crime 1930\n\n⚠️ Disclaimer: This is general legal information, not formal legal advice.";
      } else {
        friendly = `❌ AI service temporarily unavailable\n\nError: ${raw}\n\nIn the meantime:\n• Browse the **Case Library** for legal precedents\n• Check **Know Your Rights** for your entitlements\n• Call **15100** (NALSA) for free legal aid\n• Call **100** for Police emergency\n\n⚠️ Disclaimer: This is general legal information, not formal legal advice.`;
      }

      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`,
        role: "assistant",
        content: friendly,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: "Namaste! 🙏 New conversation started.\n\nनई बातचीत शुरू हुई। आप हिंदी या अंग्रेजी में अपना कानूनी प्रश्न पूछ सकते हैं।\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। | This is general legal information, not formal legal advice.",
      timestamp: new Date(),
    }]);
    setSidebarOpen(false);
  };

  const userInitial = user
    ? (user.full_name?.charAt(0) || user.email.charAt(0)).toUpperCase()
    : "U";

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-72 flex-col
        border-r border-border bg-surface shadow-xl
        transition-transform duration-300
        lg:relative lg:translate-x-0 lg:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo row */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nyaya Setu" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-serif text-sm font-bold text-primary">Nyaya Setu</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-muted hover:text-primary lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* New chat */}
          <button
            onClick={startNewChat}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-light active:scale-95"
          >
            + New Chat
          </button>

          {/* Legal areas */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Legal Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {LEGAL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { sendMessage(`Tell me about ${cat} laws in India`); setSidebarOpen(false); }}
                  className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-all hover:bg-accent/15 hover:text-accent"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Session history */}
          {sessionTopics.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">This Session</p>
              <div className="space-y-1">
                {sessionTopics.map((t, i) => (
                  <div key={i} className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-primary/5 truncate">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted hover:text-primary">
              ← Dashboard
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
              Login to save chats →
            </Link>
          )}
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main chat area ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <WatermarkLogo opacity={0.04} size={380} />

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-muted hover:text-primary lg:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light ring-2 ring-accent/25 shadow-sm">
              <Image src="/logo.png" alt="AI" width={22} height={22} className="h-5 w-5 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Nyaya AI Legal Assistant</p>
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online · Gemini AI · Hindi &amp; English
              </p>
            </div>
          </div>

          {/* TTS toggle */}
          {hasTts && (
            <button
              onClick={() => setTtsEnabled(v => !v)}
              title={ttsEnabled ? "Disable voice responses" : "Enable voice responses"}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                ttsEnabled
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-primary/40 hover:text-primary"
              }`}
            >
              {ttsEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="border-b border-amber-100 bg-amber-50/80 px-4 py-1.5 backdrop-blur-sm">
          <p className="text-center text-xs text-amber-700">
            ⚠️ AI responses are informational only — not legal advice. For urgent help: Police <a href="tel:100" className="font-bold underline">100</a> · Women <a href="tel:1091" className="font-bold underline">1091</a> · Cyber <a href="tel:1930" className="font-bold underline">1930</a>
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

        {/* Suggested prompts (only on fresh chat) */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="mx-auto max-w-2xl flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted shadow-sm transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-surface/90 px-4 py-3.5 backdrop-blur-md">
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={e => { e.preventDefault(); sendMessage(); }}
              className="flex items-end gap-2"
            >
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
                  placeholder="Ask in English or Hindi... (Enter to send, Shift+Enter for new line)"
                  className="w-full resize-none bg-transparent text-sm text-primary outline-none placeholder:text-muted disabled:opacity-50"
                  style={{ maxHeight: "120px", overflowY: "auto" }}
                />
              </div>

              {/* Voice button */}
              {hasStt && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  title={isListening ? "Stop listening" : "Voice input (Hindi/English)"}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-all disabled:opacity-40 ${
                    isListening
                      ? "border-red-300 bg-red-50 text-red-500 animate-pulse"
                      : "border-border bg-surface text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  🎤
                </button>
              )}

              {/* Send button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary-light active:scale-95 disabled:opacity-40"
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-muted">
              हिंदी या English में टाइप करें · Type in Hindi or English
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
