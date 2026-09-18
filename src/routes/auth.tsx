import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  GitCompareArrows,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logoAsset from "@/assets/markbook-symbol-clean.png.asset.json";
import { getOAuthRedirectUri } from "@/lib/auth-config";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MarkBook" },
      {
        name: "description",
        content:
          "Sign in to MarkBook with Google to save tools, compare AI solutions side-by-side, and get personalized recommendations.",
      },
    ],
  }),
  component: AuthPage,
});

/* ── Floating tool chips for the brand panel ─────────────────────────────── */
const FLOATING_TOOLS = [
  { name: "ChatGPT", initials: "CG", hue: "from-emerald-400 to-teal-500", top: "12%", left: "8%", delay: "0s", dur: "7s" },
  { name: "Midjourney", initials: "MJ", hue: "from-sky-400 to-indigo-500", top: "22%", left: "68%", delay: "1.2s", dur: "8s" },
  { name: "Gemini", initials: "GM", hue: "from-blue-400 to-violet-500", top: "44%", left: "78%", delay: "0.6s", dur: "7.5s" },
  { name: "Claude", initials: "CL", hue: "from-orange-400 to-amber-500", top: "62%", left: "10%", delay: "1.8s", dur: "8.5s" },
  { name: "Runway", initials: "RW", hue: "from-fuchsia-400 to-pink-500", top: "74%", left: "62%", delay: "0.9s", dur: "7s" },
  { name: "Suno", initials: "SU", hue: "from-rose-400 to-red-500", top: "84%", left: "34%", delay: "2.2s", dur: "9s" },
  { name: "Cursor", initials: "CU", hue: "from-slate-400 to-slate-600", top: "32%", left: "24%", delay: "1.5s", dur: "8s" },
  { name: "Perplexity", initials: "PX", hue: "from-cyan-400 to-sky-500", top: "55%", left: "45%", delay: "0.3s", dur: "7.8s" },
];

const BENEFITS = [
  { icon: Bookmark, text: "Bookmark and organize your favorite AI tools" },
  { icon: GitCompareArrows, text: "Compare tools side-by-side with AI insights" },
  { icon: TrendingUp, text: "Track rankings and get personalized picks" },
];

function GoogleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<{ title: string; detail: string } | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/", replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);
    setError(null);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: getOAuthRedirectUri(),
      });

      if (result.error) {
        const msg = result.error instanceof Error ? result.error.message : String(result.error);
        setError(mapAuthError(msg));
        setSigningIn(false);
        return;
      }

      if (result.redirected) {
        // Browser is navigating to Google — keep the spinner up.
        return;
      }

      // No redirect and no error means an unexpected state — reset.
      setSigningIn(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(mapAuthError(msg));
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Scoped animation keyframes */}
      <style>{`
        @keyframes mb-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mb-float { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-14px) rotate(1.5deg); } }
        @keyframes mb-orb { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(34px,-22px) scale(1.1); } 66% { transform: translate(-24px,18px) scale(0.94); } }
        @keyframes mb-pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .mb-anim-up { animation: mb-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .mb-chip { animation: mb-float var(--mb-dur, 8s) ease-in-out var(--mb-delay, 0s) infinite; }
        .mb-orb { animation: mb-orb 16s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mb-anim-up, .mb-chip, .mb-orb { animation: none !important; }
        }
      `}</style>

      {/* ── Left brand panel (desktop only) ─────────────────────────────── */}
      <div className="relative hidden w-[46%] overflow-hidden bg-[#0A0A18] lg:flex lg:flex-col lg:justify-between">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Gradient orbs */}
        <div className="mb-orb absolute -top-24 -left-24 size-[26rem] rounded-full bg-violet-600/25 blur-[110px]" />
        <div
          className="mb-orb absolute -bottom-32 -right-20 size-[30rem] rounded-full bg-fuchsia-600/20 blur-[120px]"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="mb-orb absolute top-1/3 left-1/2 size-[18rem] rounded-full bg-indigo-500/20 blur-[100px]"
          style={{ animationDelay: "9s" }}
        />

        {/* Floating tool chips */}
        {FLOATING_TOOLS.map((t) => (
          <div
            key={t.name}
            className="mb-chip absolute z-10 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.07] py-2.5 pr-5 pl-2.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md"
            style={{ top: t.top, left: t.left, ["--mb-delay" as string]: t.delay, ["--mb-dur" as string]: t.dur }}
          >
            <span
              className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${t.hue} text-[11px] font-bold tracking-wide text-white shadow-inner`}
            >
              {t.initials}
            </span>
            <span className="text-sm font-semibold text-white/90">{t.name}</span>
          </div>
        ))}

        {/* Top content */}
        <div className="relative z-10 p-12">
          <Link to="/" className="mb-anim-up inline-flex items-center gap-2.5" style={{ animationDelay: "0.05s" }}>
            <img src={logoAsset.url} alt="MarkBook" className="h-9 w-10 object-contain drop-shadow-[0_0_18px_rgba(139,92,246,0.65)]" />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Mark<span className="text-violet-400">Book</span>
            </span>
          </Link>
        </div>

        {/* Middle headline */}
        <div className="relative z-10 max-w-lg px-12">
          <h1 className="mb-anim-up text-[2.6rem] leading-[1.12] font-black tracking-tight text-white" style={{ animationDelay: "0.15s" }}>
            Every AI tool
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>
          <p className="mb-anim-up mt-5 text-[15px] leading-relaxed text-white/60" style={{ animationDelay: "0.25s" }}>
            Join thousands of builders, marketers, and creators discovering the best AI — curated, ranked, and reviewed.
          </p>

          {/* Stats */}
          <div className="mb-anim-up mt-9 flex items-center gap-8" style={{ animationDelay: "0.35s" }}>
            {[
              { value: "116K+", label: "AI tools" },
              { value: "450+", label: "Categories" },
              { value: "100%", label: "Free to use" },
            ].map((s) => (
              <div key={s.label}>
                <div className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-2xl font-extrabold text-transparent">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs font-medium tracking-wide text-white/45 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust line */}
        <div className="relative z-10 flex items-center gap-2 p-12 text-xs text-white/40" style={{ animationDelay: "0.45s" }}>
          <ShieldCheck className="size-4 text-violet-400" />
          <span>Secure sign-in · Your data stays private</span>
        </div>
      </div>

      {/* ── Right sign-in panel ─────────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center px-5 py-12">
        {/* Soft ambient glow behind card */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/8 blur-[130px]" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-anim-up mb-8 flex justify-center lg:hidden" style={{ animationDelay: "0.05s" }}>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={logoAsset.url} alt="MarkBook" className="h-10 w-11 object-contain" />
              <span className="text-2xl font-extrabold tracking-tight">
                Mark<span className="text-brand">Book</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="mb-anim-up rounded-3xl border border-border/70 bg-card/80 p-8 shadow-[0_24px_70px_-24px_rgba(76,29,149,0.28)] backdrop-blur-sm sm:p-10" style={{ animationDelay: "0.15s" }}>
            <div className="mb-anim-up inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-[11px] font-semibold tracking-wide text-brand" style={{ animationDelay: "0.25s" }}>
              <Sparkles className="size-3.5" />
              116,000+ AI tools await
            </div>

            <h1 className="mb-anim-up mt-4 text-[1.7rem] leading-tight font-extrabold tracking-tight" style={{ animationDelay: "0.3s" }}>
              Welcome back
            </h1>
            <p className="mb-anim-up mt-2 text-[15px] leading-relaxed text-muted-foreground" style={{ animationDelay: "0.35s" }}>
              Sign in or create your free account in seconds — no password needed.
            </p>

            {/* Google button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn || loading}
              className="mb-anim-up group mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-white text-[15px] font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ animationDelay: "0.4s" }}
            >
              {signingIn ? (
                <>
                  <span className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                  Redirecting to Google…
                </>
              ) : (
                <>
                  <GoogleIcon className="size-5 transition-transform duration-200 group-hover:scale-110" />
                  Continue with Google
                </>
              )}
            </button>

            {/* Error state */}
            {error && (
              <div className="mb-anim-up mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/60">
                    <Zap className="size-3.5 text-red-600 dark:text-red-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">{error.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-red-700 dark:text-red-300/90">{error.detail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="mb-anim-up mt-8 space-y-3.5 border-t border-border/60 pt-7" style={{ animationDelay: "0.45s" }}>
              {BENEFITS.map((b) => (
                <div key={b.text} className="flex items-center gap-3 text-sm text-foreground/80">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <b.icon className="size-4" />
                  </span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Under-card links */}
          <div className="mb-anim-up mt-6 flex flex-col items-center gap-3 text-center" style={{ animationDelay: "0.55s" }}>
            <p className="text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="font-medium underline decoration-border underline-offset-2 transition-colors hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-medium underline decoration-border underline-offset-2 transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to browsing tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Map raw auth errors to friendly, actionable messages ────────────────── */
function mapAuthError(msg: string): { title: string; detail: string } {
  const m = msg.toLowerCase();

  if (m.includes("provider") && (m.includes("not") || m.includes("disable") || m.includes("unsupported") || m.includes("invalid"))) {
    return {
      title: "Google sign-in isn't enabled on the backend yet",
      detail:
        "One quick step is needed: open Lovable Cloud (or the Supabase dashboard) → Authentication → Providers → Google, then paste the Client ID and Client Secret and save. After that this button works instantly.",
    };
  }
  if (m.includes("redirect") || m.includes("403") || m.includes("url")) {
    return {
      title: "Redirect URL isn't allowed yet",
      detail:
        "In the Supabase dashboard go to Authentication → URL Configuration and add https://markbook.top (plus /profile and /submit). In Google Cloud Console, add https://aqonvdypfdrhusdoizpq.supabase.co/auth/v1/callback as an Authorized redirect URI.",
    };
  }
  if (m.includes("401") || m.includes("unauthorized") || m.includes("client")) {
    return {
      title: "Google credentials rejected",
      detail:
        "The Client ID or Client Secret on the backend doesn't match. Double-check both values in Authentication → Providers → Google, then try again.",
    };
  }
  if (m.includes("network") || m.includes("fetch") || m.includes("failed to")) {
    return {
      title: "Connection problem",
      detail: "We couldn't reach the sign-in service. Check your internet connection and try again in a moment.",
    };
  }
  return {
    title: "Sign-in failed",
    detail: "Something went wrong while starting Google sign-in. Please try again — if it keeps failing, the backend Google provider may still need to be enabled.",
  };
}
