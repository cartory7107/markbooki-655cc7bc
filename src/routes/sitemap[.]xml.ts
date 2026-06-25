import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCatalog } from "@/lib/catalog-server";

/**
 * Comprehensive SEO sitemap — auto-generates entries for:
 *   - Homepage, Ranking, Submit, Advertise
 *   - Every AI category as a dedicated landing page (/category/slug)
 *   - Top 500 most popular tools as individual tool pages (/tool/slug)
 *
 * This creates 600+ indexable URLs for search engines to crawl.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const catalog = getCatalog();
        const BASE_URL = "https://markbook.top";
        const now = new Date().toISOString().split("T")[0];

        const urls: string[] = [];

        // ── Static pages ──
        const staticPages = [
          { path: "/", priority: "1.0", freq: "daily" },
          { path: "/ranking", priority: "0.9", freq: "weekly" },
          { path: "/submit", priority: "0.7", freq: "monthly" },
          { path: "/advertise", priority: "0.5", freq: "monthly" },
          { path: "/tools-dictionary.json", priority: "0.8", freq: "weekly" },
        ];
        for (const p of staticPages) {
          urls.push(`  <url>\n    <loc>${BASE_URL}${p.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`);
        }

        // ── Category landing pages (hidden from nav but indexable) ──
        const categories = Object.entries(catalog.categories).sort((a, b) => b[1] - a[1]);
        for (const [name] of categories) {
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          urls.push(`  <url>\n    <loc>${BASE_URL}/category/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
        }

        // ── Individual tool pages (ALL unique tools) ──
        const seenTools = new Set<string>();
        let toolCount = 0;
        for (const tool of catalog.tools) {
          if (seenTools.has(tool.n)) continue;
          seenTools.add(tool.n);
          toolCount++;
          const slug = tool.n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          urls.push(`  <url>\n    <loc>${BASE_URL}/tool/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
