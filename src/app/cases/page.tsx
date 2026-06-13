"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

const cases = [
  {
    id: "1",
    title: "Vishaka v. State of Rajasthan",
    category: "Workplace Harassment",
    court: "Supreme Court of India",
    year: 1997,
    citation: "AIR 1997 SC 3011",
    summary: "Landmark judgment establishing guidelines to prevent sexual harassment of women at workplaces, leading to the POSH Act.",
    issue: "Whether the employer has a duty to protect female employees from sexual harassment and what remedies are available.",
    resolution: "Supreme Court issued the 'Vishaka Guidelines' creating binding rules for employers to prevent and address workplace sexual harassment.",
    takeaway: "Every employer must have a written anti-sexual harassment policy and complaints committee. Failure to do so is a violation of fundamental rights.",
  },
  {
    id: "2",
    title: "Shah Bano Case",
    category: "Divorce",
    court: "Supreme Court of India",
    year: 1985,
    citation: "AIR 1985 SC 945",
    summary: "Pivotal case affirming divorced Muslim women's right to maintenance under Section 125 CrPC beyond the iddat period.",
    issue: "Whether a Muslim divorced woman is entitled to maintenance from her former husband beyond the iddat period under Section 125 CrPC.",
    resolution: "Supreme Court upheld the right of divorced Muslim women to claim maintenance under Section 125 CrPC, overriding personal law.",
    takeaway: "Section 125 CrPC applies to all women regardless of religion. Maintenance can be claimed beyond the iddat period to prevent destitution.",
  },
  {
    id: "3",
    title: "Mary Roy v. State of Kerala",
    category: "Property Rights",
    court: "Supreme Court of India",
    year: 1986,
    citation: "AIR 1986 SC 1011",
    summary: "Case that gave Syrian Christian women equal inheritance rights, overriding the Travancore Succession Act.",
    issue: "Whether Syrian Christian women in Kerala were entitled to equal shares in intestate succession as their male counterparts.",
    resolution: "The Indian Succession Act was held applicable to Syrian Christians, granting daughters equal inheritance rights.",
    takeaway: "Daughters of Syrian Christian families in Kerala now have equal inheritance rights. Gender-discriminatory succession laws can be challenged.",
  },
  {
    id: "4",
    title: "D.K. Basu v. State of West Bengal",
    category: "False Cases",
    court: "Supreme Court of India",
    year: 1997,
    citation: "AIR 1997 SC 610",
    summary: "Established comprehensive guidelines for arrest and detention to prevent custodial violence and false imprisonment.",
    issue: "Custodial deaths and police brutality during arrest and detention violating fundamental rights.",
    resolution: "Supreme Court issued 11 binding guidelines that police must follow during arrest and detention, including informing family and right to legal aid.",
    takeaway: "Police must follow D.K. Basu guidelines during any arrest. You have the right to know the grounds of arrest and contact a lawyer immediately.",
  },
  {
    id: "5",
    title: "Olga Tellis v. Bombay Municipal Corporation",
    category: "Property Rights",
    court: "Supreme Court of India",
    year: 1985,
    citation: "AIR 1986 SC 180",
    summary: "Recognised the right to livelihood as part of Article 21 (Right to Life). Pavement dwellers cannot be evicted without notice.",
    issue: "Whether the BMC could forcibly evict pavement dwellers without prior notice or alternative accommodation.",
    resolution: "Court held that right to livelihood is integral to right to life. Forced eviction without notice violates Article 21.",
    takeaway: "Forced eviction without reasonable notice violates fundamental rights. Citizens have a right to be heard before eviction proceedings.",
  },
  {
    id: "6",
    title: "Shreya Singhal v. Union of India",
    category: "Cyber Crime",
    court: "Supreme Court of India",
    year: 2015,
    citation: "AIR 2015 SC 1523",
    summary: "Struck down Section 66A of the IT Act as unconstitutional for being vague and violating freedom of speech online.",
    issue: "Whether Section 66A of the Information Technology Act unconstitutionally restricted free speech on the internet.",
    resolution: "Section 66A was struck down as unconstitutional. Online speech enjoys the same constitutional protections as offline speech.",
    takeaway: "You cannot be arrested merely for posting opinions online. Section 66A no longer exists. Only direct incitement to violence or proven defamation can be prosecuted.",
  },
  {
    id: "7",
    title: "Indra Sarma v. V.K.V. Sarma",
    category: "Domestic Violence",
    court: "Supreme Court of India",
    year: 2013,
    citation: "(2013) 15 SCC 755",
    summary: "Extended protection under the Domestic Violence Act to live-in relationships, recognising them as 'relationships in the nature of marriage'.",
    issue: "Whether a woman in a live-in relationship is entitled to protection under the Domestic Violence Act, 2005.",
    resolution: "Court ruled that live-in relationships fulfilling certain criteria are entitled to protection under the DV Act.",
    takeaway: "Women in live-in relationships of a certain duration and nature can seek protection under the Domestic Violence Act — not just married women.",
  },
  {
    id: "8",
    title: "Common Cause v. Union of India",
    category: "Property Rights",
    court: "Supreme Court of India",
    year: 2018,
    citation: "(2018) 5 SCC 1",
    summary: "Recognised the right to die with dignity as a fundamental right, legalising passive euthanasia and advance medical directives.",
    issue: "Whether a person has the fundamental right to die with dignity and whether advance directives (living wills) are legally valid.",
    resolution: "Supreme Court recognised right to die with dignity under Article 21. Passive euthanasia and advance directives are legally valid.",
    takeaway: "Every citizen has the right to draft a living will specifying medical care preferences. This is a fundamental right under Article 21.",
  },
  {
    id: "9",
    title: "Gian Kaur v. State of Punjab",
    category: "False Cases",
    court: "Supreme Court of India",
    year: 1996,
    citation: "AIR 1996 SC 1257",
    summary: "Held that the right to life under Article 21 does not include the right to die, and assisted suicide remains a criminal offence.",
    issue: "Whether Section 309 IPC (attempt to suicide) and Section 306 IPC (abetment of suicide) violate Articles 14 and 21.",
    resolution: "Both sections were upheld as constitutional. Right to life does not include right to die.",
    takeaway: "Mental health support is critical. If you or someone is in crisis, call iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345.",
  },
  {
    id: "10",
    title: "NCDRC v. Emaar MGF Land Ltd.",
    category: "Consumer Rights",
    court: "National Consumer Disputes Redressal Commission",
    year: 2019,
    citation: "CC/21/2017",
    summary: "Major builder held liable for delay in possession and ordered to pay ₹150 crore compensation to flat buyers.",
    issue: "Delay in delivery of flats by a major real estate developer constituting deficiency in service under Consumer Protection Act.",
    resolution: "Builder found guilty of deficiency in service. Ordered to pay compensation to all affected buyers at SBI PLR + 2%.",
    takeaway: "Home buyers are consumers under the Consumer Protection Act. Builder delays can be challenged at consumer forums with compensation for the delay period.",
  },
  {
    id: "11",
    title: "Joseph Shine v. Union of India",
    category: "Domestic Violence",
    court: "Supreme Court of India",
    year: 2018,
    citation: "(2019) 3 SCC 39",
    summary: "Struck down Section 497 IPC (adultery) as unconstitutional, recognising women as equal partners in a marriage.",
    issue: "Whether Section 497 IPC criminalising adultery was constitutional and whether it treated men and women unequally.",
    resolution: "Section 497 IPC was struck down as unconstitutional for being archaic and treating women as property of their husbands.",
    takeaway: "Adultery is no longer a criminal offence in India. However, it can still be a ground for divorce proceedings.",
  },
  {
    id: "12",
    title: "Arnesh Kumar v. State of Bihar",
    category: "False Cases",
    court: "Supreme Court of India",
    year: 2014,
    citation: "(2014) 8 SCC 273",
    summary: "Issued guidelines to prevent automatic arrest under Section 498A IPC, requiring magistrate scrutiny before arrest.",
    issue: "Misuse of Section 498A IPC leading to automatic arrest of husbands and in-laws without proper investigation.",
    resolution: "Police must follow checklist before arresting under Section 498A. Magistrate must apply mind before authorising detention.",
    takeaway: "Arrest under Section 498A is not automatic. Police must follow established guidelines and arrest can be challenged with proper legal support.",
  },
];

const categories = ["All", "Workplace Harassment", "Divorce", "Property Rights", "False Cases", "Domestic Violence", "Consumer Rights", "Cyber Crime"];

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchCat = selectedCategory === "All" || c.category === selectedCategory;
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.summary.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={550} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Hero */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Legal Database</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Case Library</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Browse landmark Supreme Court and High Court judgments that shaped Indian law.
            </p>
          </div>

          {/* Search + filters */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <input
              type="text"
              placeholder="🔍  Search cases by title, topic, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "border-primary bg-primary text-white"
                      : "border-border text-muted hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-5 text-sm text-muted">{filtered.length} case{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Cases grid */}
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden card-hover"
              >
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                      {c.category}
                    </span>
                    <span className="text-xs text-muted">{c.court} · {c.year}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-primary leading-snug">{c.title}</h3>
                  <p className="mt-1 text-xs font-medium text-accent">{c.citation}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">{c.summary}</p>
                </div>

                <div className="border-t border-border px-6 py-3">
                  <button
                    onClick={() => setExpandedCase(expandedCase === c.id ? null : c.id)}
                    className="text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    {expandedCase === c.id ? "Hide Details ▲" : "View Details ▼"}
                  </button>
                </div>

                {expandedCase === c.id && (
                  <div className="border-t border-border bg-background px-6 py-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Issue</p>
                      <p className="text-sm text-muted">{c.issue}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Resolution</p>
                      <p className="text-sm text-muted">{c.resolution}</p>
                    </div>
                    <div className="rounded-xl bg-accent/10 border border-accent/20 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Key Takeaway</p>
                      <p className="text-sm font-medium text-primary">{c.takeaway}</p>
                    </div>
                    <Link
                      href="/chat"
                      className="inline-block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light"
                    >
                      Discuss this case with AI →
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 font-serif text-xl text-primary">No cases found</p>
              <p className="mt-2 text-sm text-muted">Try a different search term or category.</p>
              <button onClick={() => { setSearch(""); setSelectedCategory("All"); }} className="mt-4 rounded-full border border-border px-5 py-2 text-sm text-muted hover:text-primary">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
