import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  ArrowRight,
  Bot,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  ExternalLink,
  Filter,
  Flame,
  Globe,
  Image,
  Menu,
  Moon,
  Newspaper,
  Plus,
  Search,
  Sparkles,
  Star,
  Sun,
  Trophy,
  TrendingUp,
  Video,
  WandSparkles,
  X,
  Zap,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/markbook-symbol.png.asset.json";

type Tool = {
  n: string;
  d: string;
  c: string;
  g: string;
  p: "Free" | "Paid" | "Freemium";
  u: string;
};
type Catalog = {
  tools: Tool[];
  categories: Record<string, number>;
  categoryEmojis?: Record<string, string>;
};

const aiNews = [
  { title: "OpenAI Launches GPT-5 with Enhanced Reasoning Capabilities", time: "2h ago" },
  { title: "Google DeepMind Unveils AlphaFold 4 for Drug Discovery", time: "3h ago" },
  { title: "Anthropic Claude Achieves New Benchmark in Code Generation", time: "5h ago" },
  { title: "Meta Releases Llama 5 as Open-Source AI Model", time: "6h ago" },
  { title: "Microsoft Copilot Gets Major Enterprise Update", time: "8h ago" },
  { title: "Stability AI Announces Real-Time Video Generation", time: "10h ago" },
  { title: "Apple Intelligence Expands to More Countries", time: "12h ago" },
  { title: "EU AI Act Enforcement Begins Across Member States", time: "14h ago" },
  { title: "NVIDIA Announces Next-Gen AI Chips for Data Centers", time: "16h ago" },
  { title: "AI-Powered Code Editors See 300% Growth in Adoption", time: "18h ago" },
];

const topNavItems = [
  { label: "Free Tools", icon: "🆓", action: "free" },
  { label: "Categories", icon: "📂", action: "categories" },
  { label: "Ranking", icon: "🏆", href: "/ranking" },
  { label: "Latest AI", icon: "⚡", action: "latest" },
  { label: "AI News", icon: "📰", action: "news" },
  { label: "Submit", icon: "➕", href: "/submit" },
  { label: "Advertise", icon: "📢", href: "/advertise" },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getToolGradient(name: string) {
  const gradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-blue-600",
    "from-amber-500 to-yellow-500",
    "from-fuchsia-500 to-purple-600",
    "from-lime-500 to-green-600",
    "from-sky-500 to-indigo-500",
    "from-red-500 to-orange-500",
    "from-teal-500 to-cyan-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
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
    ],
  }),
  component: Index,
});

function Index() {
  const [catalog, setCatalog] = useState<Catalog>({
    tools: [],
    categories: {},
    categoryEmojis: {},
  });
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visible, setVisible] = useState(20);
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [showSponsor, setShowSponsor] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"today" | "new" | "saved" | "popular">("today");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/ai-catalog.json").then((r) => r.json()),
      fetch("/category-emojis.json").then((r) => r.json()).catch(() => ({})),
    ])
      .then(([data, emojis]: [Catalog, Record<string, string>]) => {
        data.categoryEmojis = emojis;
        setCatalog(data);
      })
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
    let filtered = catalog.tools.filter(
      (tool) =>
        (!term || `${tool.n} ${tool.d} ${tool.c} ${tool.g}`.toLowerCase().includes(term)) &&
        (pricing === "All" || tool.p === pricing) &&
        (activeCategory === "All" || tool.c === activeCategory || tool.g === activeCategory),
    );
    return filtered;
  }, [catalog, query, pricing, activeCategory]);

  const suggestions = searchFocused && query.length > 1 ? results.slice(0, 8) : [];

  const toggleSave = useCallback((name: string) => {
    setSavedTools((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const totalTools = catalog.tools.length;

  return (
    <div ref={topRef} className="min-h-screen bg-background text-foreground">
      {/* ─── Sponsored Banner ─── */}
      {showSponsor && (
        <div className="sponsor-glow py-2 text-center text-sm text-white relative">
          <span className="font-medium">🔥 Sponsored by MarkBook AI</span>
          <span className="mx-2 opacity-60">—</span>
          <span className="opacity-90">Discover {totalTools.toLocaleString()}+ AI tools. Updated daily.</span>
          <button
            onClick={() => setShowSponsor(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* ─── Glass Navigation Bar ─── */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-[1480px] items-center gap-2 px-4 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="MarkBook home">
            <img src={logoAsset.url} alt="MarkBook" className="h-8 w-8 object-contain" />
            <span className="text-lg font-extrabold tracking-tight hidden sm:inline">
              Mark<span className="gradient-text">Book</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="ml-3 hidden items-center gap-0.5 xl:flex">
            {topNavItems.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action === "free") {
                      setPricing(pricing === "Free" ? "All" : "Free");
                      setVisible(20);
                    } else if (item.action === "categories") {
                      setMobileSidebar(true);
                    } else if (item.action === "latest") {
                      document.getElementById("tools-feed")?.scrollIntoView({ behavior: "smooth" });
                    } else if (item.action === "news") {
                      document.getElementById("ai-news-section")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ),
            )}
          </nav>

          {/* Search */}
          <div className="relative ml-auto hidden max-w-sm flex-1 lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(20);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search AI tools, e.g. Video Translation..."
              className="h-9 w-full rounded-lg border border-border/60 bg-muted/40 pl-9 pr-10 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                {suggestions.map((tool) => (
                  <a
                    key={`${tool.n}-${tool.c}`}
                    href={tool.u}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseDown={() => setQuery(tool.n)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-accent"
                  >
                    <ToolIcon name={tool.n} small />
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-sm">{tool.n}</b>
                      <span className="block truncate text-xs text-muted-foreground">{tool.c}</span>
                    </span>
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="size-9"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Link
              to="/submit"
              className="hidden items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
            >
              <Plus className="size-3.5" /> Submit
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="border-t border-border bg-background p-4 lg:hidden">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(20);
                }}
                placeholder="Search AI tools..."
                className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {topNavItems.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action === "free") setPricing("Free");
                      setMobileMenu(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="relative mx-auto max-w-[1480px] px-4 py-12 text-center sm:py-16 lg:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
            🔍 The AI Discovery Engine
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Discover The Best{" "}
            <span className="gradient-text">AI Websites</span>
            <br />
            & Tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {totalTools.toLocaleString()} AIs and {categories.length} categories in the best AI tools directory.
            Updated daily.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(20);
                }}
                placeholder="Search by AI, e.g Video Translation AI Tool"
                className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 shadow-sm"
              />
            </div>
            <Button
              variant="brand"
              size="lg"
              onClick={() => {
                if (query) document.getElementById("tools-feed")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-12 rounded-xl px-8 shadow-sm"
            >
              <Search className="size-4" /> Search
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-6 sm:gap-10">
            {[
              { value: `${(totalTools / 1000).toFixed(0)}K+`, label: "AI Tools" },
              { value: `${categories.length}`, label: "Categories" },
              { value: "Daily", label: "Updates" },
              { value: "Free", label: "To Use" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-extrabold sm:text-2xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category Quick Scroll ─── */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1480px] items-center gap-2 overflow-x-auto px-4 py-3 category-scroll">
          <span className="shrink-0 text-xs font-semibold text-muted-foreground mr-1">Browse:</span>
          <button
            onClick={() => {
              setActiveCategory("All");
              setVisible(20);
            }}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.slice(0, 30).map(([name, count]) => {
            const emoji = catalog.categoryEmojis?.[name] || "🤖";
            return (
              <button
                key={name}
                onClick={() => {
                  setActiveCategory(name);
                  setVisible(20);
                  document.getElementById("tools-feed")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>{emoji}</span>
                <span className="hidden sm:inline">{name.replace("Free ", "")}</span>
                <span className="sm:hidden">{name.replace("Free ", "").slice(0, 12)}</span>
                <span className="rounded-full bg-background/20 px-1 py-0.5 text-[10px]">{count}</span>
              </button>
            );
          })}
          {categories.length > 30 && (
            <button
              onClick={() => setMobileSidebar(true)}
              className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary hover:bg-accent"
            >
              +{categories.length - 30} more
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Content: 3-Column Layout ─── */}
      <main className="mx-auto grid max-w-[1480px] gap-0 px-4 py-5 lg:grid-cols-[250px_minmax(0,1fr)_280px] lg:px-6">

        {/* ─── Left Sidebar: Categories ─── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            {/* Categories List */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border p-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  📂 Categories
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {categories.length}
                  </span>
                </h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-1.5 category-scroll">
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setVisible(20);
                  }}
                  className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeCategory === "All"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-accent"
                  }`}
                >
                  <span>🌐</span>
                  <span className="flex-1">All Categories</span>
                  <span className="text-xs text-muted-foreground">{totalTools}</span>
                </button>
                {categories.map(([name, count]) => {
                  const emoji = catalog.categoryEmojis?.[name] || "🤖";
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setActiveCategory(name);
                        setVisible(20);
                        document.getElementById("tools-feed")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeCategory === name
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/65 hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="shrink-0 text-sm">{emoji}</span>
                      <span className="min-w-0 flex-1 truncate">{name.replace("Free ", "")}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sponsored */}
            <div className="overflow-hidden rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                💎 Sponsored
              </p>
              {[
                { n: "Lovable", d: "Build apps by chatting with AI", c: "Build faster", u: "https://lovable.dev" },
                { n: "Recraft", d: "Create production-ready visuals", c: "Design better", u: "https://recraft.ai" },
              ].map((ad) => (
                <div key={ad.n} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <ToolIcon name={ad.n} small />
                    <div>
                      <p className="text-sm font-semibold">{ad.n}</p>
                      <p className="text-[10px] text-muted-foreground">Verified partner</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{ad.d}</p>
                  <a href={ad.u} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      {ad.c} <ExternalLink className="size-3 ml-1" />
                    </Button>
                  </a>
                </div>
              ))}
              <Link
                to="/advertise"
                className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-primary"
              >
                Advertise on MarkBook <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </aside>

        {/* ─── Mobile Category Drawer ─── */}
        {mobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 overflow-y-auto bg-background p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">📂 Categories</h2>
                <button onClick={() => setMobileSidebar(false)}>
                  <X className="size-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setMobileSidebar(false);
                  setVisible(20);
                }}
                className={`mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  activeCategory === "All" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                🌐 All Categories
                <span className="ml-auto text-xs text-muted-foreground">{totalTools}</span>
              </button>
              {categories.map(([name, count]) => {
                const emoji = catalog.categoryEmojis?.[name] || "🤖";
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setActiveCategory(name);
                      setMobileSidebar(false);
                      setVisible(20);
                    }}
                    className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm ${
                      activeCategory === name
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/65 hover:bg-accent"
                    }`}
                  >
                    <span className="text-sm">{emoji}</span>
                    <span className="min-w-0 flex-1 truncate">{name.replace("Free ", "")}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Center: Tool Feed ─── */}
        <section id="tools-feed" className="min-w-0">

          {/* Filter Tabs */}
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-1">
              <Filter className="size-4 text-muted-foreground mr-1" />
              {["All", "Free", "Freemium", "Paid"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPricing(item);
                    setVisible(20);
                  }}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    pricing === item
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="ml-auto hidden items-center gap-1 sm:flex">
              {(["today", "new", "popular"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveFilter(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    activeFilter === s
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "today" ? "🔥 Today" : s === "new" ? "✨ New" : "📈 Popular"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileSidebar(true)}
              className="ml-2 flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium hover:bg-accent lg:hidden"
            >
              📂 Categories
            </button>
          </div>

          {/* Section Title */}
          <div className="mb-3">
            <h2 className="text-lg font-bold sm:text-xl">
              {query
                ? `Results for "${query}"`
                : activeCategory !== "All"
                  ? `${catalog.categoryEmojis?.[activeCategory] || "🤖"} ${activeCategory.replace("Free ", "")}`
                  : "🔥 Latest AI Tools"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {results.length.toLocaleString()} tools found
            </p>
          </div>

          {/* Tool Cards Grid */}
          {results.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.slice(0, visible).map((tool, index) => (
                <ToolCard
                  key={`${tool.n}-${tool.c}-${index}`}
                  tool={tool}
                  saved={savedTools.has(tool.n)}
                  onToggleSave={() => toggleSave(tool.n)}
                />
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
              onClick={() => setVisible(visible + 20)}
            >
              Show more tools <ChevronRight className="size-4" />
            </Button>
          )}

          {/* ─── Hidden Gems Section ─── */}
          {!query && activeCategory === "All" && (
            <section className="mt-10">
              <div className="mb-4 flex items-center gap-2">
                <Star className="size-5 text-amber-500" />
                <h2 className="text-lg font-bold">Hidden AI Gems</h2>
                <span className="text-xs text-muted-foreground">Underrated, not underpowered</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {catalog.tools
                  .filter((_, i) => i % 97 === 0)
                  .slice(0, 3)
                  .map((tool) => (
                    <article
                      key={tool.n}
                      className="tool-lift rounded-xl border border-border bg-card p-5"
                    >
                      <ToolIcon name={tool.n} />
                      <h3 className="mt-3 font-bold text-sm">{tool.n}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{tool.d}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded-md bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
                          {tool.p}
                        </span>
                        {tool.u && tool.u !== "#" && (
                          <a href={tool.u} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-primary">
                            Visit ↗
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          )}

          {/* ─── Free AI Collections ─── */}
          {!query && activeCategory === "All" && (
            <section className="mt-10">
              <div className="mb-4 flex items-center gap-2">
                <Flame className="size-5 text-orange-500" />
                <h2 className="text-lg font-bold">Trending Free Collections</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Image generators", emoji: "🎨", q: "image" },
                  { t: "Video generators", emoji: "🎬", q: "video" },
                  { t: "Coding assistants", emoji: "💻", q: "code" },
                  { t: "Writing tools", emoji: "✍️", q: "writing" },
                  { t: "Chatbots", emoji: "🤖", q: "chatbot" },
                  { t: "Music generators", emoji: "🎵", q: "music" },
                ].map(({ t, emoji, q }) => (
                  <button
                    key={t}
                    onClick={() => {
                      setQuery(q);
                      setPricing("Free");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="tool-lift group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl">
                      {emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-sm">Best free AI {t}</b>
                      <span className="text-xs text-muted-foreground">
                        Explore the curated collection
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ─── AI News Section ─── */}
          <section id="ai-news-section" className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <Newspaper className="size-5 text-primary" />
              <h2 className="text-lg font-bold">AI News</h2>
              <span className="text-xs text-muted-foreground">Latest updates</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="divide-y divide-border">
                {aiNews.map((news, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="flex size-6 shrink-0 place-items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium leading-5">{news.title}</p>
                      <span className="text-[10px] text-muted-foreground">{news.time}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="border-t border-border p-3 text-center">
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Read More AI News →
                </a>
              </div>
            </div>
          </section>
        </section>

        {/* ─── Right Sidebar ─── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            {/* AI News */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border p-3">
                <span className="text-sm">📰</span>
                <h2 className="text-sm font-bold">AI News</h2>
              </div>
              <div className="divide-y divide-border">
                {aiNews.slice(0, 8).map((news, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-start gap-2.5 px-3 py-2 transition-colors hover:bg-accent"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-xs font-medium leading-4">{news.title}</p>
                      <span className="text-[10px] text-muted-foreground">{news.time}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="border-t border-border p-2 text-center">
                <a href="#" className="text-[10px] font-medium text-primary hover:underline">
                  Read More AI News →
                </a>
              </div>
            </div>

            {/* Top Ranked */}
            <div className="overflow-hidden rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🏆</span>
                <h3 className="text-sm font-bold">Top Ranked</h3>
              </div>
              {catalog.tools.slice(0, 5).map((tool, i) => (
                <a
                  key={tool.n}
                  href={tool.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  <span className="flex size-5 shrink-0 place-items-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <ToolIcon name={tool.n} small />
                  <span className="min-w-0 flex-1 truncate font-medium text-xs">{tool.n}</span>
                  <span className="text-[10px] text-muted-foreground">{tool.p}</span>
                </a>
              ))}
              <Link
                to="/ranking"
                className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View full ranking <ArrowRight className="size-3" />
              </Link>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-border bg-card p-3">
              <h3 className="mb-2 text-sm font-bold">⚡ Quick Links</h3>
              <div className="space-y-1">
                {[
                  { label: "Submit your AI tool", href: "/submit", icon: "➕" },
                  { label: "Advertise with us", href: "/advertise", icon: "📢" },
                  { label: "Browse categories", action: () => setMobileSidebar(true), icon: "📂" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.href || "/"}
                    onClick={link.action}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <span className="text-sm">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* ─── Footer ─── */}
      <footer className="mt-12 border-t border-border bg-card">
        <div className="mx-auto max-w-[1480px] px-4 py-10 lg:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={logoAsset.url} alt="MarkBook" className="h-8 w-8 object-contain" />
                <span className="text-lg font-extrabold">
                  Mark<span className="gradient-text">Book</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-6">
                The world's AI discovery and research platform. Find, compare, and choose the best AI tools for any task.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">🔍 Discover</h4>
              <div className="space-y-2">
                {["Latest AI Tools", "Free AI Tools", "AI Rankings", "Categories"].map((item) => (
                  <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-primary">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">📚 Resources</h4>
              <div className="space-y-2">
                {[
                  { label: "AI News", href: "#" },
                  { label: "Submit Tool", href: "/submit" },
                  { label: "Advertise", href: "/advertise" },
                  { label: "Ranking", href: "/ranking" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">🏢 Company</h4>
              <div className="space-y-2">
                {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
                  <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-primary">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} MarkBook. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="size-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">EN</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
}

/* ─── Shared Components ─────────────────────────────────────── */

function ToolIcon({ name, small = false }: { name: string; small?: boolean }) {
  const gradient = getToolGradient(name);
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-gradient-to-br ${gradient} font-bold text-white shadow-sm ${
        small ? "size-8 text-[9px]" : "size-10 text-xs"
      }`}
    >
      {initials(name)}
    </span>
  );
}

function ToolCard({
  tool,
  saved,
  onToggleSave,
}: {
  tool: Tool;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article className="tool-lift flex min-w-0 flex-col rounded-xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-start gap-3">
        <a href={tool.u} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <ToolIcon name={tool.n} />
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <a href={tool.u} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <h3 className="truncate font-semibold text-sm">{tool.n}</h3>
            </a>
            {tool.p === "Free" && (
              <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                Free
              </span>
            )}
            {tool.p === "Paid" && (
              <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                Paid
              </span>
            )}
            {tool.p === "Freemium" && (
              <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                Freemium
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{tool.c}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-primary transition-colors"
          title={saved ? "Unsave" : "Save"}
        >
          <Bookmark className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <p className="my-3 line-clamp-2 min-h-8 text-sm leading-5 text-muted-foreground">{tool.d}</p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <div className="flex flex-wrap gap-1 min-w-0 max-w-[55%]">
          <span className="truncate rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            #{tool.c.replace(/\s+/g, "").replace(/^AI/i, "AI")}
          </span>
          {tool.g && tool.g !== tool.c && (
            <span className="truncate rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground hidden sm:inline">
              #{tool.g.replace(/\s+/g, "").replace(/^FreeAI/i, "AI")}
            </span>
          )}
        </div>
        <a href={tool.u} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="shrink-0 text-xs text-primary hover:text-primary/80">
            Visit <ExternalLink className="size-3 ml-0.5" />
          </Button>
        </a>
      </div>
    </article>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
      <Search className="mx-auto mb-4 size-10 text-muted-foreground" />
      <h3 className="text-lg font-bold">No exact matches yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Try a broader keyword or reset your filters.
      </p>
      <Button variant="outline" className="mt-5" onClick={onReset}>
        Reset search
      </Button>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 grid size-10 place-items-center rounded-full border border-border bg-card shadow-lg transition hover:bg-accent"
      aria-label="Back to top"
    >
      <ChevronRight className="size-4 -rotate-90" />
    </button>
  );
}
