import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; auth: { user: User | null } }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MarkBook — Discover 56,000+ AI Tools | Best AI Tools Directory 2025" },
      {
        name: "description",
        content:
          "MarkBook is the largest AI tools directory with 56,000+ AI tools across 500+ categories. Compare AI chatbots, image generators, video generators, code assistants, writing tools, and more. Free and paid options. Updated daily.",
      },
      {
        name: "keywords",
        content:
          "AI tools, AI tools directory, best AI tools 2025, free AI tools, AI chatbot, AI image generator, AI video generator, AI code assistant, AI writing tool, AI music generator, AI voice generator, AI search engine, AI assistant, AI directory, MarkBook, AI tools list, AI tools comparison, AI software, AI applications, ChatGPT alternatives, Midjourney alternatives, Claude alternatives, Gemini alternatives, AI tools for students, AI tools for business, AI tools for developers, AI tools for content creators, AI tools for designers, generative AI tools, machine learning tools, artificial intelligence tools, AI dictionary, AI encyclopedia",
      },
      { name: "author", content: "MarkBook" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "MarkBook — Discover 56,000+ AI Tools | Best AI Tools Directory" },
      { property: "og:description", content: "The largest AI tools directory with 56,000+ tools. Compare AI chatbots, image generators, video tools, code assistants, and more. Updated daily." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MarkBook AI" },
      { property: "og:url", content: "https://markbook.cartory.top" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MarkBook — Discover 56,000+ AI Tools | Best AI Directory 2025" },
      { name: "twitter:description", content: "The largest AI tools directory with 56,000+ tools. Compare AI chatbots, image generators, video tools, code assistants, and more." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a275fbaf-5ddc-4670-af3f-7acd2fb5ba96/id-preview-720f0fb0--8e43dfa5-a610-4d28-8e20-67a5e9c1fb1e.lovable.app-1781479066010.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a275fbaf-5ddc-4670-af3f-7acd2fb5ba96/id-preview-720f0fb0--8e43dfa5-a610-4d28-8e20-67a5e9c1fb1e.lovable.app-1781479066010.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "https://markbook.cartory.top" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://icon.horse" },
      { rel: "preconnect", href: "https://www.google.com" },
      { rel: "preconnect", href: "https://icons.duckduckgo.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MarkBook AI",
          "url": "https://markbook.cartory.top",
          "description": "The largest AI tools directory with 56,000+ AI tools across 500+ categories.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://markbook.cartory.top/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "MarkBook",
            "logo": { "@type": "ImageObject", "url": "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a275fbaf-5ddc-4670-af3f-7acd2fb5ba96/id-preview-720f0fb0--8e43dfa5-a610-4d28-8e20-67a5e9c1fb1e.lovable.app-1781479066010.png" }
          }
        }),
      },
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "MarkBook AI Tools Directory",
          "description": "A comprehensive directory of 56,000+ AI tools spanning 500+ categories, including pricing, descriptions, categories, and direct links.",
          "url": "https://markbook.cartory.top/tools-dictionary.json",
          "creator": { "@type": "Organization", "name": "MarkBook" },
          "distribution": { "@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": "https://markbook.cartory.top/tools-dictionary.json" },
          "temporalCoverage": "2024/2025",
          "spatialCoverage": "Worldwide"
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              <div id="mb-initial-loader" aria-hidden="true">
                <div class="mb-loader-logo">Mark<span class="mb-accent">Book</span></div>
                <div class="mb-loader-bars" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
              </div>
              <script>(function(){var l=document.getElementById('mb-initial-loader');if(!l)return;function h(){if(!l)return;l.classList.add('mb-hide');setTimeout(function(){l&&l.parentNode&&l.parentNode.removeChild(l);},150);}window.__mbHideLoader=h;setTimeout(h,900);})();</script>
            `,
          }}
        />
        {children}
        <Scripts />


      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__mbHideLoader) {
      (window as any).__mbHideLoader();
    }
  }, []);

  useEffect(() => {

    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        supabase.auth.getUser().then(({ data, error }) => {
          if (!error) setUser(data.user);
        });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
