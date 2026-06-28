import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getToolBySlug, slugify, getCatalog, getCategoryEmojis, normalizeCategory } from "@/lib/catalog-server";

/**
 * Lightweight tool detail API.
 * Usage: GET /tool-api.json?slug=chatgpt-free
 * Returns tool data + 8 related tools + category count.
 */
export const Route = createFileRoute("/tool-api.json")({
  ssr: false,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug") || "";
        if (!slug) return new Response(JSON.stringify({ error: "missing slug" }), { status: 400, headers: { "Content-Type": "application/json" } });

        const catalog = getCatalog();
        const emojis = getCategoryEmojis();

        let tool: typeof catalog.tools[0] | null = null;
        for (const t of catalog.tools) {
          if (slugify(t.n) === slug) { tool = t; break; }
        }
        if (!tool) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

        const normCat = normalizeCategory(tool.c);
        const emoji = emojis[normCat] || "🤖";
        const related = catalog.tools
          .filter(t => (normalizeCategory(t.c) === normCat || t.g === tool.g) && t.n !== tool.n)
          .slice(0, 8)
          .map(t => ({ n: t.n, normCat: normalizeCategory(t.c), emoji: emojis[normalizeCategory(t.c)] || "🤖" }));
        const sameCategoryCount = catalog.tools.filter(t => normalizeCategory(t.c) === normCat).length;

        return new Response(JSON.stringify({
          tool: { n: tool.n, d: tool.d, c: tool.c, g: tool.g, p: tool.p, u: tool.u },
          normCat, emoji, related, sameCategoryCount, totalTools: catalog.tools.length,
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=86400, s-maxage=3600" },
        });
      },
    },
  },
});