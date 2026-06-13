// ─────────────────────────────────────────────────────────────────────────────
// Offline Legal Knowledge Base for Nyaya Setu
// Covers all required demo topics in both English and Hindi.
// Used automatically when Gemini API is unavailable / rate-limited.
// ─────────────────────────────────────────────────────────────────────────────

const DISCLAIMER_EN =
  "\n\n⚠️ Disclaimer: This is general legal information, not formal legal advice. Consult a qualified advocate for your specific situation.";
const DISCLAIMER_HI =
  "\n\n⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं। अपनी विशिष्ट स्थिति के लिए किसी योग्य अधिवक्ता से परामर्श करें।";

// ── Language Detection (internal use) ────────────────────────────────────────

function detectLanguageLegacy(text: string): "hi" | "en" {
  const devanagari = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  return devanagari >= 2 ? "hi" : "en";
}

// ── Knowledge Entries ─────────────────────────────────────────────────────────

interface KBEntry {
  /** Keywords that trigger this entry (lowercase, match anywhere in user text) */
  keywords: string[];
  en: string;
  hi: string;
}

const KB: KBEntry[] = [
  // ── Greetings ──────────────────────────────────────────────────────────────
  {
    keywords: ["hello", "hi ", "hey", "greet"],
    en:
      "Hello! 👋 I am Nyaya Setu's AI Legal Assistant.\n\n" +
      "I can help you with:\n" +
      "• **Women's Rights** — DV Act, POSH Act, Section 498A\n" +
      "• **Men's Rights** — False case protection, custody rights\n" +
      "• **FIR & Police** — How to file a complaint\n" +
      "• **Cyber Crime** — Reporting online fraud, harassment\n" +
      "• **Consumer Rights** — Complaint procedures\n" +
      "• **Property Disputes** — Legal options\n" +
      "• **Legal Aid** — Free legal help via NALSA\n\n" +
      "📞 Emergency: **112** · Police: **100** · Women: **1091** · Cyber: **1930**" +
      DISCLAIMER_EN,
    hi:
      "नमस्ते! 👋 मैं Nyaya Setu का AI Legal Assistant हूँ।\n\n" +
      "मैं इन विषयों में आपकी सहायता कर सकता हूँ:\n" +
      "• **महिला अधिकार** — DV Act, POSH Act, धारा 498A\n" +
      "• **पुरुष अधिकार** — झूठे मामले, हिरासत अधिकार\n" +
      "• **FIR दर्ज करना** — शिकायत प्रक्रिया\n" +
      "• **साइबर अपराध** — ऑनलाइन धोखाधड़ी की रिपोर्ट\n" +
      "• **उपभोक्ता अधिकार** — शिकायत प्रक्रिया\n" +
      "• **संपत्ति विवाद** — कानूनी विकल्प\n" +
      "• **निःशुल्क कानूनी सहायता** — NALSA के माध्यम से\n\n" +
      "📞 आपातकाल: **112** · पुलिस: **100** · महिला: **1091** · साइबर: **1930**" +
      DISCLAIMER_HI,
  },
  {
    keywords: ["namaste", "namaskar", "नमस्ते", "नमस्कार", "हेलो", "हाय"],
    en:
      "Hello! 🙏 I am Nyaya Setu's AI Legal Assistant.\n\n" +
      "Ask me anything about Indian law in English or Hindi. I'm here to help!\n\n" +
      "📞 Emergency: **112** · Police: **100** · Women Helpline: **1091**" +
      DISCLAIMER_EN,
    hi:
      "नमस्ते! 🙏 मैं Nyaya Setu का AI Legal Assistant हूँ।\n\n" +
      "आप हिंदी या अंग्रेजी में भारतीय कानून के बारे में कोई भी प्रश्न पूछ सकते हैं।\n\n" +
      "📞 आपातकाल: **112** · पुलिस: **100** · महिला हेल्पलाइन: **1091**" +
      DISCLAIMER_HI,
  },

  // ── Women Rights ───────────────────────────────────────────────────────────
  {
    keywords: [
      "women right", "woman right", "women's right", "mahila adhikar",
      "महिला अधिकार", "महिला के अधिकार", "women law", "female right",
    ],
    en:
      "**Women's Rights in India** 👩‍⚖️\n\n" +
      "**Key Laws:**\n" +
      "• **Protection of Women from Domestic Violence Act, 2005** — Covers physical, emotional, sexual, and economic abuse\n" +
      "• **Dowry Prohibition Act, 1961** — Giving/taking dowry is a criminal offence\n" +
      "• **IPC Section 498A** — Cruelty by husband or his relatives (cognizable, non-bailable)\n" +
      "• **POSH Act, 2013** — Protection against sexual harassment at workplace\n" +
      "• **Hindu Succession Act** — Equal right to ancestral property\n" +
      "• **Maternity Benefit Act, 1961** — 26 weeks paid maternity leave\n\n" +
      "**Rights at a Glance:**\n" +
      "1. Right to file FIR at zero cost\n" +
      "2. Right to free legal aid (NALSA)\n" +
      "3. Right to maintenance (Section 125 CrPC)\n" +
      "4. Right against arrest at night (except with female officer)\n" +
      "5. Right to medical examination by female doctor\n\n" +
      "📞 Women Helpline: **1091** · Women Support: **181** · Police: **100** · NALSA: **15100**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में महिलाओं के अधिकार** 👩‍⚖️\n\n" +
      "**प्रमुख कानून:**\n" +
      "• **घरेलू हिंसा अधिनियम, 2005** — शारीरिक, मानसिक, यौन और आर्थिक शोषण से सुरक्षा\n" +
      "• **दहेज प्रतिषेध अधिनियम, 1961** — दहेज देना/लेना अपराध है\n" +
      "• **IPC धारा 498A** — पति या उसके रिश्तेदारों द्वारा क्रूरता\n" +
      "• **POSH अधिनियम, 2013** — कार्यस्थल पर यौन उत्पीड़न से सुरक्षा\n" +
      "• **हिंदू उत्तराधिकार अधिनियम** — पैतृक संपत्ति में समान अधिकार\n" +
      "• **मातृत्व लाभ अधिनियम, 1961** — 26 सप्ताह का सवेतन अवकाश\n\n" +
      "**मुख्य अधिकार:**\n" +
      "1. निःशुल्क FIR दर्ज करने का अधिकार\n" +
      "2. निःशुल्क कानूनी सहायता का अधिकार (NALSA)\n" +
      "3. गुजारा भत्ता का अधिकार (धारा 125 CrPC)\n" +
      "4. रात में गिरफ्तारी के विरुद्ध अधिकार\n" +
      "5. महिला डॉक्टर द्वारा चिकित्सा जांच का अधिकार\n\n" +
      "📞 महिला हेल्पलाइन: **1091** · महिला सहायता: **181** · पुलिस: **100** · NALSA: **15100**" +
      DISCLAIMER_HI,
  },

  // ── Men Rights ─────────────────────────────────────────────────────────────
  {
    keywords: [
      "men right", "man right", "men's right", "purush adhikar",
      "पुरुष अधिकार", "पुरुष के अधिकार", "male right",
    ],
    en:
      "**Men's Rights in India** 👨‍⚖️\n\n" +
      "**Protection Against False Cases:**\n" +
      "• **IPC Section 498A** — Right to anticipatory bail\n" +
      "• **SC Judgment (Rajesh Sharma vs State of UP, 2017)** — Safeguards against misuse; mediation before arrest\n" +
      "• **IPC Section 182** — Filing false complaint is a criminal offence (up to 6 months imprisonment)\n\n" +
      "**Family & Custody Rights:**\n" +
      "• Right to file for divorce on grounds of cruelty, desertion, adultery\n" +
      "• Right to child custody (especially for boys above 5 years — courts consider child's welfare)\n" +
      "• Right to seek maintenance reduction if wife is earning\n\n" +
      "**Workplace & Other Rights:**\n" +
      "• Right to file complaint against false sexual harassment accusations\n" +
      "• Right to free legal aid if income is below threshold (NALSA)\n" +
      "• Right to fair trial under Article 21 (Right to Life & Liberty)\n\n" +
      "📞 Police: **100** · NALSA (Free Legal Aid): **15100** · National Emergency: **112**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में पुरुषों के अधिकार** 👨‍⚖️\n\n" +
      "**झूठे मामलों से सुरक्षा:**\n" +
      "• **IPC धारा 498A** — अग्रिम जमानत का अधिकार\n" +
      "• **सुप्रीम कोर्ट (राजेश शर्मा बनाम उत्तर प्रदेश, 2017)** — गिरफ्तारी से पहले मध्यस्थता\n" +
      "• **IPC धारा 182** — झूठी शिकायत दर्ज करना अपराध है\n\n" +
      "**परिवार और हिरासत अधिकार:**\n" +
      "• क्रूरता, परित्याग या व्यभिचार के आधार पर तलाक का अधिकार\n" +
      "• बच्चे की हिरासत का अधिकार (बच्चे के हित के अनुसार)\n" +
      "• पत्नी की आय के आधार पर गुजारा भत्ता कम करवाने का अधिकार\n\n" +
      "**कार्यस्थल और अन्य अधिकार:**\n" +
      "• झूठे यौन उत्पीड़न के आरोपों के खिलाफ शिकायत का अधिकार\n" +
      "• NALSA के माध्यम से निःशुल्क कानूनी सहायता का अधिकार\n" +
      "• अनुच्छेद 21 के तहत निष्पक्ष सुनवाई का अधिकार\n\n" +
      "📞 पुलिस: **100** · NALSA (निःशुल्क सहायता): **15100** · आपातकाल: **112**" +
      DISCLAIMER_HI,
  },

  // ── Cyber Crime ────────────────────────────────────────────────────────────
  {
    keywords: [
      "cyber crime", "cybercrime", "online fraud", "cyber complaint",
      "साइबर अपराध", "साइबर क्राइम", "ऑनलाइन धोखाधड़ी", "cyber complaint kaise",
      "cyber kaise", "cybercrime complaint",
    ],
    en:
      "**Cyber Crime — How to Report in India** 💻\n\n" +
      "**Step-by-Step Process:**\n" +
      "1. **Online Portal** — Visit **cybercrime.gov.in** and click 'Report Cyber Crime'\n" +
      "2. **Cyber Crime Helpline** — Call **1930** (24×7, free)\n" +
      "3. **Nearest Police Station** — File FIR under IT Act 2000\n" +
      "4. **Evidence Collection** — Save screenshots, URLs, transaction IDs before reporting\n\n" +
      "**Types of Cyber Crimes Covered:**\n" +
      "• Online financial fraud / UPI fraud\n" +
      "• Social media harassment / morphed photos\n" +
      "• Sextortion / blackmail\n" +
      "• Phishing / identity theft\n" +
      "• Cyber stalking\n\n" +
      "**Relevant Laws:**\n" +
      "• IT Act 2000 — Sections 66, 66C, 66D, 67, 67A\n" +
      "• IPC Sections 420 (cheating), 384 (extortion), 509 (obscenity)\n\n" +
      "📞 Cyber Crime Helpline: **1930** · Police: **100** · National Emergency: **112**" +
      DISCLAIMER_EN,
    hi:
      "**साइबर अपराध की शिकायत कैसे करें** 💻\n\n" +
      "**चरण-दर-चरण प्रक्रिया:**\n" +
      "1. **ऑनलाइन पोर्टल** — **cybercrime.gov.in** पर जाएं और 'Report Cyber Crime' पर क्लिक करें\n" +
      "2. **साइबर हेल्पलाइन** — **1930** पर कॉल करें (24×7, निःशुल्क)\n" +
      "3. **नजदीकी पुलिस स्टेशन** — IT Act 2000 के तहत FIR दर्ज करें\n" +
      "4. **सबूत संरक्षण** — शिकायत से पहले स्क्रीनशॉट, URLs और ट्रांजेक्शन ID सहेजें\n\n" +
      "**कवर किए गए साइबर अपराध:**\n" +
      "• ऑनलाइन वित्तीय धोखाधड़ी / UPI फ्रॉड\n" +
      "• सोशल मीडिया उत्पीड़न / मॉर्फ्ड फोटो\n" +
      "• सेक्सटॉर्शन / ब्लैकमेल\n" +
      "• फिशिंग / पहचान की चोरी\n" +
      "• साइबर स्टॉकिंग\n\n" +
      "**संबंधित कानून:**\n" +
      "• IT Act 2000 — धाराएं 66, 66C, 66D, 67, 67A\n" +
      "• IPC धाराएं 420, 384, 509\n\n" +
      "📞 साइबर हेल्पलाइन: **1930** · पुलिस: **100** · आपातकाल: **112**" +
      DISCLAIMER_HI,
  },

  // ── FIR Process ────────────────────────────────────────────────────────────
  {
    keywords: [
      "fir", "file fir", "first information report", "complaint police",
      "fir kaise", "fir darz", "fir file", "fir kare", "police complaint",
      "FIR दर्ज", "FIR कैसे", "शिकायत कैसे",
    ],
    en:
      "**How to File an FIR in India** 📋\n\n" +
      "**Step-by-Step:**\n" +
      "1. **Visit the Police Station** in whose jurisdiction the crime occurred\n" +
      "2. **Give your complaint** orally or in writing to the officer in charge\n" +
      "3. **FIR is recorded** — Officer must register it free of cost (Section 154 CrPC)\n" +
      "4. **Get a copy** — You are entitled to a free copy of the FIR\n" +
      "5. **If refused** — Send written complaint to SP/SSP or file online at your state's police portal\n\n" +
      "**Your Rights While Filing FIR:**\n" +
      "• FIR cannot be refused for cognizable offences\n" +
      "• Zero FIR — Can be filed at any police station regardless of jurisdiction\n" +
      "• Women can file FIR at home (police must send officer) — Section 154(1) CrPC\n" +
      "• Free copy of FIR is a legal right\n\n" +
      "**Online FIR:**\n" +
      "• Visit your state police website (e.g., **delhipolice.gov.in**)\n" +
      "• National portal: **bharatpolice.gov.in**\n\n" +
      "📞 Police: **100** · National Emergency: **112** · NALSA: **15100**" +
      DISCLAIMER_EN,
    hi:
      "**FIR कैसे दर्ज करें** 📋\n\n" +
      "**चरण-दर-चरण प्रक्रिया:**\n" +
      "1. **पुलिस स्टेशन जाएं** जहां घटना हुई हो\n" +
      "2. **अपनी शिकायत** मौखिक या लिखित रूप में दें\n" +
      "3. **FIR दर्ज होगी** — अधिकारी इसे निःशुल्क दर्ज करने के लिए बाध्य है (धारा 154 CrPC)\n" +
      "4. **प्रति लें** — FIR की निःशुल्क प्रति पाने का आपको अधिकार है\n" +
      "5. **इनकार पर** — SP/SSP को लिखित शिकायत करें या राज्य पुलिस पोर्टल पर ऑनलाइन दर्ज करें\n\n" +
      "**FIR दर्ज कराते समय आपके अधिकार:**\n" +
      "• संज्ञेय अपराध में FIR दर्ज करने से इनकार नहीं किया जा सकता\n" +
      "• Zero FIR — किसी भी पुलिस स्टेशन में दर्ज हो सकती है\n" +
      "• महिलाएं घर से FIR दर्ज करा सकती हैं (धारा 154(1) CrPC)\n" +
      "• FIR की निःशुल्क प्रति कानूनी अधिकार है\n\n" +
      "**ऑनलाइन FIR:**\n" +
      "• अपने राज्य की पुलिस वेबसाइट पर जाएं\n" +
      "• राष्ट्रीय पोर्टल: **bharatpolice.gov.in**\n\n" +
      "📞 पुलिस: **100** · आपातकाल: **112** · NALSA: **15100**" +
      DISCLAIMER_HI,
  },

  // ── Domestic Violence ──────────────────────────────────────────────────────
  {
    keywords: [
      "domestic violence", "gharelu hinsa", "dv act", "498a",
      "घरेलू हिंसा", "पारिवारिक हिंसा", "पति द्वारा", "domestic abuse",
    ],
    en:
      "**Domestic Violence — Rights & Protection** 🛡️\n\n" +
      "**The Law: Protection of Women from DV Act, 2005**\n\n" +
      "**What counts as Domestic Violence:**\n" +
      "• Physical abuse (beating, hitting)\n" +
      "• Sexual abuse\n" +
      "• Verbal & emotional abuse (insults, threats)\n" +
      "• Economic abuse (denying money, food, basic needs)\n" +
      "• Dowry harassment\n\n" +
      "**How to Get Help:**\n" +
      "1. Call Women Helpline **1091** or **181** immediately\n" +
      "2. Contact a Protection Officer (available in every district)\n" +
      "3. File a complaint at the nearest police station\n" +
      "4. Approach a Magistrate's Court for Protection Order\n\n" +
      "**Reliefs Available:**\n" +
      "• Protection Order — stops abuser from contacting you\n" +
      "• Residence Order — right to stay in shared home\n" +
      "• Monetary Relief — maintenance, medical expenses\n" +
      "• Custody Order — temporary custody of children\n\n" +
      "**Additional Law:** IPC Section 498A — Cruelty by husband/relatives (up to 3 years imprisonment)\n\n" +
      "📞 Women Helpline: **1091** · Women Support: **181** · Police: **100** · NALSA: **15100**" +
      DISCLAIMER_EN,
    hi:
      "**घरेलू हिंसा — अधिकार और सुरक्षा** 🛡️\n\n" +
      "**कानून: घरेलू हिंसा से महिलाओं की सुरक्षा अधिनियम, 2005**\n\n" +
      "**घरेलू हिंसा में क्या शामिल है:**\n" +
      "• शारीरिक शोषण (मारपीट)\n" +
      "• यौन शोषण\n" +
      "• मौखिक और मानसिक शोषण (गाली, धमकी)\n" +
      "• आर्थिक शोषण (पैसे, खाना, जरूरतें न देना)\n" +
      "• दहेज उत्पीड़न\n\n" +
      "**सहायता कैसे लें:**\n" +
      "1. तुरंत महिला हेल्पलाइन **1091** या **181** पर कॉल करें\n" +
      "2. जिले के संरक्षण अधिकारी से संपर्क करें\n" +
      "3. नजदीकी पुलिस स्टेशन में शिकायत दर्ज करें\n" +
      "4. मजिस्ट्रेट की अदालत में संरक्षण आदेश के लिए आवेदन करें\n\n" +
      "**उपलब्ध राहत:**\n" +
      "• संरक्षण आदेश — पीड़क को संपर्क करने से रोकता है\n" +
      "• निवास आदेश — साझा घर में रहने का अधिकार\n" +
      "• मौद्रिक राहत — भरण-पोषण, चिकित्सा खर्च\n" +
      "• अस्थायी बाल हिरासत आदेश\n\n" +
      "**अतिरिक्त कानून:** IPC धारा 498A — पति/रिश्तेदारों द्वारा क्रूरता (3 वर्ष तक कारावास)\n\n" +
      "📞 महिला हेल्पलाइन: **1091** · महिला सहायता: **181** · पुलिस: **100** · NALSA: **15100**" +
      DISCLAIMER_HI,
  },

  // ── Property Disputes ──────────────────────────────────────────────────────
  {
    keywords: [
      "property dispute", "property right", "land dispute", "zameen vivad",
      "sampatti vivad", "property mein", "संपत्ति विवाद", "जमीन विवाद",
      "property kya kare", "property me kya",
    ],
    en:
      "**Property Disputes in India — Legal Options** 🏠\n\n" +
      "**Types of Property Disputes:**\n" +
      "• Ancestral property partition\n" +
      "• Boundary disputes between neighbours\n" +
      "• Fraudulent sale / forged documents\n" +
      "• Landlord-tenant disputes\n" +
      "• Inheritance disputes after death\n\n" +
      "**Your Legal Options:**\n" +
      "1. **Negotiation / Mediation** — Try Lok Adalat for quick resolution (free, binding award)\n" +
      "2. **Civil Court** — File a civil suit for declaration, injunction, or partition\n" +
      "3. **Revenue Court** — For agricultural land disputes\n" +
      "4. **Police Complaint** — If there is criminal element (forgery: IPC 420, 467, 468)\n\n" +
      "**Key Laws:**\n" +
      "• Transfer of Property Act, 1882\n" +
      "• Hindu Succession Act, 1956 (women have equal rights in ancestral property)\n" +
      "• Registration Act, 1908 — All property transfers must be registered\n" +
      "• Benami Transactions (Prohibition) Act, 1988\n\n" +
      "**First Steps:**\n" +
      "1. Collect all documents (sale deed, registry, will)\n" +
      "2. Consult a civil lawyer immediately\n" +
      "3. Get certified copies from Sub-Registrar's office\n\n" +
      "📞 NALSA (Free Legal Aid): **15100** · Police: **100**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में संपत्ति विवाद — कानूनी विकल्प** 🏠\n\n" +
      "**संपत्ति विवाद के प्रकार:**\n" +
      "• पैतृक संपत्ति का बंटवारा\n" +
      "• पड़ोसियों के बीच सीमा विवाद\n" +
      "• धोखाधड़ी की बिक्री / जाली दस्तावेज\n" +
      "• मकान मालिक-किरायेदार विवाद\n" +
      "• मृत्यु के बाद उत्तराधिकार विवाद\n\n" +
      "**आपके कानूनी विकल्प:**\n" +
      "1. **बातचीत / मध्यस्थता** — Lok Adalat में जाएं (निःशुल्क, बाध्यकारी)\n" +
      "2. **दीवानी अदालत** — घोषणा, निषेधाज्ञा या बंटवारे के लिए वाद दायर करें\n" +
      "3. **राजस्व न्यायालय** — कृषि भूमि विवाद के लिए\n" +
      "4. **पुलिस शिकायत** — अगर जालसाजी हो (IPC 420, 467, 468)\n\n" +
      "**मुख्य कानून:**\n" +
      "• संपत्ति हस्तांतरण अधिनियम, 1882\n" +
      "• हिंदू उत्तराधिकार अधिनियम, 1956 (महिलाओं को पैतृक संपत्ति में समान अधिकार)\n" +
      "• पंजीकरण अधिनियम, 1908\n\n" +
      "**पहले कदम:**\n" +
      "1. सभी दस्तावेज (बिक्री पत्र, रजिस्ट्री, वसीयत) इकट्ठे करें\n" +
      "2. तुरंत दीवानी वकील से परामर्श करें\n" +
      "3. उप-पंजीयक कार्यालय से प्रमाणित प्रतियां प्राप्त करें\n\n" +
      "📞 NALSA (निःशुल्क सहायता): **15100** · पुलिस: **100**" +
      DISCLAIMER_HI,
  },

  // ── Consumer Rights ────────────────────────────────────────────────────────
  {
    keywords: [
      "consumer right", "consumer complaint", "consumer forum",
      "upbhokta adhikar", "consumer kaise", "product complaint",
      "उपभोक्ता अधिकार", "उपभोक्ता शिकायत", "consumer complaint kaise",
      "refund", "defective product", "service complaint",
    ],
    en:
      "**Consumer Rights in India** 🛒\n\n" +
      "**The Law: Consumer Protection Act, 2019**\n\n" +
      "**Your 6 Consumer Rights:**\n" +
      "1. Right to Safety\n" +
      "2. Right to Information\n" +
      "3. Right to Choose\n" +
      "4. Right to be Heard\n" +
      "5. Right to Seek Redressal\n" +
      "6. Right to Consumer Education\n\n" +
      "**How to File a Consumer Complaint:**\n" +
      "1. **Online** — Visit **consumerhelpline.gov.in** or call **1800-11-4000** (toll-free)\n" +
      "2. **Consumer Forum** — File at District Consumer Disputes Redressal Commission\n" +
      "   - Claim up to ₹50 lakh → District Forum\n" +
      "   - ₹50 lakh to ₹2 crore → State Commission\n" +
      "   - Above ₹2 crore → National Commission (NCDRC)\n" +
      "3. **e-Daakhil Portal** — **edaakhil.nic.in** (file complaint online)\n\n" +
      "**What You Can Claim:**\n" +
      "• Full refund for defective goods\n" +
      "• Compensation for service deficiency\n" +
      "• Punitive damages for unfair trade practices\n\n" +
      "📞 Consumer Helpline: **1800-11-4000** (toll-free) · **1915**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में उपभोक्ता अधिकार** 🛒\n\n" +
      "**कानून: उपभोक्ता संरक्षण अधिनियम, 2019**\n\n" +
      "**आपके 6 उपभोक्ता अधिकार:**\n" +
      "1. सुरक्षा का अधिकार\n" +
      "2. सूचना का अधिकार\n" +
      "3. चुनाव का अधिकार\n" +
      "4. सुने जाने का अधिकार\n" +
      "5. निवारण का अधिकार\n" +
      "6. उपभोक्ता शिक्षा का अधिकार\n\n" +
      "**उपभोक्ता शिकायत कैसे दर्ज करें:**\n" +
      "1. **ऑनलाइन** — **consumerhelpline.gov.in** पर जाएं या **1800-11-4000** पर कॉल करें\n" +
      "2. **उपभोक्ता फोरम** — जिला उपभोक्ता विवाद निवारण आयोग में जाएं\n" +
      "   - ₹50 लाख तक → जिला फोरम\n" +
      "   - ₹50 लाख से ₹2 करोड़ → राज्य आयोग\n" +
      "   - ₹2 करोड़ से अधिक → राष्ट्रीय आयोग (NCDRC)\n" +
      "3. **e-Daakhil पोर्टल** — **edaakhil.nic.in** पर ऑनलाइन शिकायत दर्ज करें\n\n" +
      "**आप क्या मांग सकते हैं:**\n" +
      "• दोषपूर्ण सामान के लिए पूर्ण वापसी\n" +
      "• सेवा में कमी के लिए मुआवजा\n" +
      "• अनुचित व्यापार प्रथाओं के लिए दंडात्मक हर्जाना\n\n" +
      "📞 उपभोक्ता हेल्पलाइन: **1800-11-4000** (टोल-फ्री) · **1915**" +
      DISCLAIMER_HI,
  },

  // ── NALSA / Legal Aid ──────────────────────────────────────────────────────
  {
    keywords: [
      "nalsa", "legal aid", "free legal", "muft kanuni", "kanuni sahayata",
      "निःशुल्क कानूनी", "NALSA क्या", "legal help free", "poor legal",
      "tele law", "tele-law", "14420",
    ],
    en:
      "**NALSA — Free Legal Aid in India** ⚖️\n\n" +
      "**What is NALSA?**\n" +
      "National Legal Services Authority — provides free legal services to eligible citizens under the Legal Services Authorities Act, 1987.\n\n" +
      "**Who is Eligible for Free Legal Aid?**\n" +
      "• Women and children\n" +
      "• Persons with disabilities\n" +
      "• SC/ST community members\n" +
      "• Industrial workmen\n" +
      "• Persons in custody\n" +
      "• Persons with annual income below ₹3 lakh (varies by state)\n" +
      "• Victims of trafficking, mass disasters, ethnic violence\n\n" +
      "**Services Provided:**\n" +
      "• Free lawyer representation in court\n" +
      "• Legal advice and consultation\n" +
      "• Lok Adalat services (fast dispute resolution)\n" +
      "• Mediation and conciliation\n\n" +
      "**How to Access:**\n" +
      "1. Call **15100** (NALSA helpline)\n" +
      "2. Call **14420** (Tele-Law — legal advice by phone)\n" +
      "3. Visit District Legal Services Authority (DLSA) in your district\n" +
      "4. Visit **nalsa.gov.in**\n\n" +
      "📞 NALSA: **15100** · Tele-Law: **14420**" +
      DISCLAIMER_EN,
    hi:
      "**NALSA — भारत में निःशुल्क कानूनी सहायता** ⚖️\n\n" +
      "**NALSA क्या है?**\n" +
      "राष्ट्रीय विधिक सेवा प्राधिकरण — विधिक सेवा प्राधिकरण अधिनियम, 1987 के तहत पात्र नागरिकों को निःशुल्क कानूनी सेवाएं प्रदान करता है।\n\n" +
      "**निःशुल्क कानूनी सहायता के लिए कौन पात्र है?**\n" +
      "• महिलाएं और बच्चे\n" +
      "• विकलांग व्यक्ति\n" +
      "• SC/ST समुदाय के सदस्य\n" +
      "• औद्योगिक कर्मकार\n" +
      "• हिरासत में व्यक्ति\n" +
      "• ₹3 लाख से कम वार्षिक आय वाले व्यक्ति\n\n" +
      "**प्रदान की जाने वाली सेवाएं:**\n" +
      "• न्यायालय में निःशुल्क वकील प्रतिनिधित्व\n" +
      "• कानूनी सलाह और परामर्श\n" +
      "• लोक अदालत सेवाएं (त्वरित विवाद समाधान)\n" +
      "• मध्यस्थता और सुलह\n\n" +
      "**कैसे संपर्क करें:**\n" +
      "1. **15100** (NALSA हेल्पलाइन) पर कॉल करें\n" +
      "2. **14420** (Tele-Law — फोन पर कानूनी सलाह) पर कॉल करें\n" +
      "3. अपने जिले के जिला विधिक सेवा प्राधिकरण (DLSA) में जाएं\n" +
      "4. **nalsa.gov.in** पर जाएं\n\n" +
      "📞 NALSA: **15100** · Tele-Law: **14420**" +
      DISCLAIMER_HI,
  },

  // ── Emergency Helplines ────────────────────────────────────────────────────
  {
    keywords: [
      "helpline", "helpline number", "emergency number", "contact number",
      "हेल्पलाइन", "आपातकालीन नंबर", "emergency contact", "all helpline",
      "important number", "police number", "women number",
    ],
    en:
      "**Important Helpline Numbers in India** 📞\n\n" +
      "| Service | Number |\n" +
      "|---|---|\n" +
      "| 🚨 National Emergency | **112** |\n" +
      "| 👮 Police | **100** |\n" +
      "| 🚑 Ambulance | **108** |\n" +
      "| 🔥 Fire | **101** |\n" +
      "| 👩 Women Helpline | **1091** |\n" +
      "| 👩‍👧 Women Support (OSC) | **181** |\n" +
      "| 🧒 Child Helpline (CHILDLINE) | **1098** |\n" +
      "| 💻 Cyber Crime | **1930** |\n" +
      "| ⚖️ NALSA (Free Legal Aid) | **15100** |\n" +
      "| 👴 Senior Citizen | **14567** |\n" +
      "| 📱 Tele-Law | **14420** |\n" +
      "| 🧠 Mental Health (Vandrevala) | **9999 666 555** |\n" +
      "| 🛒 Consumer Helpline | **1800-11-4000** |\n\n" +
      "⚠️ Disclaimer: This is general legal information, not formal legal advice.",
    hi:
      "**भारत में महत्वपूर्ण हेल्पलाइन नंबर** 📞\n\n" +
      "| सेवा | नंबर |\n" +
      "|---|---|\n" +
      "| 🚨 राष्ट्रीय आपातकाल | **112** |\n" +
      "| 👮 पुलिस | **100** |\n" +
      "| 🚑 एम्बुलेंस | **108** |\n" +
      "| 🔥 अग्नि सेवा | **101** |\n" +
      "| 👩 महिला हेल्पलाइन | **1091** |\n" +
      "| 👩‍👧 महिला सहायता (OSC) | **181** |\n" +
      "| 🧒 बाल हेल्पलाइन (CHILDLINE) | **1098** |\n" +
      "| 💻 साइबर अपराध | **1930** |\n" +
      "| ⚖️ NALSA (निःशुल्क कानूनी सहायता) | **15100** |\n" +
      "| 👴 वरिष्ठ नागरिक | **14567** |\n" +
      "| 📱 Tele-Law | **14420** |\n" +
      "| 🧠 मानसिक स्वास्थ्य (Vandrevala) | **9999 666 555** |\n" +
      "| 🛒 उपभोक्ता हेल्पलाइन | **1800-11-4000** |\n\n" +
      "⚠️ Disclaimer: यह सामान्य कानूनी जानकारी है, कानूनी सलाह नहीं।",
  },

  // ── Child Rights ───────────────────────────────────────────────────────────
  {
    keywords: [
      "child right", "children right", "bal adhikar", "child law",
      "बाल अधिकार", "बच्चों के अधिकार", "child protection", "childline",
      "1098", "pocso",
    ],
    en:
      "**Child Rights in India** 👶\n\n" +
      "**Key Laws:**\n" +
      "• **POCSO Act, 2012** — Protection of Children from Sexual Offences (strict punishment)\n" +
      "• **RTE Act, 2009** — Right to free & compulsory education (age 6–14)\n" +
      "• **Child Labour (Prohibition) Act, 1986** — Bans employment of children under 14\n" +
      "• **Juvenile Justice Act, 2015** — Welfare and protection of children in conflict with law\n" +
      "• **CARA** — Central Adoption Resource Authority for adoption\n\n" +
      "**Child's Fundamental Rights (Constitution):**\n" +
      "• Article 21A — Right to education\n" +
      "• Article 24 — No child labour in hazardous industries\n" +
      "• Article 39(f) — Protection from exploitation\n\n" +
      "**If a Child is in Danger:**\n" +
      "1. Call **CHILDLINE: 1098** immediately (24×7, free)\n" +
      "2. Contact Child Welfare Committee (CWC) in your district\n" +
      "3. File FIR at nearest police station\n\n" +
      "📞 CHILDLINE: **1098** · Police: **100** · National Emergency: **112**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में बाल अधिकार** 👶\n\n" +
      "**मुख्य कानून:**\n" +
      "• **POCSO अधिनियम, 2012** — बच्चों को यौन अपराधों से सुरक्षा\n" +
      "• **RTE अधिनियम, 2009** — 6-14 वर्ष के बच्चों को निःशुल्क अनिवार्य शिक्षा\n" +
      "• **बाल श्रम (प्रतिषेध) अधिनियम, 1986** — 14 वर्ष से कम बच्चों का रोजगार निषिद्ध\n" +
      "• **किशोर न्याय अधिनियम, 2015** — कानून से संघर्ष में आए बच्चों की सुरक्षा\n\n" +
      "**बच्चे के मौलिक अधिकार (संविधान):**\n" +
      "• अनुच्छेद 21A — शिक्षा का अधिकार\n" +
      "• अनुच्छेद 24 — खतरनाक उद्योगों में बाल श्रम निषेध\n" +
      "• अनुच्छेद 39(f) — शोषण से सुरक्षा\n\n" +
      "**यदि बच्चा खतरे में हो:**\n" +
      "1. तुरंत **CHILDLINE: 1098** पर कॉल करें (24×7, निःशुल्क)\n" +
      "2. जिले के बाल कल्याण समिति (CWC) से संपर्क करें\n" +
      "3. नजदीकी पुलिस स्टेशन में FIR दर्ज करें\n\n" +
      "📞 CHILDLINE: **1098** · पुलिस: **100** · आपातकाल: **112**" +
      DISCLAIMER_HI,
  },

  // ── Senior Citizen Rights ──────────────────────────────────────────────────
  {
    keywords: [
      "senior citizen", "elderly right", "old age", "budhape",
      "वरिष्ठ नागरिक", "बुजुर्ग अधिकार", "बुढ़ापा", "14567",
      "maintenance of parents", "parent right",
    ],
    en:
      "**Senior Citizen Rights in India** 👴👵\n\n" +
      "**Key Law: Maintenance and Welfare of Parents and Senior Citizens Act, 2007**\n\n" +
      "**Rights:**\n" +
      "• Right to **maintenance** from children/relatives (up to ₹10,000/month via Tribunal)\n" +
      "• Right to **return of property** transferred to children in exchange for care promises\n" +
      "• Right to **residence** — cannot be evicted from own home\n" +
      "• Right to **protection** from abuse, neglect, and abandonment\n\n" +
      "**How to Claim Maintenance:**\n" +
      "1. File application before Sub-Divisional Magistrate (SDM) or District Magistrate\n" +
      "2. Tribunal must decide within 90 days\n" +
      "3. If children fail to pay — imprisonment up to 1 month\n\n" +
      "**Other Benefits:**\n" +
      "• Senior citizens get priority in government service queues\n" +
      "• Tax exemptions (80+ years: super senior citizen category)\n" +
      "• Free travel concessions on Indian Railways\n\n" +
      "📞 Senior Citizen Helpline: **14567** · Police: **100** · NALSA: **15100**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में वरिष्ठ नागरिकों के अधिकार** 👴👵\n\n" +
      "**मुख्य कानून: माता-पिता और वरिष्ठ नागरिकों का भरण-पोषण और कल्याण अधिनियम, 2007**\n\n" +
      "**अधिकार:**\n" +
      "• बच्चों/रिश्तेदारों से **भरण-पोषण** का अधिकार (ट्रिब्यूनल द्वारा ₹10,000/माह तक)\n" +
      "• देखभाल के वादे पर बच्चों को दी गई **संपत्ति वापस** लेने का अधिकार\n" +
      "• अपने घर से **बेदखली के विरुद्ध** अधिकार\n" +
      "• शोषण, उपेक्षा और परित्याग से **सुरक्षा** का अधिकार\n\n" +
      "**भरण-पोषण कैसे प्राप्त करें:**\n" +
      "1. उप-विभागीय मजिस्ट्रेट (SDM) या जिला मजिस्ट्रेट के समक्ष आवेदन करें\n" +
      "2. ट्रिब्यूनल को 90 दिनों में निर्णय देना होगा\n" +
      "3. बच्चे भुगतान न करें तो 1 महीने तक कारावास\n\n" +
      "**अन्य लाभ:**\n" +
      "• सरकारी सेवाओं में प्राथमिकता\n" +
      "• आयकर छूट (80+ वर्ष: सुपर सीनियर सिटीजन)\n" +
      "• भारतीय रेलवे में यात्रा रियायत\n\n" +
      "📞 वरिष्ठ नागरिक हेल्पलाइन: **14567** · पुलिस: **100** · NALSA: **15100**" +
      DISCLAIMER_HI,
  },

  // ── Divorce & Maintenance ──────────────────────────────────────────────────
  {
    keywords: [
      "divorce", "talaq", "talaaq", "separation", "alimony",
      "talaak", "divorce kaise", "divorce procedure", "mutual consent",
      "maintenance", "talaak kaise", "divorce le",
      "तलाक", "विवाह विच्छेद", "गुजारा भत्ता",
    ],
    en:
      "**Divorce & Maintenance in India** 💔\n\n" +
      "**Types of Divorce:**\n" +
      "• **Mutual Consent (Section 13B HMA)** — Both parties agree; 6-month waiting period; simplest route\n" +
      "• **Contested Divorce (Section 13 HMA)** — Grounds: cruelty, desertion (2+ years), adultery, conversion, mental illness\n\n" +
      "**Procedure:**\n" +
      "1. File petition in Family Court in district of marriage or last shared residence\n" +
      "2. Court issues notice to other party\n" +
      "3. Attempt at reconciliation / mediation\n" +
      "4. Trial (contested) or second motion after 6 months (mutual consent)\n" +
      "5. Decree of divorce issued\n\n" +
      "**Maintenance Rights:**\n" +
      "• Wife can claim interim maintenance during proceedings (Section 24 HMA)\n" +
      "• Permanent alimony based on income, assets, standard of living\n" +
      "• Section 125 CrPC — maintenance for wife, children, and parents\n\n" +
      "**Important Precautions:**\n" +
      "• Preserve financial records, property documents, bank statements\n" +
      "• Do not vacate the matrimonial home without legal advice\n" +
      "• Hire a family law advocate for contested cases\n\n" +
      "📞 NALSA (Free Legal Aid): **15100** · Tele-Law: **14420** · Women Helpline: **1091**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में तलाक और गुजारा भत्ता** 💔\n\n" +
      "**तलाक के प्रकार:**\n" +
      "• **आपसी सहमति (धारा 13B HMA)** — दोनों पक्ष सहमत हों; 6 महीने की प्रतीक्षा अवधि; सबसे सरल\n" +
      "• **विवादित तलाक (धारा 13 HMA)** — आधार: क्रूरता, परित्याग, व्यभिचार, धर्म परिवर्तन\n\n" +
      "**प्रक्रिया:**\n" +
      "1. विवाह या अंतिम साझा निवास के जिले के पारिवारिक न्यायालय में याचिका दाखिल करें\n" +
      "2. अदालत दूसरे पक्ष को नोटिस जारी करती है\n" +
      "3. सुलह / मध्यस्थता का प्रयास\n" +
      "4. विचारण (विवादित) या 6 माह बाद द्वितीय प्रस्ताव (आपसी सहमति)\n" +
      "5. तलाक का डिक्री जारी\n\n" +
      "**गुजारा भत्ता अधिकार:**\n" +
      "• पत्नी कार्यवाही के दौरान अंतरिम भरण-पोषण का दावा कर सकती है (धारा 24 HMA)\n" +
      "• स्थायी गुजारा भत्ता आय, संपत्ति और जीवन स्तर के आधार पर\n" +
      "• धारा 125 CrPC — पत्नी, बच्चों और माता-पिता के लिए भरण-पोषण\n\n" +
      "📞 NALSA: **15100** · Tele-Law: **14420** · महिला हेल्पलाइन: **1091**" +
      DISCLAIMER_HI,
  },

  // ── Bail & Arrest Rights ───────────────────────────────────────────────────
  {
    keywords: [
      "bail", "arrest", "arrested", "anticipatory bail", "police arrest",
      "bail kaise", "arrested kya kare", "gir ftari", "giraftari",
      "girftar", "bail milegi", "anticipatory",
      "गिरफ्तारी", "जमानत", "बेल",
    ],
    en:
      "**Arrest Rights & Bail in India** 🔒\n\n" +
      "**Your Rights at the Time of Arrest:**\n" +
      "• Right to know the reason for arrest (Section 50 CrPC)\n" +
      "• Right to inform a family member or friend immediately\n" +
      "• Right to consult and be defended by a lawyer (Article 22, Constitution)\n" +
      "• Right to be produced before a Magistrate within 24 hours (Article 22)\n" +
      "• Women cannot be arrested after sunset and before sunrise except in exceptional cases\n" +
      "• Right against self-incrimination (Article 20(3))\n\n" +
      "**Types of Bail:**\n" +
      "• **Regular Bail (Section 437/439 CrPC)** — Applied after arrest; granted by Magistrate/Sessions Court\n" +
      "• **Anticipatory Bail (Section 438 CrPC)** — Applied BEFORE arrest; granted by Sessions Court or High Court\n" +
      "• **Default/Statutory Bail** — If chargesheet not filed within 60/90 days of arrest\n\n" +
      "**How to Apply for Bail:**\n" +
      "1. Hire a criminal lawyer immediately\n" +
      "2. File bail application in the appropriate court\n" +
      "3. Provide sureties (guarantors) if bail is granted\n" +
      "4. Comply with bail conditions strictly\n\n" +
      "**Important Precautions:**\n" +
      "• Do NOT resist arrest physically — it worsens your legal position\n" +
      "• Do NOT sign any document without reading and understanding it\n" +
      "• Contact a lawyer before making any statement to police\n\n" +
      "📞 NALSA (Free Legal Aid): **15100** · Police: **100** · Emergency: **112**" +
      DISCLAIMER_EN,
    hi:
      "**भारत में गिरफ्तारी के अधिकार और जमानत** 🔒\n\n" +
      "**गिरफ्तारी के समय आपके अधिकार:**\n" +
      "• गिरफ्तारी का कारण जानने का अधिकार (धारा 50 CrPC)\n" +
      "• तुरंत परिवार या मित्र को सूचित करने का अधिकार\n" +
      "• वकील से परामर्श और बचाव का अधिकार (अनुच्छेद 22)\n" +
      "• 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश करने का अधिकार\n" +
      "• महिलाओं को सूर्यास्त के बाद गिरफ्तार नहीं किया जा सकता\n\n" +
      "**जमानत के प्रकार:**\n" +
      "• **नियमित जमानत (धारा 437/439 CrPC)** — गिरफ्तारी के बाद आवेदन\n" +
      "• **अग्रिम जमानत (धारा 438 CrPC)** — गिरफ्तारी से पहले आवेदन; सेशन कोर्ट या हाईकोर्ट\n" +
      "• **डिफॉल्ट जमानत** — यदि 60/90 दिन में चार्जशीट दाखिल न हो\n\n" +
      "**जमानत के लिए क्या करें:**\n" +
      "1. तुरंत एक आपराधिक वकील नियुक्त करें\n" +
      "2. उचित अदालत में जमानत आवेदन दाखिल करें\n" +
      "3. जमानत मिलने पर जमानतदार प्रस्तुत करें\n\n" +
      "📞 NALSA (निःशुल्क सहायता): **15100** · पुलिस: **100** · आपातकाल: **112**" +
      DISCLAIMER_HI,
  },

  // ── UPI / Online Fraud (Hinglish-friendly) ────────────────────────────────
  {
    keywords: [
      "upi fraud", "online fraud", "paisa gaya", "fraud hua", "scam",
      "khata khali", "bank fraud", "net banking fraud",
      "upi se paisa gaya", "cyber fraud kya karu", "fraud ho gaya",
      "paise gaye", "thagi", "dhoka",
    ],
    en:
      "**UPI / Online Fraud — What to Do Immediately** 💸\n\n" +
      "**Brief Answer:** Act within the first 24 hours — the faster you report, the higher the chance of recovery.\n\n" +
      "**Immediate Steps:**\n" +
      "1. **Call 1930** (Cyber Crime Helpline) — they can help freeze transactions\n" +
      "2. **Call your bank helpline** — report the fraud and request transaction reversal\n" +
      "3. **File complaint at cybercrime.gov.in**\n" +
      "4. **File FIR** at nearest police station (Cyber Cell preferred)\n\n" +
      "**Evidence to Collect:**\n" +
      "• Screenshot of the fraudulent transaction\n" +
      "• Transaction ID / UTR number\n" +
      "• Phone number or account used by fraudster\n" +
      "• Any messages, calls, or links received\n\n" +
      "**Relevant Laws:**\n" +
      "• IT Act 2000 — Section 66D (cheating by impersonation using computer)\n" +
      "• IPC Section 420 (cheating) · RBI guidelines on unauthorized transactions\n\n" +
      "**Important Precautions:**\n" +
      "• NEVER share OTP — banks never ask for OTP\n" +
      "• NEVER click suspicious links or scan unknown QR codes\n" +
      "• Register complaint within 3 days for maximum recovery chance\n\n" +
      "📞 Cyber Crime: **1930** · Police: **100** · Bank Customer Care: (check your bank app)" +
      DISCLAIMER_EN,
    hi:
      "**UPI / ऑनलाइन फ्रॉड — तुरंत क्या करें** 💸\n\n" +
      "**तत्काल कदम (पहले 24 घंटे महत्वपूर्ण):**\n" +
      "1. **1930 पर कॉल करें** (साइबर क्राइम हेल्पलाइन)\n" +
      "2. **बैंक हेल्पलाइन पर कॉल करें** — लेनदेन रिवर्सल का अनुरोध करें\n" +
      "3. **cybercrime.gov.in** पर ऑनलाइन शिकायत दर्ज करें\n" +
      "4. **नजदीकी पुलिस स्टेशन** (साइबर सेल) में FIR दर्ज करें\n\n" +
      "**सबूत इकट्ठे करें:**\n" +
      "• धोखाधड़ी वाले ट्रांजेक्शन का स्क्रीनशॉट\n" +
      "• Transaction ID / UTR नंबर\n" +
      "• ठग का फोन नंबर या खाता\n\n" +
      "**सावधानियां:**\n" +
      "• OTP कभी किसी के साथ शेयर न करें\n" +
      "• 3 दिन के भीतर शिकायत दर्ज करें\n\n" +
      "📞 साइबर क्राइम: **1930** · पुलिस: **100**" +
      DISCLAIMER_HI,
  },
];

// ── Default fallback ───────────────────────────────────────────────────────────

const DEFAULT_EN =
  "**Nyaya Setu — AI Legal Assistant** ⚖️\n\n" +
  "I can help you with:\n" +
  "• **Women's Rights** — DV Act, POSH Act, Section 498A\n" +
  "• **Men's Rights** — Protection against false cases\n" +
  "• **FIR Process** — How to file a police complaint\n" +
  "• **Cyber Crime** — Reporting online fraud (Helpline: 1930)\n" +
  "• **Domestic Violence** — Legal protection & relief\n" +
  "• **Property Disputes** — Civil and criminal options\n" +
  "• **Consumer Rights** — Filing complaints (1800-11-4000)\n" +
  "• **NALSA** — Free legal aid (15100)\n" +
  "• **Child Rights** — CHILDLINE (1098)\n" +
  "• **Senior Citizen Rights** — Helpline (14567)\n\n" +
  "Please ask your specific question and I'll provide detailed legal information.\n\n" +
  "📞 Emergency: **112** · Police: **100** · Women: **1091** · Cyber: **1930**" +
  DISCLAIMER_EN;

const DEFAULT_HI =
  "**Nyaya Setu — AI Legal Assistant** ⚖️\n\n" +
  "मैं इन विषयों में सहायता कर सकता हूँ:\n" +
  "• **महिला अधिकार** — DV Act, POSH Act, धारा 498A\n" +
  "• **पुरुष अधिकार** — झूठे मामलों से सुरक्षा\n" +
  "• **FIR प्रक्रिया** — पुलिस में शिकायत कैसे दर्ज करें\n" +
  "• **साइबर अपराध** — ऑनलाइन धोखाधड़ी की रिपोर्ट (हेल्पलाइन: 1930)\n" +
  "• **घरेलू हिंसा** — कानूनी सुरक्षा और राहत\n" +
  "• **संपत्ति विवाद** — दीवानी और आपराधिक विकल्प\n" +
  "• **उपभोक्ता अधिकार** — शिकायत (1800-11-4000)\n" +
  "• **NALSA** — निःशुल्क कानूनी सहायता (15100)\n" +
  "• **बाल अधिकार** — CHILDLINE (1098)\n" +
  "• **वरिष्ठ नागरिक अधिकार** — हेल्पलाइन (14567)\n\n" +
  "कृपया अपना विशिष्ट प्रश्न पूछें।\n\n" +
  "📞 आपातकाल: **112** · पुलिस: **100** · महिला: **1091** · साइबर: **1930**" +
  DISCLAIMER_HI;

// ── Public API ────────────────────────────────────────────────────────────────

export type Language = "hi" | "en" | "hinglish";

/**
 * Detects language from user text.
 * - Significant Devanagari characters -> "hi"
 * - Latin script with common Hindi words -> "hinglish"
 * - Otherwise -> "en"
 */
export function detectLanguage(text: string): Language {
  const devanagari = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  if (devanagari >= 2) return "hi";
  // Hinglish: Latin script with common Hindi words
  const hinglishWords = /\b(kya|hai|hain|kaise|karo|kare|karein|mein|nahi|nahin|aur|ya|toh|bhi|se|ko|ka|ki|ke|yeh|woh|hua|gaya|karu|karoon|chahiye|matlab|theek|accha|bilkul|zaroor|lagta|lagti|sakte|sakti|milega|milegi|kuch|sab|bahut|thoda|jaldi|abhi|pehle|baad|lekin|isliye|kyunki|agar|tum|mujhe|mera|meri|apna|apni|ghar|paisa|logo|log|baat|kaam|din|raat|dono|saath|uska|unka)\b/i;
  if (hinglishWords.test(text)) return "hinglish";
  return "en";
}

/**
 * Returns a built-in answer for the given user query.
 * Hinglish queries get English answers (clearest for mixed-language users).
 * Always returns a non-empty string — never throws.
 */
export function getOfflineAnswer(userText: string): string {
  const lower = userText.toLowerCase();
  const lang = detectLanguage(userText);

  for (const entry of KB) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return lang === "hi" ? entry.hi : entry.en;
    }
  }

  return lang === "hi" ? DEFAULT_HI : DEFAULT_EN;
}
