/**
 * Server-side catalog loader & cache.
 * Reads the 11 MB ai-catalog.json from disk ONCE and keeps it in memory.
 * Every subsequent request serves from the in-memory cache — zero disk I/O.
 */
import { readFileSync } from "fs";
import { join } from "path";

export type Tool = {
  n: string;
  d: string;
  c: string;
  g: string;
  p: "Free" | "Free Plan" | "Free Trial" | "Free Credits" | "Daily Free" | "Monthly Free" | "Paid" | "Paid Plans";
  u: string;
  fl?: string;
};

export type VerifiedTool = { n: string; d: string; c: string; g: string; p: string; u: string; fl?: string };

type CatalogData = {
  tools: Tool[];
  categories: Record<string, number>;
};

// ── In-memory cache ( survives for the lifetime of the server process ) ──
let _catalog: CatalogData | null = null;
let _verifiedPool: VerifiedTool[] | null = null;
let _categoryEmojis: Record<string, string> | null = null;

function loadJSON<T>(filename: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), "public", filename), "utf-8")) as T;
}

export function getCatalog(): CatalogData {
  if (!_catalog) _catalog = loadJSON<CatalogData>("ai-catalog.json");
  return _catalog;
}

export function getVerifiedPool(): VerifiedTool[] {
  if (!_verifiedPool) {
    try { _verifiedPool = loadJSON<VerifiedTool[]>("verified-top-pool.json"); } catch { _verifiedPool = []; }
  }
  return _verifiedPool;
}

export function getCategoryEmojis(): Record<string, string> {
  if (!_categoryEmojis) {
    try { _categoryEmojis = loadJSON<Record<string, string>>("category-emojis.json"); } catch { _categoryEmojis = {}; }
  }
  return _categoryEmojis;
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
 * Server-side search & filter with relevance scoring and pagination.
 */
export function searchTools(opts: {
  q?: string;
  category?: string;
  pricing?: string;
  offset?: number;
  limit?: number;
}) {
  const { q = "", category = "All", pricing = "All", offset = 0, limit = 20 } = opts;
  const catalog = getCatalog();

  const term = q.trim().toLowerCase();

  let filtered = catalog.tools.filter(
    (tool) =>
      (!term || `${tool.n} ${tool.d} ${tool.c} ${tool.g}`.toLowerCase().includes(term)) &&
      (pricing === "All" || tool.p === pricing) &&
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
  }

  const total = filtered.length;
  const results = filtered.slice(offset, offset + limit);

  return { results, total };
}
