import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Resolves the AI provider for server-side AI features (compare / rank).
 *
 * Priority:
 *   1. GEMINI_API_KEY (or GOOGLE_API_KEY) — Google Gemini directly via its
 *      OpenAI-compatible endpoint. Recommended on Vercel: create a key at
 *      https://aistudio.google.com/apikey and add it as a Vercel env var.
 *   2. LOVABLE_API_KEY — legacy Lovable AI gateway (kept for backward
 *      compatibility; works only while a Lovable Cloud workspace exists).
 *
 * Returns null when no key is configured — callers show a friendly
 * "AI service is not configured" message.
 */
export function resolveAiGateway() {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    const provider = createOpenAICompatible({
      name: "google-gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      apiKey: geminiKey,
    });
    return { provider, model: "gemini-2.5-flash-lite" };
  }

  const lovableKey = process.env.LOVABLE_API_KEY;
  if (lovableKey) {
    const provider = createOpenAICompatible({
      name: "lovable-ai-gateway",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": lovableKey },
    });
    return { provider, model: "google/gemini-2.5-flash-lite" };
  }

  return null;
}
