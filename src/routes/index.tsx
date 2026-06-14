import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Code2,
  Compass,
  ExternalLink,
  Flame,
  Image,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  Sparkles,
  Star,
  Sun,
  User,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import logoAsset from "@/assets/markbook-symbol.png.asset.json";

type Tool = { n: string; d: string; c: string; g: string; p: "Free" | "Paid" | "Freemium" };
type Catalog = { tools: Tool[]; categories: Record<string, number> };

const featured: Tool[] = [
  {
    n: "ChatGPT",
    d: "Engaging conversations · automate tasks · real-time web research",
    c: "AI Chatbot",
    g: "AI Chatbots",
    p: "Freemium",
  },
  {
    n: "Google Gemini",
    d: "Personal AI assistant for writing, research, and explanations",
    c: "AI Assistant",
    g: "Productivity",
    p: "Free",
  },
  {
    n: "Claude",
    d: "Advanced reasoning, code generation, and thoughtful analysis",
    c: "AI Assistant",
    g: "Productivity",
    p: "Freemium",
  },
  {
    n: "Recraft",
    d: "Generate and edit production-ready images in a consistent style",
    c: "AI Image Generator",
    g: "Creative",
    p: "Freemium",
  },
  {
    n: "Lovable",
    d: "Build production-ready apps and websites by chatting with AI",
    c: "AI App Builder",
    g: "Development",
    p: "Freemium",
  },
];

const categoryIcons = [Bot, Image, Video, Code2, WandSparkles, Compass];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarkBook — Discover 20,000+ AI Tools" },
      {
        name: "description",
        content:
          "Search, compare, and discover the best AI tools for any task with MarkBook's trusted AI research platform.",
      },
      { property: "og:title", content: "MarkBook — Discover 20,000+ AI Tools" },
      { property: "og:description", content: "The world's AI discovery and research platform." },
    ],
  }),
  component: Index,
});

function Index() {
  const [catalog, setCatalog] = useState<Catalog>({ tools: featured, categories: {} });
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visible, setVisible] = useState(12);
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [research, setResearch] = useState("");
  const [researchResult, setResearchResult] = useState<Tool[]>([]);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetch("/ai-catalog.json")
      .then((response) => response.json())
      .then((data: Catalog) => setCatalog(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const categories = useMemo(
    () => Object.entries(catalog.categories).sort((a, b) => b[1] - a[1]),
    [catalog],
  );
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return catalog.tools.filter(
      (tool) =>
        (!term || `${tool.n} ${tool.d} ${tool.c} ${tool.g}`.toLowerCase().includes(term)) &&
        (pricing === "All" || tool.p === pricing) &&
        (activeCategory === "All" || tool.c === activeCategory),
    );
  }, [catalog, query, pricing, activeCategory]);

  const suggestions = query.length > 1 ? results.slice(0, 6) : [];
  const runResearch = () => {
    const term = research
      .toLowerCase()
      .replace(/i need|an ai|a free|tool|for|that can|please/g, " ")
      .trim();
    const matches = catalog.tools
      .filter((tool) => `${tool.n} ${tool.d} ${tool.c}`.toLowerCase().includes(term))
      .slice(0, 3);
    setResearchResult(matches.length ? matches : featured.slice(0, 3));
  };

  return (
    <div className="min-h-screen bg-background/90 text-foreground">
      <header className="glass-surface sticky top-0 z-50 border-b border-border/80">
        <div className="mx-auto grid h-16 max-w-[1580px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-18 lg:grid-cols-[240px_minmax(300px,680px)_1fr] lg:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="MarkBook home">
            <img src={logoAsset.url} alt="MarkBook" className="h-9 w-10 shrink-0 object-contain" />
            <span className="truncate text-xl font-extrabold tracking-tight">
              Mark<span className="text-brand">Book</span>
            </span>
          </Link>
          <div className="relative order-3 col-span-2 lg:order-none lg:col-span-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(12);
              }}
              placeholder="Search 20,000+ AI tools..."
              className="h-11 w-full rounded-full border border-border bg-muted/70 pl-11 pr-12 text-sm outline-none transition focus:border-brand focus:bg-background focus:ring-4 focus:ring-brand-soft"
              aria-label="Search AI tools"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘ K
            </kbd>
            {suggestions.length > 0 && (
              <div className="premium-shadow absolute left-0 right-0 top-13 overflow-hidden rounded-2xl border border-border bg-popover p-2">
                {suggestions.map((tool) => (
                  <button
                    key={`${tool.n}-${tool.c}`}
                    onClick={() => setQuery(tool.n)}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-accent"
                  >
                    <ToolLogo name={tool.n} small />
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-sm">{tool.n}</b>
                      <span className="block truncate text-xs text-muted-foreground">{tool.c}</span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-1">
            <nav className="hidden items-center gap-1 xl:flex">
              {["Categories", "Latest AI", "Hidden Gems", "Free AI", "Research"].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    item === "Free AI"
                      ? setPricing("Free")
                      : item === "Categories"
                        ? document.getElementById("categories")?.scrollIntoView()
                        : document
                            .getElementById(item.toLowerCase().replace(" ", "-"))
                            ?.scrollIntoView()
                  }
                >
                  {item}
                </Button>
              ))}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/advertise">Advertise</Link>
              </Button>
            </nav>
            {user ? (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:flex" onClick={signOut}>
                  <LogOut className="size-4" />
                  Sign out
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden" onClick={signOut} aria-label="Sign out">
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="hidden gap-1.5 xl:flex" asChild>
                <Link to="/auth">
                  <LogIn className="size-4" />
                  Sign in
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              aria-label="Toggle color theme"
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Open navigation"
            >
              {mobileMenu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {mobileMenu && (
          <nav className="grid grid-cols-3 gap-2 border-t border-border bg-background p-3 xl:hidden">
            {["Categories", "Latest AI", "Free AI", "Research", "Advertise"].map((item) =>
              item === "Advertise" ? (
                <Button key={item} variant="outline" asChild>
                  <Link to="/advertise">{item}</Link>
                </Button>
              ) : (
                <Button
                  key={item}
                  variant="outline"
                  onClick={() => {
                    if (item === "Free AI") setPricing("Free");
                    document.getElementById(item.toLowerCase().replace(" ", "-"))?.scrollIntoView();
                    setMobileMenu(false);
                  }}
                >
                  {item}
                </Button>
              ),
            )}
            {user ? (
              <Button variant="outline" onClick={() => { signOut(); setMobileMenu(false); }}>
                Sign out
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth" onClick={() => setMobileMenu(false)}>Sign in</Link>
              </Button>
            )}
          </nav>
        )}
      </header>

      <main className="mx-auto grid max-w-[1580px] gap-5 px-4 py-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-6 2xl:grid-cols-[240px_minmax(0,1fr)_290px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Sponsored</h2>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Ads
              </span>
            </div>
            {[
              { n: "Lovable", d: "Build apps by chatting with AI.", c: "Build faster" },
              { n: "Recraft", d: "Create production-ready visuals.", c: "Design better" },
            ].map((ad) => (
              <article
                key={ad.n}
                className="tool-lift overflow-hidden rounded-2xl border border-border bg-card p-4"
              >
                <div className="mb-5 flex items-center gap-3">
                  <ToolLogo name={ad.n} />
                  <div>
                    <h3 className="font-bold">{ad.n}</h3>
                    <p className="text-xs text-muted-foreground">Verified partner</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-6 text-muted-foreground">{ad.d}</p>
                <Button variant="outline" className="w-full">
                  {ad.c}
                  <ExternalLink />
                </Button>
              </article>
            ))}
            <Link
              to="/advertise"
              className="flex items-center justify-between rounded-xl p-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Advertise on MarkBook <ArrowRight className="size-3" />
            </Link>
          </div>
        </aside>

        <section className="min-w-0 space-y-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 premium-shadow sm:p-8">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                  <Sparkles className="size-3.5" /> The AI discovery engine
                </div>
                <h1 className="max-w-2xl text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
                  Find the right AI.
                  <br />
                  <span className="text-brand">Faster than ever.</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Explore {catalog.tools.length.toLocaleString()} curated AI tools across{" "}
                  {categories.length || "100+"} categories—researched, organized, and ready to
                  compare.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-border bg-muted/60 p-4 text-right sm:block">
                <div className="text-2xl font-extrabold">20K+</div>
                <div className="text-xs text-muted-foreground">tools indexed</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Free", "Freemium", "Paid"].map((item) => (
                <Button
                  key={item}
                  variant={pricing === item ? "brand" : "outline"}
                  size="pill"
                  onClick={() => {
                    setPricing(item);
                    setVisible(12);
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <section id="latest-ai">
            <SectionHeader
              eyebrow="Fresh from the frontier"
              title={query ? `Results for “${query}”` : "Latest AI tools"}
              count={results.length}
              icon={<Sparkles />}
            />
            {results.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {results.slice(0, visible).map((tool, index) => (
                  <ToolCard key={`${tool.n}-${tool.c}-${index}`} tool={tool} />
                ))}
              </div>
            ) : (
              <EmptyState
                onReset={() => {
                  setQuery("");
                  setPricing("All");
                  setActiveCategory("All");
                }}
              />
            )}
            {visible < results.length && (
              <Button
                variant="outline"
                size="lg"
                className="mt-5 w-full"
                onClick={() => setVisible(visible + 12)}
              >
                Show more tools <ChevronRight />
              </Button>
            )}
          </section>

          {!query && (
            <>
              <section id="hidden-gems">
                <SectionHeader
                  eyebrow="Underrated, not underpowered"
                  title="Hidden AI gems"
                  icon={<Star />}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  {catalog.tools
                    .filter((_, i) => i % 97 === 0)
                    .slice(0, 3)
                    .map((tool) => (
                      <article
                        key={tool.n}
                        className="tool-lift rounded-2xl border border-border bg-card p-5"
                      >
                        <ToolLogo name={tool.n} />
                        <h3 className="mt-4 font-bold">{tool.n}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {tool.d}
                        </p>
                        <div className="mt-4 rounded-xl bg-brand-soft p-3 text-xs leading-5 text-brand">
                          <b>Why it’s useful:</b> A focused alternative with less noise and a
                          generous {tool.p.toLowerCase()} entry point.
                        </div>
                      </article>
                    ))}
                </div>
              </section>

              <section id="free-ai">
                <SectionHeader
                  eyebrow="No card required"
                  title="Trending free collections"
                  icon={<Flame />}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { t: "Image generators", i: Image, q: "image" },
                    { t: "Video generators", i: Video, q: "video" },
                    { t: "Coding assistants", i: Code2, q: "code" },
                    { t: "Writing tools", i: WandSparkles, q: "writing" },
                  ].map(({ t, i: Icon, q }) => (
                    <button
                      key={t}
                      onClick={() => {
                        setQuery(q);
                        setPricing("Free");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="tool-lift group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left"
                    >
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                        <Icon />
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block">Best free AI {t}</b>
                        <span className="text-sm text-muted-foreground">
                          Explore the curated collection
                        </span>
                      </span>
                      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </section>

              <section
                id="research"
                className="overflow-hidden rounded-3xl border border-border bg-primary p-6 text-primary-foreground sm:p-8"
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/10">
                    <Bot />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/55">
                      AI Research Assistant
                    </p>
                    <h2 className="text-xl font-bold">Tell us what you need</h2>
                  </div>
                </div>
                <p className="mb-5 max-w-xl text-sm leading-6 text-primary-foreground/65">
                  Describe your task in plain language. MarkBook analyzes the catalog and recommends
                  fitting tools.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={research}
                    onChange={(e) => setResearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runResearch()}
                    placeholder="I need a free AI that can generate videos..."
                    className="h-12 min-w-0 flex-1 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus:border-brand"
                  />
                  <Button variant="brand" size="lg" onClick={runResearch}>
                    Find my AI <Sparkles />
                  </Button>
                </div>
                {researchResult.length > 0 && (
                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    {researchResult.map((tool) => (
                      <div
                        key={`${tool.n}-${tool.c}`}
                        className="rounded-xl bg-primary-foreground/10 p-3"
                      >
                        <b className="block text-sm">{tool.n}</b>
                        <span className="line-clamp-2 text-xs text-primary-foreground/55">
                          Matches your need for {tool.c.toLowerCase()}.
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>

        <aside id="categories" className="hidden 2xl:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between p-2">
              <div>
                <h2 className="font-bold">Categories</h2>
                <p className="text-xs text-muted-foreground">Browse every use case</p>
              </div>
              <span className="rounded-full bg-brand-soft px-2 py-1 text-xs font-bold text-brand">
                {categories.length}
              </span>
            </div>
            <div className="mt-2 max-h-[calc(100vh-180px)] space-y-0.5 overflow-y-auto pr-1">
              <button
                onClick={() => setActiveCategory("All")}
                className="flex w-full items-center gap-3 rounded-xl bg-brand-soft p-2.5 text-left text-sm font-semibold text-brand"
              >
                <Compass className="size-4" />
                All categories<span className="ml-auto text-xs">{catalog.tools.length}</span>
              </button>
              {categories.map(([name, count], index) => {
                const Icon = categoryIcons[index % categoryIcons.length];
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setActiveCategory(name);
                      setVisible(12);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-sm hover:bg-accent"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand" />
                    <span className="min-w-0 flex-1 truncate">{name}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function ToolLogo({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-brand-soft font-extrabold text-brand ${small ? "size-9 text-[10px]" : "size-12 text-sm"}`}
    >
      {initials(name)}
    </span>
  );
}
function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="tool-lift flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-start gap-3">
        <ToolLogo name={tool.n} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{tool.n}</h3>
          <p className="truncate text-xs text-muted-foreground">{tool.c}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${tool.p === "Free" ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground"}`}
        >
          {tool.p}
        </span>
      </div>
      <p className="my-4 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{tool.d}</p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <span className="max-w-[55%] truncate text-xs text-muted-foreground">{tool.g}</span>
        <Button variant="ghost" size="sm">
          Visit website <ExternalLink />
        </Button>
      </div>
    </article>
  );
}
function SectionHeader({
  eyebrow,
  title,
  count,
  icon,
}: {
  eyebrow: string;
  title: string;
  count?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
        <h2 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
        {icon}
        {count !== undefined && <span className="text-sm">{count.toLocaleString()}</span>}
      </div>
    </div>
  );
}
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <Search className="mx-auto mb-4 size-8 text-muted-foreground" />
      <h3 className="font-bold">No exact matches yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a broader keyword or reset your filters.
      </p>
      <Button variant="outline" className="mt-5" onClick={onReset}>
        Reset search
      </Button>
    </div>
  );
}
