import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getVerifiedPool, getCatalog } from "@/lib/catalog-server";

/**
 * Returns 50 exclusive/verified AI tools for the homepage bottom section.
 * Usage: GET /exclusive-api.json
 */
export const Route = createFileRoute("/exclusive-api.json")({
  ssr: false,
  server: {
    handlers: {
      GET: async () => {
        const verifiedPool = getVerifiedPool();
        const catalog = getCatalog();

        // Take first 50 from verified pool (they're already curated)
        const exclusives = verifiedPool.slice(0, 50).map((v) => {
          // Enrich with full description from catalog if available
          const full = catalog.tools.find((t) => t.n === v.n);
          return {
            n: v.n,
            d: full?.d || v.d,
            c: v.c,
            g: v.g,
            p: v.p,
            u: v.u,
            fl: v.fl,
          };
        });

        return new Response(JSON.stringify({ exclusives }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300, s-maxage=3600",
          },
        });
      },
    },
  },
});