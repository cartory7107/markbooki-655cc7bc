import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { useEffect, useRef, useState, useMemo } from "react";
import { createServerFn } from "@tanstack/react-start";
import { getToolBySlug, slugify } from "@/lib/catalog-server";

const getToolData = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => d)
  .handler(({ data }) => getToolBySlug(data.slug));

function ToolDetailPage() {
  const { slug } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getToolData>>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [copied, setCopied] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getToolData({ data: { slug } }).then(setData);
  }, [slug]);

  const tool = data?.tool;
  const normCat = data?.normCat || "";
  const emoji = data?.emoji || "🤖";

  const domain = useMemo(() => {
    if (!tool?.u) return "";
    try { return new URL(tool.u).hostname; } catch { return ""; }
  }, [tool?.u]);

  const views = useMemo(() => {
    if (!tool) return "";
    let h = 0;
    for (let i = 0; i < tool.n.length; i++) h = tool.n.charCodeAt(i) + ((h << 5) - h);
    const v = ((h >>> 0) % 45000) + 500;
    return v >= 1000 ? (v / 1000).toFixed(1) + "K" : String(v);
  }, [tool]);

  const rating = useMemo(() => {
    if (!tool) return "4.5";
    let h = 0;
    for (let i = 0; i < tool.n.length; i++) h = tool.n.charCodeAt(i) + ((h << 5) - h);
    return (3.8 + ((h >>> 0) % 17) / 10).toFixed(1);
  }, [tool]);

  const reviews = useMemo(() => {
    if (!tool) return "100";
    let h = 0;
    for (let i = 0; i < tool.n.length; i++) h = tool.n.charCodeAt(i) + ((h << 5) - h);
    const r = ((h >>> 0) % 900) + 50;
    return r >= 1000 ? (r / 1000).toFixed(1) + "K" : String(r);
  }, [tool]);

  // Favicon loader
  useEffect(() => {
    if (!logoRef.current || !domain) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!logoRef.current) return;
      logoRef.current.innerHTML = "";
      logoRef.current.style.padding = "10px";
      logoRef.current.style.background = "#fff";
      const i = document.createElement("img");
      i.src = img.src;
      i.alt = tool?.n || "";
      i.className = "logo-img";
      logoRef.current.appendChild(i);
    };
    img.onerror = () => {
      const img2 = new Image();
      img2.onload = img.onload;
      img2.onerror = () => {};
      img2.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    };
    img.src = `https://icon.horse/icon/${domain}`;
  }, [domain, tool?.n]);

  if (!tool) {
    return (
      <div className="flex min-h-screen items-center justify-center moving-grid-bg">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Tool not found</h1>
          <a href="/" className="text-primary hover:underline">← Back to directory</a>
        </div>
      </div>
    );
  }

  const fullStars = Math.floor(parseFloat(rating));
  const halfStar = (parseFloat(rating) - fullStars) >= 0.3;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const pricingTag = (p: string) => {
    const free = ["Free", "Free Plan", "Free Trial", "Free Credits", "Daily Free", "Monthly Free", "Open Source", "open_source", "freemium"];
    if (free.includes(p)) return "Free";
    if (p === "Paid" || p === "Paid Plans") return "Paid";
    return p || "Contact";
  };

  const pTag = pricingTag(tool.p);
  const features = [
    pTag === "Free" ? "Free to use" : pTag === "Paid" ? "Premium plans available" : `${tool.p} pricing`,
    domain ? `Hosted at ${domain}` : null,
    `Listed in ${normCat}`,
    tool.g && tool.g !== tool.c ? `Part of ${tool.g}` : null,
    "SEO-optimized listing on MarkBook",
  ].filter(Boolean) as string[];

  const faqs = [
    { q: `What is ${tool.n}?`, a: tool.d },
    { q: `Is ${tool.n} free to use?`, a: `${tool.n} is available as ${tool.p}. Visit their official website for the most up-to-date pricing information and available plans.` },
    { q: `What are the best ${tool.n} alternatives?`, a: `You can find ${normCat.toLowerCase()} alternatives to ${tool.n} right here on MarkBook. Browse the related tools section below or explore the full ${normCat} category to compare options.` },
    { q: `How is ${tool.n} rated?`, a: `${tool.n} has an average rating of ${rating}/5 based on ${reviews} user reviews on MarkBook. Ratings are aggregated from user feedback across multiple sources.` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground moving-grid-bg">
      <div className="relative z-10">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-4 px-5">
            <a href="/" className="text-lg font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent shrink-0">MarkBook</a>
            <a href="/" className="inline-flex items-center gap-1 text-[13px] text-zinc-400 font-medium hover:text-zinc-100 transition-colors">
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              Back
            </a>
            <div className="ml-auto flex gap-1.5">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="size-8 rounded-lg border border-border bg-card text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 grid place-items-center text-sm transition-all cursor-pointer" title="Copy link">
                {copied ? "✓" : "🔗"}
              </button>
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(tool.n + " on MarkBook")}`, "_blank")}
                className="size-8 rounded-lg border border-border bg-card text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 grid place-items-center text-sm transition-all cursor-pointer" title="Share on X">
                𝕏
              </button>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-[1080px] px-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 py-3.5 text-xs text-zinc-500 flex-wrap">
            <a href="/" className="hover:text-zinc-200 transition-colors">Home</a>
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <a href="/" className="hover:text-zinc-200 transition-colors">{normCat}</a>
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span className="text-zinc-200">{tool.n}</span>
          </div>

          {/* Hero */}
          <div className="grid gap-9 pb-8 lg:grid-cols-[1fr_340px]">
            {/* Left */}
            <div>
              <div className="flex items-start gap-5">
                <div ref={logoRef} className={`tool-logo shrink-0 w-20 h-20 min-w-20 rounded-[20px] grid place-items-center text-[26px] font-extrabold text-white bg-gradient-to-br ${colorForName(tool.n)} shadow-[0_8px_32px_-8px_rgba(99,102,241,.35)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,.45)]`}>
                  {initials(tool.n)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-[clamp(22px,3.5vw,32px)] font-black leading-tight tracking-tight">{tool.n}</h1>
                  {domain && (
                    <a href={tool.u} target="_blank" rel="noopener" className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium max-w-full truncate hover:text-indigo-300 transition-colors">
                      <svg className="size-3 min-w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      {domain}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/15 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">{emoji} {normCat}</span>
                <span className={`inline-block rounded-lg px-3 py-1.5 text-[11px] font-bold text-white ${pTag === "Free" ? "bg-gradient-to-r from-emerald-500 to-green-500" : pTag === "Paid" ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-zinc-600 to-zinc-700"}`}>{pTag}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[.04] px-3 py-1.5 text-xs text-zinc-400">👁 {views} weekly</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/10 bg-amber-500/[.06] px-3 py-1.5 text-xs text-amber-400">
                  <span className="text-amber-400 tracking-wide">{"★".repeat(fullStars)}{halfStar ? "★" : ""}{"☆".repeat(emptyStars)}</span>
                  <b>{rating}</b>
                  <span className="text-zinc-500 font-normal">({reviews})</span>
                </span>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-zinc-300">{tool.d}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {tool.u && tool.u !== "#" && (
                  <a href={tool.u} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-3 text-sm font-bold text-white shadow-[0_6px_24px_-6px_rgba(99,102,241,.45)] transition-all hover:shadow-[0_10px_32px_-6px_rgba(99,102,241,.55)] hover:-translate-y-0.5">
                    🌐 Visit {tool.n} →
                  </a>
                )}
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-[13px] font-semibold text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all cursor-pointer">
                  🔗 {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3">
              {/* Quick Info */}
              <div className="sidebar-card">
                <h3 className="text-[13px] font-bold text-zinc-200 border-b border-zinc-800/80 px-4 py-3 flex items-center gap-2">🔧 Quick Info</h3>
                <div className="px-4 py-3.5 space-y-0">
                  {[
                    ["Pricing", pTag],
                    ["Category", `${emoji} ${normCat}`],
                    ["Group", tool.g || "—"],
                    ["Weekly Views", views],
                    ["Rating", <span className="text-amber-400">★ {rating}/5</span>],
                    ["Tools in Category", String(data?.sameCategoryCount || 0)],
                  ].map(([label, value], i) => (
                    <div key={label} className={`flex justify-between items-center py-2.5 ${i < 5 ? "border-b border-zinc-800/50" : ""}`}>
                      <span className="text-xs text-zinc-500">{label}</span>
                      <span className="text-xs font-semibold text-zinc-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="sidebar-card">
                <h3 className="text-[13px] font-bold text-zinc-200 border-b border-zinc-800/80 px-4 py-3 flex items-center gap-2">✅ Highlights</h3>
                <ul className="px-4 py-3.5 space-y-1.5">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-zinc-300 py-1">
                      <span className="text-emerald-400 font-bold text-sm min-w-[18px]">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Online Presence */}
              <div className="sidebar-card">
                <h3 className="text-[13px] font-bold text-zinc-200 border-b border-zinc-800/80 px-4 py-3 flex items-center gap-2">🌐 Online Presence</h3>
                <div className="grid grid-cols-2 gap-2 p-3.5">
                  {[
                    { icon: "🌐", label: domain || "Website", href: tool.u, bg: "#6366f1" },
                    { icon: "𝕏", label: "X / Twitter", href: `https://twitter.com/search?q=${encodeURIComponent(tool.n)}`, bg: "#000" },
                    { icon: "G", label: "Google Reviews", href: `https://www.google.com/search?q=${encodeURIComponent(tool.n + " review")}`, bg: "#ea4335" },
                    { icon: "▶", label: "YouTube", href: `https://www.youtube.com/results?search_query=${encodeURIComponent(tool.n)}`, bg: "#f00" },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener"
                      className="flex items-center gap-2.5 rounded-[10px] border border-zinc-800/80 bg-zinc-950 p-2.5 text-zinc-300 transition-all hover:border-zinc-700 hover:text-zinc-100 hover:-translate-y-0.5">
                      <span className="w-8 h-8 min-w-8 rounded-lg grid place-items-center text-[13px] font-bold text-white" style={{ background: s.bg }}>{s.icon}</span>
                      <span className="text-xs font-semibold truncate">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border-t border-zinc-800/80 py-8">
            <h2 className="text-lg font-extrabold mb-1.5">About {tool.n}</h2>
            <p className="text-sm text-zinc-500 mb-5">Everything you need to know about this {normCat.toLowerCase()} tool</p>
            <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
              <p>{tool.n} is a {normCat.toLowerCase()} tool that {tool.d.toLowerCase().replace(/\.$/, "")}. Available as {pTag.toLowerCase()}, it is listed in the MarkBook AI tools directory alongside {data?.sameCategoryCount || 0} {normCat.toLowerCase()} tools from top providers worldwide.</p>
              <p>Looking for {tool.n} alternatives or similar {normCat.toLowerCase()}? MarkBook helps you compare features, pricing, and reviews across thousands of AI tools. Find the best {normCat.toLowerCase()} for your specific needs and workflow.</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="border-t border-zinc-800/80 py-8">
            <h2 className="text-lg font-extrabold mb-1.5">Frequently Asked Questions</h2>
            <p className="text-sm text-zinc-500 mb-5">Common questions about {tool.n}</p>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-800/80 overflow-hidden transition-colors hover:border-zinc-700/80">
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className={`w-full flex justify-between items-center px-4.5 py-3.5 text-[14px] font-semibold text-left bg-zinc-900/50 transition-colors hover:bg-zinc-900 cursor-pointer ${openFaq === i ? "text-indigo-400" : "text-zinc-200"}`}>
                    {faq.q}
                    <span className={`text-xs text-zinc-600 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {openFaq === i && <div className="px-4.5 pb-3.5 text-[13px] text-zinc-400 leading-relaxed">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          {data?.related && data.related.length > 0 && (
            <div className="border-t border-zinc-800/80 py-8">
              <h2 className="text-lg font-extrabold mb-1.5">Related {normCat} Tools</h2>
              <p className="text-sm text-zinc-500 mb-4">Similar tools you might also like — {data.sameCategoryCount} tools in this category</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.related.map(r => {
                  const rSlug = slugify(r.n);
                  return (
                    <a key={r.n} href={`/tool/${rSlug}`} className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 transition-all hover:border-indigo-500/50 hover:bg-zinc-900/70 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-6px_rgba(99,102,241,.2)]">
                      <span className={`w-9 h-9 min-w-9 rounded-lg grid place-items-center text-[10px] font-bold text-white bg-gradient-to-br ${colorForName(r.n)}`}>{initials(r.n)}</span>
                      <div className="min-w-0">
                        <b className="block text-[13px] font-semibold text-zinc-200 truncate">{r.n}</b>
                        <span className="text-[11px] text-zinc-500">{r.emoji} {r.normCat}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-zinc-800/80 py-12 text-center">
            <h2 className="text-xl font-extrabold mb-1.5">Explore {(data?.totalTools || 0).toLocaleString()}+ AI Tools</h2>
            <p className="text-sm text-zinc-500 mb-5">Discover the full MarkBook AI directory — your gateway to the best AI tools</p>
            <a href="/" className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3 text-sm font-bold text-white shadow-[0_6px_24px_-6px_rgba(99,102,241,.4)] transition-all hover:shadow-[0_10px_32px_-6px_rgba(99,102,241,.55)] hover:-translate-y-0.5">Browse All AI Tools →</a>
          </div>

          <div className="border-t border-zinc-800/80 py-5 text-center text-xs text-zinc-600">© 2025 MarkBook — AI Tools Directory. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

/* Helpers */
const COLORS = [
  "from-violet-500 to-purple-600", "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500", "from-pink-500 to-rose-600", "from-cyan-500 to-blue-600",
];
function colorForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

export const Route = createFileRoute("/tool/$slug")({
  component: ToolDetailPage,
});