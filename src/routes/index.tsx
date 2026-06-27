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
  LogIn,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Plus,
  Search,
  Star,
  Sun,
  Trophy,
  TrendingUp,
  User,
  Video,
  WandSparkles,
  X,
  Zap,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/markbook-symbol-clean.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

type Tool = {
  n: string;
  d: string;
  c: string;
  g: string;
  p: string;
  u: string;
  fl?: string;
  /** Exclusive tile — render with holographic background. */
  ex?: boolean;
  /** Trending tag (verified-pool tool). */
  tr?: boolean;
};


const PRICING_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Free: { bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-600 dark:text-emerald-400", label: "Free" },
  "Free Plan": { bg: "bg-green-50 dark:bg-green-950/50", text: "text-green-600 dark:text-green-400", label: "Free Plan" },
  "Free Trial": { bg: "bg-sky-50 dark:bg-sky-950/50", text: "text-sky-600 dark:text-sky-400", label: "Free Trial" },
  "Free Credits": { bg: "bg-violet-50 dark:bg-violet-950/50", text: "text-violet-600 dark:text-violet-400", label: "Free Credits" },
  "Daily Free": { bg: "bg-cyan-50 dark:bg-cyan-950/50", text: "text-cyan-600 dark:text-cyan-400", label: "Daily Free" },
  "Monthly Free": { bg: "bg-teal-50 dark:bg-teal-950/50", text: "text-teal-600 dark:text-teal-400", label: "Monthly Free" },
  Paid: { bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-600 dark:text-amber-400", label: "Paid" },
  "Paid Plans": { bg: "bg-orange-50 dark:bg-orange-950/50", text: "text-orange-600 dark:text-orange-400", label: "Paid Plans" },
  "Open Source": { bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600 dark:text-blue-400", label: "Open Source" },
  unknown: { bg: "bg-zinc-50 dark:bg-zinc-950/50", text: "text-zinc-600 dark:text-zinc-400", label: "Unknown" },
  Unknown: { bg: "bg-zinc-50 dark:bg-zinc-950/50", text: "text-zinc-600 dark:text-zinc-400", label: "Unknown" },
  freemium: { bg: "bg-indigo-50 dark:bg-indigo-950/50", text: "text-indigo-600 dark:text-indigo-400", label: "Freemium" },
};
type Catalog = {
  tools: Tool[];
  categories: Record<string, number>;
  categoryEmojis: Record<string, string>;
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
  { label: "Compare", icon: "⚖️", href: "/compare" },
  { label: "University", icon: "🎓", href: "/university" },
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

// Returns raw CSS color string for inline style gradient backgrounds
function getToolGradientColors(name: string) {
  const colorPairs = [
    ["#8b5cf6", "#9333ea"],
    ["#3b82f6", "#4f46e5"],
    ["#10b981", "#0d9488"],
    ["#f97316", "#ef4444"],
    ["#ec4899", "#e11d48"],
    ["#06b6d4", "#2563eb"],
    ["#f59e0b", "#eab308"],
    ["#d946ef", "#9333ea"],
    ["#84cc16", "#16a34a"],
    ["#0ea5e9", "#6366f1"],
    ["#ef4444", "#f97316"],
    ["#14b8a6", "#0891b2"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const pair = colorPairs[Math.abs(hash) % colorPairs.length];
  return `${pair[0]}, ${pair[1]}`;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarkBook — 116,000+ AI Tools Directory | Discover, Compare & Search the Best AI" },
      {
        name: "description",
        content:
          "MarkBook is the world's largest AI tools directory. Search, compare, and discover 116,000+ AI tools — chatbots, image, video, code, and writing — across 500+ categories.",
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
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visible, setVisible] = useState(1000);
  const [totalResults, setTotalResults] = useState(0);
  const [totalTools, setTotalTools] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [showSponsor, setShowSponsor] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"today" | "new" | "saved" | "popular">("today");
  const [authUser, setAuthUser] = useState<{ email: string; name?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [exclusiveTools, setExclusiveTools] = useState<Tool[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to search results when user types
  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      document.getElementById("tools-feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    setVisible(20);
    // Auto-scroll to results after a brief delay so results render first
    if (value.trim().length > 0) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        scrollToResults();
      }, 300);
    }
  }, [scrollToResults]);

  // ── Load lightweight homepage data from server API (~10KB instead of 11MB) ──
  useEffect(() => {
    fetch("/tools-api.json")
      .then((r) => r.json())
      .then((data: { topTools: Tool[]; categories: Record<string, number>; categoryEmojis: Record<string, string>; totalTools: number; gems: Tool[] }) => {
        setCatalog({
          tools: data.topTools,
          categories: data.categories,
          categoryEmojis: data.categoryEmojis,
        });
        setTotalTools(data.totalTools);
        setCatalogLoaded(true);
      })
      .catch(() => setCatalogLoaded(true));
  }, []);

  // ── Load 50 exclusive tools for bottom section ──
  useEffect(() => {
    fetch("/exclusive-api.json")
      .then((r) => r.json())
      .then((data: { exclusives: Tool[] }) => {
        setExclusiveTools(data.exclusives);
      })
      .catch(() => {});
  }, []);

  // ── Server-side search/browsing: triggered when query/category/pricing changes ──
  const [searchOffset, setSearchOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!catalogLoaded) return;

    // ALL modes now fetch from server API — browsing, searching, filtering
    setSearchLoading(true);
    setSearchOffset(0);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (pricing !== "All") params.set("pricing", pricing);
    if (activeFilter && activeFilter !== "saved") params.set("sort", activeFilter);
    params.set("offset", "0");
    params.set("limit", "50");

    fetch(`/search-api.json?${params}`)
      .then((r) => r.json())
      .then((data: { results: Tool[]; total: number }) => {
        // In browsing mode, prepend the verified top-20 tools first
        const initialTools = (!query.trim() && activeCategory === "All" && pricing === "All" && (!activeFilter || activeFilter === "today"))
          ? catalog.tools.slice(0, 20) : [];
        setCatalog((prev) => ({
          ...prev,
          tools: [...initialTools, ...data.results.filter((t: Tool) => !initialTools.some((it: Tool) => it.n === t.n))],
        }));
        setTotalResults(data.total);
        setSearchLoading(false);
      })
      .catch(() => setSearchLoading(false));
  }, [query, activeCategory, pricing, activeFilter, catalogLoaded]);

  // ── Load more tools from server API ──
  const loadMore = useCallback(() => {
    setLoadingMore(true);
    const newOffset = searchOffset + 50;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (pricing !== "All") params.set("pricing", pricing);
    if (activeFilter && activeFilter !== "saved") params.set("sort", activeFilter);
    params.set("offset", String(newOffset));
    params.set("limit", "50");

    fetch(`/search-api.json?${params}`)
      .then((r) => r.json())
      .then((data: { results: Tool[]; total: number }) => {
        if (data.results.length > 0) {
          setCatalog((prev) => ({ ...prev, tools: [...prev.tools, ...data.results] }));
          setSearchOffset(newOffset);
        }
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  }, [query, activeCategory, pricing, activeFilter, searchOffset, catalogLoaded]);

  // Track auth state for navbar login/signup button
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthUser({
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0],
        });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser({
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0],
        });
      } else {
        setAuthUser(null);
      }
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const handleSignIn = async () => {
    const { lovable } = await import("@/integrations/lovable/index");
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setShowUserMenu(false);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const CATEGORY_PRIORITY = [
    "AI Chatbot",
    "AI Girlfriend",
    "AI Code Generator",
    "AI Code Assistant",
    "AI Developer Tools",
    "AI Video Generator",
    "AI Video Editor",
    "AI Image Generator",
    "AI Art Generator",
    "AI Photo Editor",
    "AI 3D Model Generator",
    "Image to 3D Model",
    "Text to 3D",
    "AI Writing",
    "AI Music Generator",
    "AI Voice Generator",
    "AI Search Engine",
    "AI Assistant",
    "AI Character",
    "AI Roleplay",
  ];

  const categories = useMemo(() => {
    const prioritySet = new Set(CATEGORY_PRIORITY);
    const priorityMap = new Map(CATEGORY_PRIORITY.map((c, i) => [c, i]));
    return Object.entries(catalog.categories).sort((a, b) => {
      const aPri = priorityMap.has(a[0]);
      const bPri = priorityMap.has(b[0]);
      if (aPri && bPri) return priorityMap.get(a[0])! - priorityMap.get(b[0])!;
      if (aPri) return -1;
      if (bPri) return 1;
      return b[1] - a[1];
    });
  }, [catalog]);

  // Results are now served from the server (already filtered & sorted)
  // In browsing mode, use the top-20 from tools-api; in search mode, use search-api results
  const results = useMemo(() => {
    return catalog.tools;
  }, [catalog.tools]);

  const displayedCount = totalResults > 0 ? totalResults : totalTools;

  // ── Auto infinite scroll via IntersectionObserver ──
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !catalogLoaded) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && results.length < displayedCount) {
          loadMore();
        }
      },
      { rootMargin: "500px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [catalogLoaded, loadingMore, results.length, displayedCount, loadMore]);

  const suggestions = searchFocused && query.length > 1 ? results.slice(0, 8) : [];

  const toggleSave = useCallback((name: string) => {
    setSavedTools((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);



  return (
    <div ref={topRef} className="min-h-screen bg-background text-foreground moving-grid-bg">
      <div className="relative z-10">
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
              onChange={(e) => handleSearchChange(e.target.value)}
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
                    <ToolIcon name={tool.n} url={tool.u} small />
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

            {/* Sign In / User Menu */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {authUser.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-foreground/80 sm:inline">{authUser.name}</span>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                      <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold truncate">{authUser.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/submit"
                          onClick={() => setShowUserMenu(false)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <Plus className="size-4" /> Submit AI Tool
                        </Link>
                        {authUser.email === "cartory7107@gmail.com" && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                          >
                            <Star className="size-4" /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-border p-1.5">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <LogOut className="size-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className="gap-1.5 text-xs sm:text-sm"
              >
                <LogIn className="size-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}

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
                onChange={(e) => handleSearchChange(e.target.value)}
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
            <div className="mt-3 flex gap-2">
              <Link
                to="/submit"
                onClick={() => setMobileMenu(false)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="size-3.5" /> Submit
              </Link>
              {authUser ? (
                <button
                  onClick={() => { handleSignOut(); setMobileMenu(false); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="size-3.5" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { handleSignIn(); setMobileMenu(false); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium"
                >
                  <LogIn className="size-3.5" /> Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="relative mx-auto max-w-[1480px] px-4 py-12 text-center sm:py-16 lg:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
            🔍 The AI Discovery Engine
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Discover The Best{" "}
            <span className="gradient-text">AI Websites</span>
            <br />
            & Tools
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {catalogLoaded ? (
              <>
                {totalTools.toLocaleString()} AIs and {categories.length} categories in the best AI tools directory.
                Updated daily.
              </>
            ) : (
              <>
                <span className="mb-skeleton" style={{ width: "3ch", display: "inline-block", height: "1.2em", verticalAlign: "text-bottom" }}>&nbsp;</span>{" "}
                AIs and{" "}
                <span className="mb-skeleton" style={{ width: "2ch", display: "inline-block", height: "1.2em", verticalAlign: "text-bottom" }}>&nbsp;</span>{" "}
                categories in the best AI tools directory. Updated daily.
              </>
            )}
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by AI, e.g Video Translation AI Tool"
                className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 shadow-sm"
              />
            </div>
            <Button
              variant="brand"
              size="lg"
              onClick={() => {
                if (query) scrollToResults();
              }}
              className="h-12 rounded-xl px-8 shadow-sm"
            >
              <Search className="size-4" /> Search
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-6 sm:gap-10">
            {[
              {
                value: catalogLoaded ? `${(totalTools / 1000).toFixed(0)}K+` : null,
                label: "AI Tools",
                skeletonWidth: "4ch",
              },
              {
                value: catalogLoaded ? `${categories.length}` : null,
                label: "Categories",
                skeletonWidth: "3ch",
              },
              { value: "Daily", label: "Updates", skeletonWidth: "4ch" },
              { value: "Free", label: "To Use", skeletonWidth: "3ch" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-extrabold sm:text-2xl">
                  {stat.value !== null ? (
                    stat.value
                  ) : (
                    <span
                      className="mb-skeleton"
                      style={{ width: stat.skeletonWidth, height: "1em", display: "inline-block" }}
                    >
                      &nbsp;
                    </span>
                  )}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">{stat.label}</div>
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
          {catalogLoaded ? (
            <>
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
            </>
          ) : (
            // Skeleton chip placeholders while catalog loads
            Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="mb-skeleton shrink-0 rounded-full"
                style={{ width: `${60 + (i % 4) * 24}px`, height: "1.6em", display: "inline-block" }}
                aria-hidden="true"
              >
                &nbsp;
              </span>
            ))
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
                <h2 className="flex items-center gap-2.5 text-sm font-bold">
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
                    <ToolIcon name={ad.n} url={ad.u} small />
                    <div>
                      <p className="text-sm font-semibold">{ad.n}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Verified partner</p>
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
              {["All", "Free", "Free Plan", "Free Trial", "Paid"].map((item) => (
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
          <div className="mb-4">
            <h2 className="text-lg font-bold sm:text-xl">
              {query
                ? `Results for "${query}"`
                : activeCategory !== "All"
                  ? `${catalog.categoryEmojis?.[activeCategory] || "🤖"} ${activeCategory.replace("Free ", "")}`
                  : "🔥 Latest AI Tools"}
            </h2>
          </div>

          {/* Loading indicator when filters change */}
          {searchLoading && catalogLoaded && (
            <div className="mb-4 flex items-center justify-center gap-3 rounded-xl border border-primary/20 bg-primary/5 py-5">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium text-primary">Updating tools...</span>
            </div>
          )}

          {/* Tool Cards Grid */}
          {!catalogLoaded || searchLoading ? (
            <ToolCardSkeletons />
          ) : results.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((tool, index) => (
                <ToolCard
                  key={`${tool.n}-${tool.c}-${index}`}
                  tool={tool}
                  saved={savedTools.has(tool.n)}
                  onToggleSave={() => toggleSave(tool.n)}
                  featured={!!tool.ex}
                  trending={!!tool.tr}
                  exclusive={!!tool.ex}
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

          {results.length < displayedCount && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="mt-5 w-full"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : `Show more tools (${results.length.toLocaleString()} of ${displayedCount.toLocaleString()})`} <ChevronRight className="size-4" />
              </Button>
              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-1" />
              {/* Loading more indicator */}
              {loadingMore && (
                <div className="mt-3 flex items-center justify-center gap-3 py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-muted-foreground">Loading more tools...</span>
                </div>
              )}
            </>
          )}
          {/* Always render sentinel for IntersectionObserver even when all loaded */}
          {results.length >= displayedCount && <div ref={sentinelRef} className="h-1" />}

          {/* ─── Hidden Gems Section ─── */}
          {!query && activeCategory === "All" && (
            <section className="mt-10">
              <div className="mb-4 flex items-center gap-2">
                <Star className="size-5 text-amber-500" />
                <h2 className="text-lg font-bold">Hidden AI Gems</h2>
                <span className="ml-2 text-xs text-muted-foreground">Underrated, not underpowered</span>
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
                      <ToolIcon name={tool.n} url={tool.u} />
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
              <span className="ml-2 text-xs text-muted-foreground">Latest updates</span>
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
                      <span className="mt-1 block text-[10px] text-muted-foreground">{news.time}</span>
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
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">{news.time}</span>
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
              {catalog.tools
                .filter((t) => t.p === "Free" && t.fl)
                .slice(0, 5)
                .map((tool, i) => (
                <a
                  key={tool.n}
                  href={tool.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  <span className="flex size-5 shrink-0 place-items-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <ToolIcon name={tool.n} url={tool.u} small />
                  <span className="min-w-0 flex-1 truncate font-medium text-xs">{tool.n}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Free</span>
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

      {/* ─── Top Picks (above footer) ─── */}
      {!query && activeCategory === "All" && exclusiveTools.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 lg:px-6 mt-10">
          {/* Top 4 Featured */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Editor's Pick</h2>
            <div className="space-y-3">
              {exclusiveTools.slice(0, 4).map((tool, i) => (
                <ToolCard
                  key={`pick-${tool.n}-${i}`}
                  tool={tool}
                  saved={savedTools.has(tool.n)}
                  onToggleSave={() => toggleSave(tool.n)}
                  featured
                />
              ))}
            </div>
          </div>

          {/* More recommended tools */}
          {exclusiveTools.length > 4 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Recommended</h2>
              <div className="space-y-3">
                {exclusiveTools.slice(4).map((tool, i) => (
                  <ToolCard
                    key={`rec-${tool.n}-${i}`}
                    tool={tool}
                    saved={savedTools.has(tool.n)}
                    onToggleSave={() => toggleSave(tool.n)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

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
                  { label: "AI News", href: "#", external: false },
                  { label: "University", href: "/university", external: false },
                  { label: "Blog", href: "https://markbookai.blogspot.com/", external: true },
                  { label: "Submit Tool", href: "/submit", external: false },
                  { label: "Advertise", href: "/advertise", external: false },
                  { label: "Ranking", href: "/ranking", external: false },
                ].map((item) => item.external ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary">
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.href} className="block text-sm text-muted-foreground hover:text-primary">
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
    </div>
  );
}

/* ─── Shared Components ─────────────────────────────────────── */

function extractDomain(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

// Logo source stages: 0=icon.horse, 1=Google favicon, 2=DuckDuckGo, -1=all failed
const logoCache = new Map<string, number>();

function ToolIcon({ name, url, small = false }: { name: string; url?: string; small?: boolean }) {
  const gradient = getToolGradient(name);
  const domain = url ? extractDomain(url) : null;
  const cacheKey = domain || "";
  const cached = cacheKey ? logoCache.get(cacheKey) : undefined;

  const [stage, setStage] = useState<number>(cached !== undefined ? cached : domain ? 0 : -1);
  const [loaded, setLoaded] = useState(false);

  const getLogoSrc = useCallback((dom: string, s: number): string | null => {
    if (s === 0) return `https://icon.horse/icon/${dom}`;
    if (s === 1) return `https://www.google.com/s2/favicons?domain=${dom}&sz=64`;
    if (s === 2) return `https://icons.duckduckgo.com/ip3/${dom}.ico`;
    return null;
  }, []);

  const handleError = useCallback(() => {
    const nextStage = stage + 1;
    if (nextStage <= 2) {
      if (cacheKey) logoCache.set(cacheKey, nextStage);
      setStage(nextStage);
      setLoaded(false);
    } else {
      // All sources failed — show clean initials fallback immediately
      if (cacheKey) logoCache.set(cacheKey, -1);
      setStage(-1);
    }
  }, [stage, cacheKey]);

  const handleLoad = useCallback(() => {
    if (cacheKey) logoCache.set(cacheKey, stage);
    setLoaded(true);
  }, [stage, cacheKey]);

  const currentSrc = domain ? getLogoSrc(domain, stage) : null;

  // All sources failed or no domain — show gradient initials (original design)
  if (stage === -1 || !currentSrc) {
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

  // Show logo inside a clean square matching original design
  const pxSize = small ? 32 : 40;
  return (
    <span
      className="shrink-0 overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-sm"
      style={{ display: "inline-flex", position: "relative", width: pxSize, height: pxSize }}
    >
      {/* Loading placeholder — muted, pulsing so it doesn't look like the real logo is already loaded */}
      <span
        className={`absolute inset-0 grid place-items-center rounded-lg bg-muted/30 dark:bg-muted/20 transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100 animate-pulse"
        }`}
      >
        <img
          src={logoAsset.url}
          alt=""
          aria-hidden="true"
          className="size-full object-contain opacity-40 grayscale"
        />
      </span>
      {/* Real logo image — fills the square cleanly */}
      <img
        src={currentSrc}
        alt={name}
        width={pxSize}
        height={pxSize}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className="absolute inset-0 z-10 size-full object-contain p-[3px]"
      />
    </span>
  );
}

/** Generate hashtags from tool data for the algorithm feature. */
const HASHTAG_KEYWORDS = [
  "chatbot", "image", "video", "audio", "music", "voice", "code", "writing", "design",
  "photo", "art", "3d", "animation", "seo", "marketing", "email", "productivity", "automation",
  "translation", "transcription", "resume", "presentation", "social media", "chat", "assistant",
  "generator", "editor", "analyzer", "detector", "classifier", "summarizer", "rephraser",
  "robotics", "healthcare", "finance", "education", "gaming", "fashion", "interior",
  "ecommerce", "customer support", "data", "machine learning", "deep learning", "nlp",
  "computer vision", "speech", "text to speech", "ocr", "pdf", "excel", "spreadsheet",
  "database", "api", "cloud", "devops", "security", "privacy", "compliance",
  "free", "open source", "no code", "low code", "plugin", "extension", "mobile",
  "desktop", "web app", "saas", "enterprise", "startup", "freelance",
];

function generateHashtags(tool: Tool): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  const lower = tool.d.toLowerCase();

  // Extract matching keywords from description
  for (const kw of HASHTAG_KEYWORDS) {
    if (lower.includes(kw) && !seen.has(kw)) {
      seen.add(kw);
      tags.push(kw);
      if (tags.length >= 3) break;
    }
  }

  // If fewer than 2 tags, extract from category name
  if (tags.length < 2) {
    const catWords = tool.c.toLowerCase().replace(/^ai\s*/i, "").split(/\s+/);
    for (const w of catWords) {
      if (w.length > 2 && !seen.has(w)) {
        seen.add(w);
        tags.push(w);
        if (tags.length >= 3) break;
      }
    }
  }

  // If still fewer than 2, extract from group name
  if (tags.length < 2 && tool.g && tool.g !== tool.c) {
    const groupWords = tool.g.toLowerCase().replace(/^ai\s*/i, "").replace(/^free\s*/i, "").split(/\s+/);
    for (const w of groupWords) {
      if (w.length > 2 && !seen.has(w)) {
        seen.add(w);
        tags.push(w);
        if (tags.length >= 3) break;
      }
    }
  }

  return tags.slice(0, 3);
}

function ToolCard({
  tool,
  saved,
  onToggleSave,
  featured = false,
  trending = false,
  exclusive = false,
}: {
  tool: Tool;
  saved: boolean;
  onToggleSave: () => void;
  featured?: boolean;
  trending?: boolean;
  exclusive?: boolean;
}) {
  const hashtags = useMemo(() => generateHashtags(tool), [tool.n, tool.d, tool.c, tool.g]);

  const cardStyle: React.CSSProperties = exclusive
    ? {
        backgroundImage: "url('/holographic-card.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <article
      style={cardStyle}
      className={`tool-lift flex min-w-0 flex-col rounded-xl border p-4 ${
        exclusive
          ? "border-fuchsia-400/40 ring-1 ring-fuchsia-400/30 shadow-[0_0_24px_-12px_rgba(217,70,239,0.45)]"
          : `border-border bg-card ${featured ? "ring-1 ring-primary/20" : ""}`
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <a href={tool.u} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <ToolIcon name={tool.n} url={tool.u} />
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <a href={tool.u} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <h3 className={`truncate font-semibold text-sm ${exclusive ? "text-white drop-shadow" : ""}`}>{tool.n}</h3>
            </a>
            {exclusive && (
              <span className="shrink-0 rounded-md bg-gradient-to-r from-fuchsia-500 to-violet-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                Exclusive
              </span>
            )}
            {trending && (
              <span className="shrink-0 rounded-md bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                Trending
              </span>
            )}
            {(() => {
              const style = PRICING_STYLES[tool.p];
              if (!style) return null;
              return (
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${style.bg} ${style.text}`}>
                  {tool.fl && !tool.fl.startsWith("http") ? tool.fl : style.label}
                </span>
              );
            })()}
          </div>
          <p className={`mt-1 truncate text-xs ${exclusive ? "text-white/85" : "text-muted-foreground"}`}>{tool.c}</p>
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
      <p className="my-3 min-h-8 text-sm leading-5 text-muted-foreground" style={{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",wordBreak:"break-word",overflowWrap:"break-word"}}>{tool.d}</p>
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {hashtags.map((tag) => (
            <span key={tag} className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary/70">
              #{tag}
            </span>
          ))}
        </div>
      )}
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
        <a href={tool.u} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10">
            Visit <ExternalLink className="size-3" />
          </span>
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

/** Skeleton placeholder grid shown while the AI catalog JSON is still being fetched. */
function ToolCardSkeletons() {
  // Render 6 skeleton cards matching the layout of ToolCard
  const cards = Array.from({ length: 6 });
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
      {cards.map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-3 flex gap-3 items-start"
        >
          {/* Icon placeholder */}
          <div
            className="mb-skeleton shrink-0 rounded-lg"
            style={{ width: "44px", height: "44px", display: "block" }}
          >
            &nbsp;
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title + pricing badge row */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="mb-skeleton"
                style={{ width: "45%", height: "1em", display: "inline-block" }}
              >
                &nbsp;
              </span>
              <span
                className="mb-skeleton"
                style={{ width: "3ch", height: "1em", display: "inline-block" }}
              >
                &nbsp;
              </span>
            </div>
            {/* Description line 1 */}
            <span
              className="mb-skeleton"
              style={{ width: "92%", height: "0.9em", display: "inline-block" }}
            >
              &nbsp;
            </span>
            {/* Description line 2 */}
            <span
              className="mb-skeleton"
              style={{ width: "70%", height: "0.9em", display: "inline-block" }}
            >
              &nbsp;
            </span>
            {/* Footer: category + visit button */}
            <div className="flex items-center justify-between pt-1">
              <span
                className="mb-skeleton"
                style={{ width: "8ch", height: "0.9em", display: "inline-block" }}
              >
                &nbsp;
              </span>
              <span
                className="mb-skeleton"
                style={{ width: "5ch", height: "0.9em", display: "inline-block" }}
              >
                &nbsp;
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
