import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

// ── Compare tools ──────────────────────────────────────────────────────────
const CompareInput = z.object({
  tools: z.array(z.string().min(1)).min(2).max(4),
  context: z.string().optional(),
});

const CompareSchema = z.object({
  verdict: z.string().describe("One-sentence summary of which is best overall and why"),
  winner: z.string().describe("Name of the best overall tool from the list"),
  tools: z.array(
    z.object({
      name: z.string(),
      summary: z.string().describe("1-2 sentence description"),
      bestFor: z.string().describe("Who/what this tool is best for"),
      pricing: z.string().describe("Pricing model in a few words"),
      pros: z.array(z.string()).min(2).max(5),
      cons: z.array(z.string()).min(1).max(4),
      rating: z.number().min(0).max(10).describe("Overall rating out of 10"),
    }),
  ),
});

export const compareTools = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CompareInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured");

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `Compare these AI tools side-by-side based on current public information, reviews, and capabilities as of 2025-2026.

Tools: ${data.tools.join(", ")}
${data.context ? `Context / user goal: ${data.context}` : ""}

For each tool, give an honest assessment: what it actually does well, where it falls short, who should use it, and how it's priced. Then pick a clear winner with a one-sentence verdict.`;

    try {
      const { experimental_output } = await generateText({
        model: gateway(MODEL),
        experimental_output: Output.object({ schema: CompareSchema }),
        prompt,
      });
      return experimental_output;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("AI is busy right now — please try again in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error("AI comparison failed. Please try again.");
    }
  });

// ── AI Rank a category/topic ───────────────────────────────────────────────
const RankInput = z.object({
  topic: z.string().min(2).max(120),
  candidates: z.array(z.string()).optional(),
});

const RankSchema = z.object({
  topic: z.string(),
  summary: z.string().describe("One-paragraph overview of the landscape"),
  ranking: z
    .array(
      z.object({
        rank: z.number().int().min(1),
        name: z.string(),
        reason: z.string().describe("Why it earned this rank, 1-2 sentences"),
        strengths: z.array(z.string()).min(1).max(4),
        bestFor: z.string(),
      }),
    )
    .min(3)
    .max(10),
});

export const aiRankTools = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RankInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured");

    const gateway = createLovableAiGatewayProvider(key);
    const candidateList = data.candidates && data.candidates.length > 0
      ? `\nConsider especially these candidates: ${data.candidates.slice(0, 20).join(", ")}.`
      : "";

    const prompt = `Rank the best AI tools for: "${data.topic}".
Use what you know about real AI tools as of 2025-2026 — their actual capabilities, pricing, and reputation. Be honest and specific (no marketing fluff).${candidateList}

Return a ranked top list (5-7 tools ideal) with a short reason and concrete strengths for each.`;

    try {
      const { experimental_output } = await generateText({
        model: gateway(MODEL),
        experimental_output: Output.object({ schema: RankSchema }),
        prompt,
      });
      return experimental_output;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("AI is busy right now — please try again in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error("AI ranking failed. Please try again.");
    }
  });
