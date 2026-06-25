/**
 * Server-side catalog loader.
 * JSON data is bundled at build time via Vite imports so it works on
 * Cloudflare Workers (no filesystem access at runtime).
 */
import catalogJson from "../../public/ai-catalog.json";
import verifiedPoolJson from "../../public/verified-top-pool.json";
import categoryEmojisJson from "../../public/category-emojis.json";

export type Tool = {
  n: string;
  d: string;
  c: string;
  g: string;
  p: string;
  u: string;
  fl?: string;
};

export type VerifiedTool = { n: string; d: string; c: string; g: string; p: string; u: string; fl?: string };

type CatalogData = {
  tools: Tool[];
  categories: Record<string, number>;
};

export function getCatalog(): CatalogData {
  return catalogJson as unknown as CatalogData;
}

export function getVerifiedPool(): VerifiedTool[] {
  return verifiedPoolJson as unknown as VerifiedTool[];
}

export function getCategoryEmojis(): Record<string, string> {
  return categoryEmojisJson as unknown as Record<string, string>;
}

/** Fisher-Yates shuffle — returns a NEW array. */
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Returns the "homepage bundle": top 20 shuffled verified tools + all categories + emojis + total count.
 * This response is ~10-15 KB instead of 11 MB.
 */
export function getTopToolsBundle() {
  const catalog = getCatalog();
  const emojis = getCategoryEmojis();
  const verifiedPool = getVerifiedPool();

  const tools = catalog.tools;

  let top20: Tool[] = [];
  let gems: Tool[] = [];

  if (verifiedPool.length > 0 && tools.length > 0) {
    const verifiedNames = new Set(verifiedPool.map((v) => v.n));
    const shuffledPool = shuffle(verifiedPool).slice(0, 20) as Tool[];
    const restTools = tools.filter((t) => !verifiedNames.has(t.n));
    top20 = shuffledPool;
    // Hidden gems — pick 3 from random positions
    gems = restTools.filter((_, i) => i % 97 === 0).slice(0, 3);
  } else if (tools.length > 0) {
    top20 = shuffle(tools).slice(0, 20);
    gems = tools.filter((_, i) => i % 97 === 0).slice(0, 3);
  }

  return {
    topTools: top20,
    categories: catalog.categories,
    categoryEmojis: emojis,
    totalTools: tools.length,
    gems,
  };
}

/**
 * Generates organic-looking exclusive insertion positions.
 * Returns a Set of indices where exclusives should be placed.
 * Pattern: roughly every 3-6 tools (avg ~4), with variation to look human-curated.
 */
function generateExclusivePositions(totalSlots: number, seed: number): Set<number> {
  const positions = new Set<number>();
  let pos = 2 + (seed % 3); // Start at position 2-4
  while (pos < totalSlots) {
    positions.add(pos);
    // Vary gap: 3, 4, 5, or 6 — uses simple hash-like variation
    const gap = 3 + (((pos * 7 + seed * 13) % 4));
    pos += gap;
  }
  return positions;
}

/**
 * Server-side search & filter with relevance scoring, pagination,
 * and organic exclusive tool injection.
 */
export function searchTools(opts: {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}) {
  const { q = "", category = "All", pricing = "All", sort = "", offset = 0, limit = 50 } = opts;
  const catalog = getCatalog();
  const exclusivePool = getVerifiedPool();

  const term = q.trim().toLowerCase();

  const FREE_PRICINGS = new Set(["Free", "Free Plan", "Free Trial", "Free Credits", "Daily Free", "Monthly Free", "Open Source", "open_source", "freemium"]);
  const PAID_PRICINGS = new Set(["Paid", "Paid Plans", "paid"]);

  function isFree(p: string) { return FREE_PRICINGS.has(p); }
  function isPaid(p: string) { return PAID_PRICINGS.has(p); }
  function matchPricing(p: string) {
    if (pricing === "All") return true;
    if (pricing === "Free") return isFree(p);
    if (pricing === "Paid") return isPaid(p);
    return p === pricing;
  }

  // Build a Set of exclusive names for O(1) lookup
  const exclusiveNames = new Set(exclusivePool.map((e) => e.n.toLowerCase()));
  // Build category-matched exclusive pool for contextual injection
  const categoryExclusives = category !== "All"
    ? exclusivePool.filter((e) => e.c === category || e.g === category)
    : exclusivePool;
  // Shuffle exclusives deterministically by offset so pagination is stable
  const seededShuffle = (arr: typeof exclusivePool, seed: number) => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.abs((seed * 31 + i * 17) % (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const shuffledExclusives = seededShuffle(categoryExclusives, offset);
  let exclusiveIndex = 0;

  let filtered = catalog.tools.filter(
    (tool) =>
      (!term || `${tool.n} ${tool.d} ${tool.c} ${tool.g}`.toLowerCase().includes(term)) &&
      matchPricing(tool.p) &&
      (category === "All" || tool.c === category || tool.g === category),
  );

  // Relevance scoring (same algorithm as client-side)
  if (term && filtered.length > 1) {
    const score = (name: string) => {
      const n = name.toLowerCase();
      if (n === term) return 0;
      if (n.startsWith(term)) return 1;
      const words = n.split(/[\s\-_.]+/);
      if (words[words.length - 1] === term) return 2;
      if (words.some((w) => w === term)) return 3;
      if (n.includes(term)) return 4;
      return 9;
    };
    filtered = filtered.slice().sort((a, b) => {
      const aScore = score(a.n.toLowerCase());
      const bScore = score(b.n.toLowerCase());
      if (aScore !== bScore) return aScore - bScore;
      return a.n.length - b.n.length;
    });
  } else if (!term && filtered.length > 1) {
    // When browsing/filtering without search query: sort by requested mode
    if (sort === "popular") {
      filtered = filtered.slice().sort((a, b) => {
        let ha = 0, hb = 0;
        for (let i = 0; i < a.n.length; i++) ha = a.n.charCodeAt(i) + ((ha << 5) - ha);
        for (let i = 0; i < b.n.length; i++) hb = b.n.charCodeAt(i) + ((hb << 5) - hb);
        return ha - hb;
      });
    } else if (sort === "new") {
      filtered = filtered.slice().reverse();
    } else {
      filtered = filtered.slice().sort((a, b) => {
        const aFree = isFree(a.p) ? 0 : 1;
        const bFree = isFree(b.p) ? 0 : 1;
        if (aFree !== bFree) return aFree - bFree;
        return 0;
      });
    }
  }

  const total = filtered.length;

  // Get the page of results
  let results = filtered.slice(offset, offset + limit);

  // Inject exclusive tools every ~4th position (organic spacing)
  // Only when browsing (no search query) and not on specific category filter
  if (!term && results.length > 8) {
    const positions = generateExclusivePositions(results.length, offset);
    const injected: typeof results = [];
    const resultNames = new Set(results.map((r) => r.n.toLowerCase()));

    for (let i = 0; i < results.length; i++) {
      // Check if an exclusive should be inserted before this position
      if (positions.has(i)) {
        // Find next exclusive that's not already in results
        let inserted = false;
        let attempts = 0;
        while (exclusiveIndex < shuffledExclusives.length && attempts < 20) {
          const ex = shuffledExclusives[exclusiveIndex];
          exclusiveIndex++;
          attempts++;
          if (!resultNames.has(ex.n.toLowerCase()) && matchPricing(ex.p)) {
            injected.push(ex as (typeof results)[0]);
            inserted = true;
            break;
          }
        }
        // If no exclusive found, just skip this position
      }
      injected.push(results[i]);
    }
    results = injected;
  }

  return { results, total };
}
