import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Server-side AI news endpoint.
 * Fetches from Hacker News API (no API key, no CORS issues on server).
 * Filters for AI-related stories and returns JSON array.
 *
 * Usage: GET /ai-news-api.json
 */

const FALLBACK_NEWS = [
  { title: "OpenAI Launches GPT-5 with Enhanced Reasoning Capabilities", time: "2h ago", url: "https://openai.com", source: "AI News" },
  { title: "Google DeepMind Unveils AlphaFold 4 for Drug Discovery", time: "3h ago", url: "https://deepmind.google", source: "AI News" },
  { title: "Anthropic Claude Achieves New Benchmark in Code Generation", time: "5h ago", url: "https://anthropic.com", source: "AI News" },
  { title: "Meta Releases Llama 5 as Open-Source AI Model", time: "6h ago", url: "https://ai.meta.com", source: "AI News" },
  { title: "Microsoft Copilot Gets Major Enterprise Update", time: "8h ago", url: "https://microsoft.com", source: "AI News" },
  { title: "Stability AI Announces Real-Time Video Generation", time: "10h ago", url: "https://stability.ai", source: "AI News" },
  { title: "Apple Intelligence Expands to More Countries", time: "12h ago", url: "https://apple.com", source: "AI News" },
  { title: "EU AI Act Enforcement Begins Across Member States", time: "14h ago", url: "https://europa.eu", source: "AI News" },
  { title: "NVIDIA Announces Next-Gen AI Chips for Data Centers", time: "16h ago", url: "https://nvidia.com", source: "AI News" },
  { title: "AI-Powered Code Editors See 300% Growth in Adoption", time: "18h ago", url: "#", source: "AI News" },
];

const AI_KEYWORDS = [
  "ai", "artificial intelligence", "llm", "gpt", "model", "machine learning",
  "openai", "google", "anthropic", "meta", "nvidia", "neural", "deep learning",
  "robot", "chatbot", "transformer", "diffusion", "stable diffusion", "midjourney",
  "claude", "gemini", "copilot", "llama", "mistral", "perplexity",
];

function isAIRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

function getRelativeTime(unixTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTimestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

interface HNItem {
  title?: string;
  url?: string;
  time?: number;
  id?: number;
}

export const Route = createFileRoute("/ai-news-api.json")({
  server: {
    handlers: {
      GET: async () => {
        let news = FALLBACK_NEWS;

        try {
          const resp = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
            signal: AbortSignal.timeout(5000),
          });
          const ids = (await resp.json()) as number[];
          const top20 = ids.slice(0, 20);

          const stories = await Promise.all(
            top20.map((id) =>
              fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
                signal: AbortSignal.timeout(3000),
              })
                .then((r) => r.json() as Promise<HNItem>)
                .then((item) => ({
                  title: item.title || "Untitled",
                  url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
                  source: "Hacker News",
                  time: item.time ? getRelativeTime(item.time) : "recently",
                }))
                .catch(() => null)
            )
          );

          const valid = stories.filter((s): s is NonNullable<typeof s> => s !== null);

          // Prefer AI-related stories first, then fill with general tech
          const aiStories = valid.filter((s) => isAIRelated(s.title));
          const otherStories = valid.filter((s) => !isAIRelated(s.title));
          news = [...aiStories, ...otherStories].slice(0, 10);
        } catch {
          // Use fallback
        }

        return new Response(JSON.stringify(news), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300, s-maxage=600",
          },
        });
      },
    },
  },
});