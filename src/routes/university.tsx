import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, BookOpen } from "lucide-react";
import logoAsset from "@/assets/markbook-symbol-clean.png.asset.json";

const blogPosts = [
  {
    title: "Best AI Research Tools in 2026 — How to Find & Use Them",
    url: "https://markbookai.blogspot.com/2026/06/best-ai-research-tools-in-2026-how-to.html",
    date: "Jun 2026",
    category: "AI Research",
    emoji: "🔬",
  },
];

/**
 * MarkBook University — blog articles, guides, and AI education resources.
 */
export const Route = createFileRoute("/university")({
  head: () => ({
    meta: [
      {
        title: "MarkBook University — AI Guides, Tutorials & Research | MarkBook",
      },
      {
        name: "description",
        content:
          "MarkBook University is your free AI education hub. Read expert guides, tutorials, and research articles about the best AI tools, how to use AI effectively, and stay updated with the latest in artificial intelligence.",
      },
      {
        name: "keywords",
        content:
          "MarkBook University, AI guides, AI tutorials, AI research, learn AI, AI education, how to use AI tools, best AI tools guide, AI blog, AI articles, artificial intelligence tutorials, MarkBook blog",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "MarkBook University — AI Guides, Tutorials & Research" },
      { property: "og:description", content: "Free AI education hub by MarkBook. Expert guides, tutorials, and research articles." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://markbook.top/university" },
      { property: "og:image", content: "https://markbook.top/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MarkBook University — AI Guides, Tutorials & Research" },
      { name: "twitter:description", content: "Free AI education hub by MarkBook." },
      { rel: "canonical", href: "https://markbook.top/university" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "MarkBook University",
          "url": "https://markbook.top/university",
          "description": "Free AI education hub with expert guides, tutorials, and research articles.",
          "publisher": {
            "@type": "Organization",
            "name": "MarkBook",
            "url": "https://markbook.top",
            "logo": { "@type": "ImageObject", "url": "https://markbook.top/favicon.png" },
          },
          "blogPost": blogPosts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "url": post.url,
            "datePublished": post.date,
            "author": { "@type": "Organization", "name": "MarkBook" },
          })),
        }),
      },
    ],
  }),
  component: UniversityPage,
});

function UniversityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-[1480px] items-center gap-2 px-4 lg:h-16">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="MarkBook home">
            <img src={logoAsset.url} alt="MarkBook" className="h-8 w-8 object-contain" />
            <span className="text-lg font-extrabold tracking-tight hidden sm:inline">
              Mark<span className="gradient-text">Book</span>
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/ranking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ranking
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="size-4" />
            MarkBook University
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Learn AI the <span className="gradient-text">Right Way</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Free guides, tutorials, and research articles to help you master AI tools.
            Written by the MarkBook team and updated regularly.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="mb-6 text-lg font-bold">Latest Articles</h2>
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-lg">
                  {post.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-sm leading-5 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </div>
                <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
            <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
            <h3 className="text-lg font-bold">Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New articles and guides are being written. Check back soon!
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-bold">Explore 116,000+ AI Tools</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Put your knowledge into practice — discover the best AI tools on MarkBook.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse AI Tools <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card">
        <div className="mx-auto max-w-[1480px] px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MarkBook. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}