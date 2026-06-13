"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

const categories = [
  {
    id: "women",
    icon: "👩",
    title: "Women's Rights",
    color: "bg-pink-50 border-pink-100",
    rights: [
      { title: "Protection from Domestic Violence", law: "Domestic Violence Act, 2005", desc: "Women are protected from physical, emotional, sexual, and economic abuse by any household member. They can seek protection orders, residence rights, and monetary relief." },
      { title: "Equal Pay for Equal Work", law: "Equal Remuneration Act, 1976", desc: "Women are entitled to the same pay as men for performing the same or similar work. Employers cannot discriminate based on gender in matters of wages." },
      { title: "Protection against Sexual Harassment", law: "POSH Act, 2013", desc: "Every woman has the right to a safe workplace. Organizations with 10+ employees must have an Internal Complaints Committee." },
      { title: "Maternity Benefits", law: "Maternity Benefit Act, 1961", desc: "Women are entitled to paid maternity leave — 26 weeks for first two children. The employer cannot terminate employment during pregnancy." },
      { title: "Dowry Protection", law: "Dowry Prohibition Act, 1961", desc: "Demanding or giving dowry is a criminal offence punishable with minimum 5 years imprisonment and minimum fine of ₹15,000." },
      { title: "Right to File Complaint Anonymously", law: "CrPC Section 154", desc: "Women can file FIRs for sensitive offences online or through women officers. Sexual assault cases must be recorded by a woman police officer." },
    ],
  },
  {
    id: "men",
    icon: "👨",
    title: "Men's Rights",
    color: "bg-blue-50 border-blue-100",
    rights: [
      { title: "Protection Against False Cases", law: "IPC Section 182, 211", desc: "Filing a false police report or criminal case is a punishable offence. Men falsely accused can pursue legal remedies including counter-complaints." },
      { title: "Right to Custody", law: "Guardians and Wards Act, 1890", desc: "Fathers have equal rights to custody of children. Courts decide based on the child's best interest, not the gender of the parent." },
      { title: "Protection Against Extortion", law: "IPC Sections 383-389", desc: "Anyone threatening or extorting under threat of filing false cases can be prosecuted under extortion provisions of IPC." },
      { title: "Right to Fair Trial", law: "Article 21, Constitution of India", desc: "Every person, including men, has the right to a fair, speedy trial. No one can be presumed guilty without proper judicial process." },
    ],
  },
  {
    id: "child",
    icon: "🧒",
    title: "Child Rights",
    color: "bg-green-50 border-green-100",
    rights: [
      { title: "Right to Free Education", law: "Right to Education Act, 2009", desc: "Every child between 6-14 years has a fundamental right to free and compulsory education in a neighbourhood school." },
      { title: "Protection from Child Labour", law: "Child Labour (P&R) Act, 1986", desc: "Employing children below 14 years in any occupation or process is prohibited. Children 14-18 cannot work in hazardous occupations." },
      { title: "Protection from Abuse", law: "POCSO Act, 2012", desc: "The Protection of Children from Sexual Offences Act provides comprehensive protection. Reporting child abuse is mandatory for all citizens." },
      { title: "Right to Identity", law: "Registration of Births & Deaths Act", desc: "Every child has the right to a name, nationality, and identity from birth. Birth registration is mandatory and free of charge." },
    ],
  },
  {
    id: "senior",
    icon: "👴",
    title: "Senior Citizen Rights",
    color: "bg-orange-50 border-orange-100",
    rights: [
      { title: "Maintenance from Children", law: "Maintenance & Welfare of Parents Act, 2007", desc: "Children are legally obligated to maintain parents and senior citizens. Maintenance tribunals can order monthly maintenance up to ₹10,000." },
      { title: "Property Protection", law: "Senior Citizen Act, 2007", desc: "Property transferred to children by senior citizens can be revoked if children fail to provide basic needs. Speedy tribunals ensure quick relief." },
      { title: "Priority in Court Proceedings", law: "Civil Procedure Code", desc: "Cases involving senior citizens (above 65) must be given priority hearing in courts. Many courts have dedicated senior citizen benches." },
      { title: "Protection from Abuse", law: "IPC + Senior Citizens Act", desc: "Physical, mental, or financial abuse of senior citizens is a criminal offence. Immediate shelter and relief is available through district authorities." },
    ],
  },
  {
    id: "consumer",
    icon: "🛒",
    title: "Consumer Rights",
    color: "bg-purple-50 border-purple-100",
    rights: [
      { title: "Right to be Informed", law: "Consumer Protection Act, 2019", desc: "Consumers have the right to be informed about the quality, quantity, potency, purity, standard, and price of goods and services." },
      { title: "Right to Redressal", law: "Consumer Protection Act, 2019", desc: "Consumers can file complaints at District, State, or National Consumer Commissions based on the claim value. Online filing available at edaakhil.nic.in." },
      { title: "Right Against Unfair Trade", law: "Consumer Protection Act, 2019", desc: "Misleading advertisements, adulteration, and unfair trade practices are prohibited. Penalty includes imprisonment and monetary fines." },
      { title: "Product Liability", law: "Consumer Protection Act, 2019", desc: "Manufacturers, service providers are liable for defective products or deficient services. Compensation including actual loss and punitive damages available." },
    ],
  },
  {
    id: "property",
    icon: "🏠",
    title: "Property Rights",
    color: "bg-yellow-50 border-yellow-100",
    rights: [
      { title: "Right to Own Property", law: "Article 300A, Constitution of India", desc: "No person can be deprived of their property except by authority of law. Unlawful dispossession can be challenged in court." },
      { title: "Inheritance Rights", law: "Hindu Succession Act, 1956", desc: "Sons and daughters have equal rights in ancestral property since 2005 amendment. Women have equal inheritance rights as male heirs." },
      { title: "Protection against Benami", law: "Benami Transactions Act, 1988", desc: "Benami property transactions are prohibited. Property acquired in another's name without genuine transfer is liable to be confiscated." },
      { title: "RERA Protection for Home Buyers", law: "RERA Act, 2016", desc: "Home buyers are protected from builder delays and fraud. Builders must register projects and provide compensation for delays at SBI PLR + 2%." },
    ],
  },
  {
    id: "cyber",
    icon: "💻",
    title: "Cyber Rights",
    color: "bg-purple-50 border-purple-100",
    rights: [
      { title: "Right to Report Cyber Crime", law: "IT Act, 2000 & Amendments", desc: "Every citizen can file a cyber crime complaint online at cybercrime.gov.in or call 1930. Offences include online fraud, harassment, stalking, and hacking." },
      { title: "Right to Data Privacy", law: "IT (Amendment) Act, 2008 / DPDP Act, 2023", desc: "Citizens have rights over their personal data. Organisations collecting data must have consent, maintain security, and allow users to access or delete their data." },
      { title: "Protection from Cyberstalking", law: "IPC Section 354D / IT Act Section 66E", desc: "Stalking a person through internet, email, or social media is a criminal offence. Victims can file FIR with cyber cell and obtain restraining orders." },
      { title: "Right Against Online Defamation", law: "IPC Section 499 / IT Act Section 66A struck down", desc: "Posting false statements online that damage someone's reputation is criminal defamation under IPC 499. Victims can file civil suits for damages as well." },
      { title: "Protection from Identity Theft", law: "IT Act Section 66C", desc: "Using another person's electronic signature, password, or identity fraudulently is punishable with up to 3 years imprisonment and ₹1 lakh fine." },
      { title: "Right to Safe Online Banking", law: "RBI Guidelines / IT Act 2000", desc: "Banks are liable for unauthorised transactions due to security failures. Report fraud immediately to bank and cybercrime portal for a chance at recovery." },
    ],
  },
  {
    id: "workplace",
    icon: "🏢",
    title: "Workplace Rights",
    color: "bg-slate-50 border-slate-200",
    rights: [
      { title: "Right to Safe Workplace (Women)", law: "POSH Act, 2013", desc: "Every woman has the right to a workplace free from sexual harassment. Employers with 10+ employees must form an Internal Complaints Committee (ICC)." },
      { title: "Right Against Wrongful Termination", law: "Industrial Disputes Act, 1947", desc: "Workers cannot be terminated without proper notice and reason. Retaliatory termination after complaints is illegal. Claim reinstatement or compensation through Labour Tribunal." },
      { title: "Right to Equal Pay", law: "Equal Remuneration Act, 1976", desc: "Employees doing the same work must receive the same remuneration regardless of gender. Discrimination in pay is illegal and can be reported to the Labour Commissioner." },
      { title: "Right to Provident Fund", law: "EPF & MP Act, 1952", desc: "Employees earning up to ₹15,000/month in establishments with 20+ workers are entitled to EPF. Employers must deduct and deposit contributions on time." },
      { title: "Right to Gratuity", law: "Payment of Gratuity Act, 1972", desc: "Employees who have served 5+ continuous years are entitled to gratuity upon resignation, retirement, or death. Formula: 15/26 × last drawn salary × years of service." },
      { title: "Right to Maternity / Paternity Leave", law: "Maternity Benefit Act, 1961", desc: "Women are entitled to 26 weeks paid maternity leave. Employers cannot terminate pregnant employees or reduce their pay during pregnancy." },
    ],
  },
  {
    id: "marriage",
    icon: "💍",
    title: "Marriage Rights",
    color: "bg-red-50 border-red-100",
    rights: [
      { title: "Right to Divorce", law: "Hindu Marriage Act / Special Marriage Act", desc: "Both spouses have equal right to seek divorce on valid grounds including cruelty, desertion, adultery, and mutual consent." },
      { title: "Alimony & Maintenance", law: "Section 125 CrPC / HMA Section 24", desc: "Both spouses can claim maintenance during and after divorce. The court considers income, assets, and standard of living while deciding amounts." },
      { title: "Stridhan Rights", law: "Hindu law / Supreme Court rulings", desc: "Stridhan (gifts received by wife before and after marriage) belongs exclusively to the wife. Husband or in-laws cannot claim it." },
      { title: "Registration of Marriage", law: "Hindu Marriage Act / Special Marriage Act", desc: "Marriage registration is mandatory in most states. Registered marriages provide legal protection for both spouses in case of disputes." },
    ],
  },
];

export default function RightsPage() {
  const [activeCategory, setActiveCategory] = useState("women");
  const [expandedRight, setExpandedRight] = useState<number | null>(null);

  const current = categories.find((c) => c.id === activeCategory)!;

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={550} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Legal Education</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Know Your Rights</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Every Indian citizen deserves to know their legal rights. Browse by category to understand protections available to you under Indian law.
            </p>
          </div>

          {/* Category tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setExpandedRight(null); }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-border bg-surface text-muted hover:border-primary/30 hover:text-primary"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.title}
              </button>
            ))}
          </div>

          {/* Rights grid */}
          <div className={`rounded-3xl border p-6 md:p-8 ${current.color}`}>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-4xl">{current.icon}</span>
              <h2 className="font-serif text-2xl font-bold text-primary">{current.title}</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {current.rights.length} rights
              </span>
            </div>

            <div className="space-y-4">
              {current.rights.map((right, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedRight(expandedRight === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-primary">{right.title}</p>
                        <p className="mt-0.5 text-xs font-medium text-accent">{right.law}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-muted transition-transform ${expandedRight === i ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {expandedRight === i && (
                    <div className="border-t border-border bg-background px-5 py-4">
                      <p className="text-sm leading-relaxed text-muted">{right.desc}</p>
                      <div className="mt-4 flex gap-3">
                        <Link
                          href="/chat"
                          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light"
                        >
                          Ask AI About This →
                        </Link>
                        <Link
                          href="/lawyers"
                          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-primary transition-all hover:border-accent hover:text-accent"
                        >
                          Find a Lawyer
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-3xl bg-primary px-6 py-10 text-center text-white">
            <h2 className="font-serif text-2xl font-bold">Need personalised legal guidance?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
              Our AI assistant can answer your specific legal questions and help you understand your situation better.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/chat" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-accent-light">
                Ask AI Assistant →
              </Link>
              <Link href="/lawyers" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                Find a Lawyer
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
