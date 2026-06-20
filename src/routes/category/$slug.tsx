import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCatalog, getCategoryEmojis, type Tool } from "@/lib/catalog-server";

/**
 * Dynamic category landing pages — NOT linked from nav, but indexable by search engines.
 * URL: /category/slug (e.g. /category/ai-image-generator, /category/ai-chatbot)
 *
 * These pages are pure server-rendered HTML (no JS hydration needed)
 * and are packed with SEO keywords, structured data, and indexable content.
 * They appear in the sitemap.xml for crawlers but are hidden from users.
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
  Paid: "Paid", "Paid Plans": "Paid Plans",
};

export const Route = createFileRoute("/category/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { slug } = params;
        const catalog = getCatalog();
        const emojis = getCategoryEmojis();

        // Find matching category by slug
        let matchedCategory: string | null = null;
        let categoryTools: Tool[] = [];
        for (const [name] of Object.entries(catalog.categories)) {
          if (slugify(name) === slug) {
            matchedCategory = name;
            categoryTools = catalog.tools.filter(t => t.c === name || t.g === name).slice(0, 100);
            break;
          }
        }

        if (!matchedCategory) {
          return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
        }

        const emoji = emojis[matchedCategory] || "🤖";
        const title = `Best ${matchedCategory} \u2014 ${categoryTools.length}+ Tools Compared | MarkBook AI Directory`;
        const desc = `Compare ${categoryTools.length}+ ${matchedCategory.toLowerCase()}. Find the best free and paid ${matchedCategory.toLowerCase()} with reviews, features, and pricing. Updated daily on MarkBook AI.`;
        const keywords = `${matchedCategory}, best ${matchedCategory.toLowerCase()}, free ${matchedCategory.toLowerCase()}, top ${matchedCategory.toLowerCase()}, ${matchedCategory.toLowerCase()} comparison, ${matchedCategory.toLowerCase()} reviews, ${matchedCategory.toLowerCase()} alternatives, AI tools directory, MarkBook`;

        // Related categories
        const relatedCats = Object.entries(catalog.categories)
          .filter(([n]) => n !== matchedCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);

        const toolsHtml = categoryTools.map((tool) => {
          const pricingClass = (tool.p === "Free" || tool.p === "Free Plan" || tool.p === "Free Trial" || tool.p === "Free Credits" || tool.p === "Daily Free" || tool.p === "Monthly Free") ? "color:#34d399" : "color:#fbbf24";
          return `<article class="tc">
            <div class="tc-icon ${colorForName(tool.n)}">${initials(tool.n)}</div>
            <div class="tc-info">
              <h3>${tool.n}</h3>
              <span class="tc-cat">${tool.c}</span>
              <p>${tool.d}</p>
              <div class="tc-meta">
                <span class="tc-price" style="${pricingClass}">${PRICING_LABEL[tool.p] || tool.p}</span>
                ${tool.u && tool.u !== "#" ? `<a href="${tool.u}" rel="noopener">Visit \u2197</a>` : ""}
              </div>
            </div>
          </article>`;
        }).join("\n");

        const relatedHtml = relatedCats.map(([name, count]) => {
          const catEmoji = emojis[name] || "🤖";
          const catSlug = slugify(name);
          return `<a href="/category/${catSlug}" class="rt">${catEmoji} ${name.replace("Free ", "")} <span>${count}</span></a>`;
        }).join("\n");

        // JSON-LD
        const jsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description: desc,
          url: `https://markbook.cartory.top/category/${slug}`,
          isPartOf: { "@type": "WebSite", name: "MarkBook AI", url: "https://markbook.cartory.top" },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: categoryTools.length,
            itemListElement: categoryTools.slice(0, 20).map((tool, i) => ({
              "@type": "ListItem", position: i + 1,
              item: { "@type": "SoftwareApplication", name: tool.n, description: tool.d, applicationCategory: tool.c, url: tool.u },
            })),
          },
        });

        const kws = keywords.split(",").map(k => k.trim()).filter(Boolean)
          .map(k => `<meta name="keywords" content="${k}">`).join("\n  ");

        return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow">
${kws}
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://markbook.cartory.top/category/${slug}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://markbook.cartory.top/category/${slug}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<script type="application/ld+json">${jsonLd}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,system-ui,-apple-system,sans-serif;background:#09090b;color:#fafafa;line-height:1.6}
a{color:#6366f1;text-decoration:none}a:hover{color:#818cf8}
.c{max-width:1200px;margin:0 auto;padding:0 20px}
.bb{padding:16px 0;font-size:13px;color:#a1a1aa}.bb a{color:#a1a1aa}.bb a:hover{color:#fff}
.hero{text-align:center;padding:48px 0 32px;border-bottom:1px solid #27272a}
.hero h1{font-size:clamp(24px,4vw,42px);font-weight:900;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.hero p{font-size:16px;color:#a1a1aa;max-width:640px;margin:0 auto 24px}
.sts{display:flex;justify-content:center;gap:32px;margin-top:24px;flex-wrap:wrap}
.st .v{font-size:28px;font-weight:800}.st .l{font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.sb{max-width:480px;margin:32px auto 0}.sb input{width:100%;padding:14px 20px;border-radius:12px;border:1px solid #27272a;background:#18181b;color:#fff;font-size:15px;outline:none}.sb input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
.sec{padding:40px 0}.sec h2{font-size:22px;font-weight:700;margin-bottom:8px}.sec .sub{font-size:14px;color:#a1a1aa;margin-bottom:24px}
.tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
.tc{border:1px solid #27272a;border-radius:14px;background:#111113;overflow:hidden;transition:border-color .2s}.tc:hover{border-color:#6366f1}
.tc-inner{display:flex;gap:14px;padding:18px}
.tc-icon{width:44px;height:44px;min-width:44px;border-radius:10px;display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff}
.tc-info{min-width:0;flex:1}.tc-info h3{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tc-cat{font-size:11px;color:#71717a;margin-top:2px}.tc-info p{font-size:13px;color:#a1a1aa;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tc-meta{display:flex;align-items:center;gap:10px;margin-top:10px}.tc-price{font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(16,185,129,.1)}.tc-meta a{font-size:12px;font-weight:500}
.rts{display:flex;flex-wrap:wrap;gap:8px}.rt{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;border:1px solid #27272a;background:#111113;font-size:13px;color:#a1a1aa;transition:all .2s}.rt:hover{border-color:#6366f1;color:#fff;background:rgba(99,102,241,.08)}.rt span{font-size:11px;color:#71717a}
.seo{padding:40px 0;border-top:1px solid #27272a}.seo h2{font-size:20px;font-weight:700;margin-bottom:16px}.seo p{font-size:14px;color:#a1a1aa;line-height:1.8;margin-bottom:12px}
.cta{text-align:center;padding:48px 0;border-top:1px solid #27272a;margin-top:40px}.cta h2{font-size:24px;font-weight:700;margin-bottom:8px}.cta p{color:#a1a1aa;margin-bottom:20px}.cta a{display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-weight:600;font-size:14px}.cta a:hover{opacity:.9}
@media(max-width:640px){.tg{grid-template-columns:1fr}.sts{gap:20px}}
</style>
</head>
<body>
<div class="c">
  <div class="bb"><a href="/">Home</a> &rsaquo; <a href="/">AI Tools</a> &rsaquo; ${matchedCategory}</div>
  <div class="hero">
    <h1>${emoji} ${matchedCategory}</h1>
    <p>${desc}</p>
    <div class="sts"><div class="st"><div class="v">${categoryTools.length}+</div><div class="l">Tools</div></div><div class="st"><div class="v">Free</div><div class="l">Available</div></div><div class="st"><div class="v">Daily</div><div class="l">Updated</div></div></div>
    <div class="sb"><form action="/"><input type="text" placeholder="Search ${matchedCategory.toLowerCase()}..." name="q"></form></div>
  </div>
  <div class="sec"><h2>Top ${matchedCategory}</h2><p class="sub">Browse ${categoryTools.length}+ ${matchedCategory.toLowerCase()} tools</p><div class="tg">${toolsHtml}</div></div>
  <div class="sec"><h2>Related Categories</h2><p class="sub">Explore more AI tools</p><div class="rts">${relatedHtml}</div></div>
  <div class="seo">
    <h2>About ${matchedCategory} on MarkBook</h2>
    <p>MarkBook is the most comprehensive AI tools directory on the internet, featuring ${categoryTools.length}+ ${matchedCategory.toLowerCase()}. Whether you are looking for free ${matchedCategory.toLowerCase()}, paid options, or the latest ${matchedCategory.toLowerCase()} released in 2025, our curated directory helps you discover, compare, and choose the right AI tool.</p>
    <p>Each tool in our ${matchedCategory} directory has been verified for quality with direct links to official websites. We update our ${matchedCategory.toLowerCase()} listings daily to ensure you always have access to the newest and most relevant AI tools.</p>
    <p>Looking for the best ${matchedCategory.toLowerCase()}? MarkBook includes tools for every use case, from beginners to professionals. Filter by pricing and find exactly what you need.</p>
  </div>
  <div class="cta"><h2>Explore 56,000+ AI Tools</h2><p>Discover the full MarkBook AI tools directory</p><a href="/">Browse All AI Tools \u2192</a></div>
</div>
</body></html>`, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=86400, s-maxage=3600" },
        });
      },
    },
  },
});
