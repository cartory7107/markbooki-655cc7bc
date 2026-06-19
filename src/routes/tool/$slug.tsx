import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCatalog, getCategoryEmojis, type Tool } from "@/lib/catalog-server";

/**
 * Individual tool SEO pages — NOT linked from nav, but indexable by search engines.
 * URL: /tool/slug (e.g. /tool/chatgpt-free, /tool/google-gemini)
 *
 * Pure server-rendered HTML for maximum SEO. Each page has:
 *   - Unique title with tool name + category + "MarkBook"
 *   - Meta description with tool details
 *   - Keywords for the specific tool
 *   - JSON-LD SoftwareApplication structured data
 *   - Related tools from the same category
 *   - SEO content paragraphs
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
];

function colorForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

export const Route = createFileRoute("/tool/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { slug } = params;
        const catalog = getCatalog();
        const emojis = getCategoryEmojis();

        // Find tool by slug
        let tool: Tool | null = null;
        for (const t of catalog.tools) {
          if (slugify(t.n) === slug) { tool = t; break; }
        }
        if (!tool) return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });

        // Find related tools
        const related = catalog.tools
          .filter(t => (t.c === tool!.c || t.g === tool!.g) && t.n !== tool!.n)
          .slice(0, 12);

        const emoji = emojis[tool.c] || "🤖";
        const title = `${tool.n} — ${tool.c} | Free & Paid Options | MarkBook AI Directory`;
        const desc = `${tool.n}: ${tool.d}. ${tool.p === "Free" || tool.p === "Free Plan" ? "Free" : tool.p} ${tool.c.toLowerCase()} on MarkBook. Compare features and find alternatives.`;
        const keywords = `${tool.n}, ${tool.n} review, ${tool.n} alternative, ${tool.n} free, ${tool.c}, best ${tool.c.toLowerCase()}, ${tool.c.toLowerCase()} tools, AI tools directory, MarkBook`;

        const jsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.n,
          description: tool.d,
          applicationCategory: tool.c,
          genre: tool.g,
          url: tool.u,
          offers: {
            "@type": "Offer",
            price: (tool.p === "Free" || tool.p === "Free Plan" || tool.p === "Free Trial" || tool.p === "Free Credits" || tool.p === "Daily Free" || tool.p === "Monthly Free") ? "0" : "1",
            priceCurrency: "USD",
            priceSpecification: tool.p,
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", ratingCount: "100" },
        });

        const relatedHtml = related.map(t => {
          const tSlug = slugify(t.n);
          return `<a href="/tool/${tSlug}" class="rt"><span class="ri ${colorForName(t.n)}">${initials(t.n)}</span><div><b>${t.n}</b><span>${t.c}</span></div></a>`;
        }).join("\n");

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
<meta property="og:url" content="https://markbookai.com/tool/${slug}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://markbookai.com/tool/${slug}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<script type="application/ld+json">${jsonLd}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,system-ui,sans-serif;background:#09090b;color:#fafafa;line-height:1.6}
a{color:#6366f1;text-decoration:none}a:hover{color:#818cf8}
.c{max-width:900px;margin:0 auto;padding:0 20px}
.bb{padding:16px 0;font-size:13px;color:#a1a1aa}.bb a{color:#a1a1aa}.bb a:hover{color:#fff}
.hero{padding:40px 0 32px;text-align:center;border-bottom:1px solid #27272a}
.hero .icon{width:72px;height:72px;border-radius:16px;display:inline-grid;place-items:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:16px}
.hero h1{font-size:clamp(22px,4vw,36px);font-weight:900;margin-bottom:8px}
.hero .cat{font-size:14px;color:#a1a1aa}.hero .cat a{color:#6366f1}
.hero .desc{font-size:16px;color:#a1a1aa;max-width:600px;margin:16px auto 0}
.info{display:flex;justify-content:center;gap:16px;margin-top:24px;flex-wrap:wrap}
.info span{padding:6px 14px;border-radius:20px;font-size:13px;border:1px solid #27272a;color:#a1a1aa}
.info .free{color:#34d399;border-color:rgba(16,185,129,.2);background:rgba(16,185,129,.05)}
.info .paid{color:#fbbf24;border-color:rgba(251,191,36,.2);background:rgba(251,191,36,.05)}
.btn{display:inline-block;margin-top:24px;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-weight:600;font-size:14px}.btn:hover{opacity:.9}
.sec{padding:40px 0;border-top:1px solid #27272a}.sec h2{font-size:20px;font-weight:700;margin-bottom:16px}
.seo p{font-size:14px;color:#a1a1aa;line-height:1.8;margin-bottom:12px}
.rg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:20px}
.rt{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;border:1px solid #27272a;background:#111113;transition:border-color .2s}.rt:hover{border-color:#6366f1}
.ri{width:36px;height:36px;min-width:36px;border-radius:8px;display:grid;place-items:center;font-size:10px;font-weight:700;color:#fff}
.rt div{min-width:0;flex:1}.rt b{display:block;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rt span{font-size:11px;color:#71717a}
.cta{text-align:center;padding:48px 0;border-top:1px solid #27272a}.cta h2{font-size:22px;font-weight:700;margin-bottom:8px}.cta p{color:#a1a1aa;margin-bottom:20px}.cta a{display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-weight:600;font-size:14px}
</style>
</head>
<body>
<div class="c">
  <div class="bb"><a href="/">Home</a> &rsaquo; <a href="/">AI Tools</a> &rsaquo; <a href="/category/${slugify(tool.c)}">${tool.c}</a> &rsaquo; ${tool.n}</div>
  <div class="hero">
    <div class="icon ${colorForName(tool.n)}">${initials(tool.n)}</div>
    <h1>${tool.n}</h1>
    <p class="cat">${emoji} <a href="/category/${slugify(tool.c)}">${tool.c}</a>${tool.g && tool.g !== tool.c ? ` / ${tool.g}` : ""}</p>
    <p class="desc">${tool.d}</p>
    <div class="info">
      <span class="${(tool.p === "Free" || tool.p === "Free Plan" || tool.p === "Free Trial" || tool.p === "Free Credits" || tool.p === "Daily Free" || tool.p === "Monthly Free") ? "free" : "paid"}">${tool.p}</span>
    </div>
    ${tool.u && tool.u !== "#" ? `<a href="${tool.u}" target="_blank" rel="noopener" class="btn">Visit ${tool.n} \u2192</a>` : ""}
  </div>
  <div class="sec seo">
    <h2>About ${tool.n}</h2>
    <p>${tool.n} is a ${tool.c.toLowerCase()} tool that ${tool.d.toLowerCase().replace(/\.$/, "")}. Available as ${tool.p.toLowerCase()}, it is listed in the MarkBook AI tools directory alongside ${tool.c.toLowerCase()} from top providers.</p>
    <p>Looking for ${tool.n} alternatives or similar ${tool.c.toLowerCase()}? MarkBook helps you compare features, pricing, and reviews across thousands of AI tools. Find the best ${tool.c.toLowerCase()} for your specific needs.</p>
  </div>
  <div class="sec">
    <h2>Related ${tool.c} Tools</h2>
    <div class="rg">${relatedHtml}</div>
  </div>
  <div class="cta"><h2>Explore 16,000+ AI Tools</h2><p>Discover the full MarkBook AI directory</p><a href="/">Browse All AI Tools \u2192</a></div>
</div>
</body></html>`, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=86400, s-maxage=3600" },
        });
      },
    },
  },
});
