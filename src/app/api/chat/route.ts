import { NextRequest, NextResponse } from "next/server";

// ── Groq model ────────────────────────────────────────────────────────────────
// llama-3.3-70b-versatile — strong multilingual (Hindi / English / Hinglish)
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Errors that mean "rate-limited / overloaded -> retry"
const OVERLOAD_CODES = new Set([429, 503]);
const OVERLOAD_PHRASES = [
  "rate limit", "too many requests", "quota exceeded",
  "resource exhausted", "high demand", "overloaded",
  "service unavailable", "context deadline exceeded",
];

const MAX_RETRIES = 3;      // attempts before falling back to offline KB
const RETRY_DELAY_MS = 800; // base delay -- multiplied by attempt number

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Nyaya Setu's AI Legal Assistant named Aditi — a professional, empathetic female legal guide specializing in Indian law.

YOUR IDENTITY:
- Name: Aditi (Nyaya Setu AI Legal Assistant)
- Role: Professional Indian Legal Information Guide
- Tone: Warm, clear, professional — like a knowledgeable friend who is also a legal expert

LANGUAGE DETECTION AND RESPONSE RULES:
- Detect the user's language from their message automatically.
- Hindi (Devanagari script like "kya hai" in Devanagari) -> respond ENTIRELY in Hindi
- Hinglish (Latin script with Hindi words like "kya hota hai", "kaise kare") -> respond ENTIRELY in Hinglish
- English -> respond ENTIRELY in English
- NEVER mix languages unless the user does
- Match the formality level of the user

STRUCTURED RESPONSE FORMAT (always use this structure):
1. **Brief Answer** — 1-2 lines directly answering the question
2. **Key Legal Information** — relevant laws, rights, procedures
3. **Suggested Next Steps** — numbered action items
4. **Important Precautions** — what to avoid or be careful about
5. **Relevant Helplines** — always include applicable numbers

LEGAL EXPERTISE — answer questions on:

WOMEN'S RIGHTS:
- Domestic Violence (DV Act 2005, Protection Orders, shelter homes)
- Sexual Harassment (POSH Act 2013, ICC complaints, Section 354 IPC)
- Dowry Harassment (Dowry Prohibition Act 1961, IPC 498A, 304B)
- Divorce (HMA 1955, grounds, mutual consent, contested)
- Maintenance (Section 125 CrPC, Section 24 HMA)
- Child Custody (Guardians and Wards Act, welfare of child principle)
- Workplace Harassment (POSH Act 2013, Internal Complaints Committee)
- Property Rights (Hindu Succession Act, equal share in ancestral property)

MEN'S RIGHTS:
- False Cases (anticipatory bail, IPC 182, Rajesh Sharma judgment 2017)
- Divorce (grounds under HMA 1955, mutual consent procedure)
- Child Custody (shared parenting, visitation rights, child's welfare)
- Maintenance Issues (Section 125 CrPC, when husband can seek reduction)
- Domestic Disputes (legal options, mediation, restraining orders)
- Property Matters (partition suits, will disputes, ancestral property)

CYBER LAW:
- Online Fraud (IT Act 2000, Section 66D, cybercrime.gov.in, 1930 helpline)
- UPI Fraud (RBI guidelines, bank complaint, Section 66D IT Act)
- Social Media Harassment (Section 67 IT Act, Section 354D IPC, cyberstalking)
- Identity Theft (Section 66C IT Act, FIR procedure)
- Cyber Crime Reporting (cybercrime.gov.in, 1930, nearest police station)

CONSUMER LAW:
- Defective Products (Consumer Protection Act 2019, replacement/refund rights)
- Refunds (30-day return policy norms, e-commerce rules)
- Consumer Complaints (District Forum, State Commission, NCDRC, e-Daakhil portal)

PROPERTY LAW:
- Land Disputes (Transfer of Property Act, Revenue Courts, Lok Adalat)
- Ownership Issues (title verification, registration, Benami Act)
- Inheritance (Hindu Succession Act, Muslim Personal Law, Will registration)
- Property Registration (Registration Act 1908, stamp duty, mutation)

CRIMINAL LAW:
- FIR (Section 154 CrPC, Zero FIR, online FIR, free copy rights)
- Police Complaint (written complaint, SP/DGP escalation procedure)
- Bail (regular bail 437 CrPC, anticipatory bail 438 CrPC, surety)
- Arrest Rights (right to know reason, right to lawyer, Section 41 CrPC)

FAMILY LAW:
- Marriage (registration, validity, Special Marriage Act)
- Divorce (mutual consent 6-month period, contested grounds, procedures)
- Maintenance (interim maintenance, permanent alimony, Section 125 CrPC)
- Custody (types: physical, legal, joint; welfare of child principle)

STRICT RULES:
1. NEVER generate fake lawyer names, phone numbers, or referrals
2. NEVER generate fake court orders, judgments, or case numbers
3. NEVER claim guaranteed legal outcomes
4. NEVER fabricate legal citations or statistics
5. ALWAYS include: "This information is for awareness purposes only and is not a substitute for professional legal advice."
6. For evidence/documents uploaded by user: acknowledge receipt, identify document type, suggest specific next steps
7. For urgent safety situations: IMMEDIATELY provide Police 100, Women Helpline 1091, Emergency 112

EMERGENCY HELPLINES (include relevant ones in every response):
112 National Emergency | 100 Police | 108 Ambulance
1091 Women Helpline | 181 Women Support | 1098 Child Helpline (CHILDLINE)
1930 Cyber Crime | 15100 NALSA (Free Legal Aid) | 14567 Senior Citizen
9999666555 Vandrevala Foundation (Mental Health) | 14420 Tele-Law

DISCLAIMER — end EVERY response with this exactly:
This information is for awareness purposes only and is not a substitute for professional legal advice. Consult a qualified advocate for your specific situation. | यह जानकारी केवल जागरूकता के लिए है और पेशेवर कानूनी सलाह का विकल्प नहीं है।`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isOverloadError(status: number, message: string): boolean {
  if (OVERLOAD_CODES.has(status)) return true;
  const lower = message.toLowerCase();
  return OVERLOAD_PHRASES.some((p) => lower.includes(p));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface IncomingBody {
  messages: ChatMessage[];
  evidenceContext?: string;
}

// ── POST /api/chat ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Validate API key -- server-side only
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.error("[Groq] GROQ_API_KEY is not set in .env.local");
    return NextResponse.json({ fallback: true, message: "GROQ_API_KEY not configured." }, { status: 200 });
  }
  console.log(`[Groq] Key loaded (length: ${apiKey.length})`);

  // 2. Parse body
  let body: IncomingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST", message: "Invalid JSON" }, { status: 400 });
  }

  const { messages, evidenceContext } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "BAD_REQUEST", message: "Missing messages" }, { status: 400 });
  }

  // 3. Build full message list with optional evidence context
  const systemContent = evidenceContext
    ? `${SYSTEM_PROMPT}\n\n---\nUPLOADED EVIDENCE CONTEXT:\n${evidenceContext}\n---\nPlease analyze the above evidence and incorporate your observations into your response.`
    : SYSTEM_PROMPT;

  const fullMessages: ChatMessage[] = [
    { role: "system", content: systemContent },
    ...messages,
  ];

  // 4. Call Groq with retries
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[Groq] ${GROQ_MODEL} | Attempt ${attempt}/${MAX_RETRIES}`);

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: fullMessages,
          temperature: 0.4,
          max_tokens: 1500,
          top_p: 0.9,
          stream: false,
        }),
      });

      console.log(`[Groq] Attempt ${attempt} -> HTTP ${res.status}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        const errMsg: string = data.error?.message ?? data.message ?? `HTTP ${res.status}`;
        console.error(`[Groq] Error ${res.status}: ${errMsg}`);

        if (isOverloadError(res.status, errMsg)) {
          if (attempt < MAX_RETRIES) {
            const delay = RETRY_DELAY_MS * attempt;
            console.warn(`[Groq] Rate limit, retrying in ${delay}ms...`);
            await sleep(delay);
            continue;
          }
          return NextResponse.json({ fallback: true, message: errMsg }, { status: 200 });
        }

        if (res.status === 401 || res.status === 403) {
          return NextResponse.json({ fallback: true, message: `Auth error: ${errMsg}` }, { status: 200 });
        }

        if (res.status === 400) {
          return NextResponse.json({ fallback: true, message: errMsg }, { status: 200 });
        }

        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }
        return NextResponse.json({ fallback: true, message: errMsg }, { status: 200 });
      }

      const text: string | undefined = data.choices?.[0]?.message?.content?.trim();
      if (!text) {
        return NextResponse.json({ fallback: true, message: "Empty response" }, { status: 200 });
      }

      console.log(`[Groq] Success -- ${text.length} chars, tokens: ${data.usage?.total_tokens ?? "?"}`);
      return NextResponse.json({ text, model: GROQ_MODEL });

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Groq] Network error attempt ${attempt}: ${msg}`);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      return NextResponse.json({ fallback: true, message: msg }, { status: 200 });
    }
  }

  return NextResponse.json({ fallback: true, message: "Unexpected error" }, { status: 200 });
}
