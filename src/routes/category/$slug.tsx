import { createFileRoute, Link } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCatalog, getCategoryEmojis, searchTools, type Tool } from "@/lib/catalog-server";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

/**
 * Dynamic category landing pages — shows ALL tools with infinite scroll.
 * Free tools appear first, paid tools after.
 * NOT linked from nav, but indexable by search engines.
 */

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const COLORS = [
  "from-violet-500 to-purple-600", "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500", "from-pink-500 to-rose-600", "from-cyan-500 to-blue-600",
  "from-amber-500 to-yellow-500", "from-fuchsia-500 to-purple-600",
];

function colorForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

const PRICING_LABEL: Record<string, string> = {
  Free: "Free", "Free Plan": "Free Plan", "Free Trial": "Free Trial",
  "Free Credits": "Free Credits", "Daily Free": "Daily Free", "Monthly Free": "Monthly Free",
  Paid: "Paid", "Paid Plans": "Paid Plans", "Open Source": "Open Source",
  unknown: "Unknown", Unknown: "Unknown", freemium: "Freemium",
};

function isFreePrice(p: string) {
  return ["Free", "Free Plan", "Free Trial", "Free Credits", "Daily Free", "Monthly Free", "Open Source", "open_source", "freemium"].includes(p);
}

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const slug = params.slug as string;
    const catalog = getCatalog();
    let matchedName = "";
    let toolCount = 0;
    for (const [name, count] of Object.entries(catalog.categories)) {
      if (slugify(name) === slug) { matchedName = name; toolCount = count; break; }
    }
    if (!matchedName) return { meta: [{ title: "Category Not Found | MarkBook AI" }] };
    const title = `Best ${matchedName} — ${toolCount}+ Tools Compared | MarkBook AI Directory`;
    const desc = `Compare ${toolCount}+ ${matchedName.toLowerCase()}. Find the best free and paid ${matchedName.toLowerCase()} with reviews, features, and pricing. Updated daily on MarkBook AI.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `https://markbook.cartory.top/category/${slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `https://markbook.cartory.top/category/${slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const catalog = getCatalog();
  const emojis = getCategoryEmojis();

  // Find matching category
  const matchedCategory = useMemo(() => {
    for (const [name] of Object.entries(catalog.categories)) {
      if (slugify(name) === slug) return name;
    }
    return null;
  }, [slug]);

  const [tools, setTools] = useState<Tool[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 60;

  // Initial load
  useEffect(() => {
    if (!matchedCategory) return;
    setLoading(true);
    const data = searchTools({ category: matchedCategory, offset: 0, limit: PAGE_SIZE });
    setTools(data.results);
    setTotal(data.total);
    setOffset(PAGE_SIZE);
    setLoading(false);
    setInitialLoaded(true);
  }, [matchedCategory]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!initialLoaded || !loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && offset < total) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [initialLoaded, offset, total, loadingMore]);

  const loadMore = useCallback(() => {
    if (loadingMore || offset >= total) return;
    setLoadingMore(true);
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const data = searchTools({ category: matchedCategory!, offset, limit: PAGE_SIZE });
      setTools((prev) => [...prev, ...data.results]);
      setOffset((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 50);
  }, [matchedCategory, offset, total, loadingMore]);

  if (!matchedCategory) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2 text-muted-foreground">Category not found</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const emoji = emojis[matchedCategory] || "🤖";
  const relatedCats = Object.entries(catalog.categories)
    .filter(([n]) => n !== matchedCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  // JSON-LD structured data for crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best ${matchedCategory} — ${total}+ Tools Compared | MarkBook AI Directory`,
    url: `https://markbook.cartory.top/category/${slug}`,
    isPartOf: { "@type": "WebSite", name: "MarkBook AI", url: "https://markbook.cartory.top" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: tools.slice(0, 20).map((tool, i) => ({
        "@type": "ListItem", position: i + 1,
        item: { "@type": "SoftwareApplication", name: tool.n, description: tool.d, applicationCategory: tool.c, url: tool.u },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1200px] px-5 py-4 text-sm text-[#a1a1aa]">
        <Link to="/" className="hover:text-white">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/" className="hover:text-white">AI Tools</Link>
        <span className="mx-2">›</span>
        <span className="text-white">{matchedCategory}</span>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-[1200px] px-5 pb-8 text-center border-b border-[#27272a]">
        <h1 className="text-[clamp(24px,4vw,42px)] font-black" style={{
          background: "linear-gradient(135deg,#6366f1,#a855f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {emoji} {matchedCategory}
        </h1>
        <p className="mt-3 text-base text-[#a1a1aa] max-w-[640px] mx-auto">
          Compare {total.toLocaleString()}+ {matchedCategory.toLowerCase()}. Find the best free and paid {matchedCategory.toLowerCase()} with reviews, features, and pricing. Updated daily on MarkBook AI.
        </p>
        <div className="flex justify-center gap-8 mt-6 flex-wrap">
          <div><div className="text-2xl font-extrabold">{total.toLocaleString()}+</div><div className="text-xs text-[#71717a] uppercase tracking-wider mt-1">Tools</div></div>
          <div><div className="text-2xl font-extrabold">Free</div><div className="text-xs text-[#71717a] uppercase tracking-wider mt-1">Available</div></div>
          <div><div className="text-2xl font-extrabold">Daily</div><div className="text-xs text-[#71717a] uppercase tracking-wider mt-1">Updated</div></div>
        </div>
        <form action="/" className="mt-8 max-w-[480px] mx-auto">
          <input
            type="text"
            placeholder={`Search ${matchedCategory.toLowerCase()}...`}
            name="q"
            className="w-full rounded-xl border border-[#27272a] bg-[#18181b] px-5 py-3.5 text-white outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </form>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <h2 className="text-xl font-bold mb-1">All {matchedCategory}</h2>
        <p className="text-sm text-[#a1a1aa] mb-6">Showing {tools.length.toLocaleString()} of {total.toLocaleString()} tools — scroll down to load more</p>

        {loading ? (
          <div className="text-center py-20 text-[#a1a1aa]">Loading tools...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <article key={tool.n} className="rounded-xl border border-[#27272a] bg-[#111113] overflow-hidden transition-colors hover:border-[#6366f1]">
                <div className="flex gap-3.5 p-4">
                  <div className={`w-11 h-11 min-w-[44px] rounded-[10px] grid place-items-center text-[11px] font-bold text-white bg-gradient-to-br ${colorForName(tool.n)}`}>
                    {initials(tool.n)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate">{tool.n}</h3>
                    <span className="text-[11px] text-[#71717a]">{tool.c}</span>
                    <p className="text-[13px] text-[#a1a1aa] mt-1.5 line-clamp-2">{tool.d}</p>
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{
                          color: isFreePrice(tool.p) ? "#34d399" : "#fbbf24",
                          background: isFreePrice(tool.p) ? "rgba(16,185,129,0.1)" : "rgba(251,191,36,0.1)",
                        }}
                      >
                        {PRICING_LABEL[tool.p] || tool.p}
                      </span>
                      {tool.u && tool.u !== "#" && (
                        <a href={tool.u} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#6366f1] hover:text-[#818cf8]">
                          Visit ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {offset < total && (
          <div ref={loaderRef} className="text-center py-10">
            {loadingMore && (
              <div className="text-sm text-[#a1a1aa]">
                Loading {Math.min(PAGE_SIZE, total - offset)} more tools... ({tools.length.toLocaleString()} / {total.toLocaleString()})
              </div>
            )}
          </div>
        )}

        {offset >= total && tools.length > 0 && (
          <div className="text-center py-8 text-sm text-[#71717a]">
            ✅ All {total.toLocaleString()} {matchedCategory.toLowerCase()} loaded!
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="mx-auto max-w-[1200px] px-5 py-10 border-t border-[#27272a]">
        <h2 className="text-xl font-bold mb-2">Related Categories</h2>
        <p className="text-sm text-[#a1a1aa] mb-6">Explore more AI tools</p>
        <div className="flex flex-wrap gap-2">
          {relatedCats.map(([name, count]) => (
            <Link
              key={name}
              to="/category/$slug"
              params={{ slug: slugify(name) }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#27272a] bg-[#111113] text-[13px] text-[#a1a1aa] transition-all hover:border-[#6366f1] hover:text-white hover:bg-[#6366f1]/10"
            >
              {emojis[name] || "🤖"} {name.replace("Free ", "")} <span className="text-[11px] text-[#71717a]">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="mx-auto max-w-[1200px] px-5 py-10 border-t border-[#27272a]">
        <h2 className="text-xl font-bold mb-4">About {matchedCategory} on MarkBook</h2>
        <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">
          MarkBook is the most comprehensive AI tools directory on the internet, featuring {total.toLocaleString()}+ {matchedCategory.toLowerCase()}. Whether you are looking for free {matchedCategory.toLowerCase()}, paid options, or the latest {matchedCategory.toLowerCase()} released in 2025, our curated directory helps you discover, compare, and choose the right AI tool.
        </p>
        <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">
          Each tool in our {matchedCategory} directory has been verified for quality with direct links to official websites. We update our {matchedCategory.toLowerCase()} listings daily to ensure you always have access to the newest and most relevant AI tools.
        </p>
        <p className="text-sm text-[#a1a1aa] leading-relaxed">
          Looking for the best {matchedCategory.toLowerCase()}? MarkBook includes tools for every use case, from beginners to professionals. Filter by pricing and find exactly what you need.
        </p>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-[1200px] px-5 py-12 border-t border-[#27272a] text-center">
        <h2 className="text-2xl font-bold mb-2">Explore 56,000+ AI Tools</h2>
        <p className="text-[#a1a1aa] mb-5">Discover the full MarkBook AI tools directory</p>
        <Link
          to="/"
          className="inline-block px-7 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
        >
          Browse All AI Tools →
        </Link>
      </div>
    </div>
  );
}
