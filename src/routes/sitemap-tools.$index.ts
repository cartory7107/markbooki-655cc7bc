import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCatalog, slugify } from "@/lib/catalog-server";

const BASE_URL = "https://markbook.top";
const TOOLS_PER_SITEMAP = 50000;

/**
 * Paginated tool sitemap. Handles one chunk of individual tool pages so each
 * file stays under search-engine limits (max 50,000 URLs per sitemap).
 *
 * Route: /sitemap-tools/{index}
 */
export const Route = createFileRoute("/sitemap-tools/$index")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const index = parseInt(params.index, 10);
        if (Number.isNaN(index) || index < 0) {
          return new Response("Invalid sitemap index", { status: 400 });
        }

        const catalog = getCatalog();
        const now = new Date().toISOString().split("T")[0];

        // Build the full deduplicated slug list once.
        const seenSlugs = new Set<string>();
        const slugs: string[] = [];
        for (const tool of catalog.tools) {
          const slug = slugify(tool.n);
          if (!slug) continue; // skip names that produce empty slugs (e.g. only symbols)
          if (seenSlugs.has(slug)) continue; // skip duplicate URLs
          seenSlugs.add(slug);
          slugs.push(slug);
        }

        const start = index * TOOLS_PER_SITEMAP;
        if (start >= slugs.length) {
          return new Response("Sitemap not found", { status: 404 });
        }

        const pageSlugs = slugs.slice(start, start + TOOLS_PER_SITEMAP);

        const urls = pageSlugs.map(
          (slug) =>
            `  <url>\n    <loc>${BASE_URL}/tool/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
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
