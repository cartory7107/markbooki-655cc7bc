import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Crown,
  ExternalLink,
  Filter,
  Medal,
  Search,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tool = { n: string; d: string; c: string; g: string; p: "Free" | "Paid" | "Freemium"; v?: number };
type Catalog = { tools: Tool[]; categories: Record<string, number> };

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function getToolColor(name: string) {
  const colors = [
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-blue-500 to-cyan-600",
    "from-violet-500 to-fuchsia-600",
    "from-sky-500 to-indigo-600",
    "from-red-500 to-pink-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "AI Tools Ranking — MarkBook" },
      { name: "description", content: "See the top-ranked AI tools on MarkBook." },
    ],
  }),
  component: RankingPage,
});

function RankingPage() {
  const [catalog, setCatalog] = useState<Catalog>({ tools: [], categories: {} });
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All");

  useEffect(() => {
    fetch("/ai-catalog.json")
      .then((r) => r.json())
      .then((d: Catalog) => setCatalog(d))
      .catch(() => undefined);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return catalog.tools
      .filter(
        (t) =>
          (!term || `${t.n} ${t.d} ${t.c}`.toLowerCase().includes(term)) &&
          (pricing === "All" || t.p === pricing),
      )
      .slice(0, 50);
  }, [catalog, query, pricing]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="size-4" /> Back</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" />
            <h1 className="text-lg font-bold">AI Tools Ranking</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6">
        {/* Top 3 Podium */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {results.slice(0, 3).map((tool, i) => {
            const medals = [
              { icon: Crown, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950", label: "#1" },
              { icon: Medal, color: "text-slate-400", bg: "bg-slate-50 dark:bg-slate-900", label: "#2" },
              { icon: Medal, color: "text-amber-700", bg: "bg-orange-50 dark:bg-orange-950", label: "#3" },
            ];
            const m = medals[i];
            return (
              <div
                key={tool.n}
                className={`relative overflow-hidden rounded-2xl border border-border ${m.bg} p-6 text-center`}
              >
                <m.icon className={`mx-auto size-8 ${m.color}`} />
                <span className={`mt-1 block text-2xl font-extrabold ${m.color}`}>{m.label}</span>
                <span className="mx-auto my-3 grid size-14 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                  {initials(tool.n)}
                </span>
                <h3 className="font-bold">{tool.n}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{tool.c}</p>
                <span className="mt-2 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {tool.p}
                </span>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter ranking..."
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="size-4 text-muted-foreground" />
            {["All", "Free", "Freemium", "Paid"].map((item) => (
              <button
                key={item}
                onClick={() => setPricing(item)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  pricing === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Ranking Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Tool</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground md:table-cell">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Pricing</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Visit</th>
              </tr>
            </thead>
            <tbody>
              {results.map((tool, i) => (
                <tr key={`${tool.n}-${i}`} className="border-b border-border transition-colors hover:bg-accent/50">
                  <td className="px-4 py-3">
                    <span className={`flex size-7 place-items-center justify-center rounded-md text-xs font-bold ${
                      i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${getToolColor(tool.n)} text-[9px] font-bold text-white`}>
                        {initials(tool.n)}
                      </span>
                      <span className="font-medium text-sm">{tool.n}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {tool.c}
                    </span>
                  </td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {tool.d}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      tool.p === "Free"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                        : tool.p === "Paid"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    }`}>
                      {tool.p}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Visit <ExternalLink className="size-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
