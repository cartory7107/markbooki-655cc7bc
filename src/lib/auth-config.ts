// Centralized Google OAuth configuration — single source of truth for
// all sign-in call sites (auth.tsx, index.tsx, profile.tsx, submit.tsx).
//
// WHERE THE SECRETS LIVE (important):
//   - GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are configured SERVER-SIDE in
//     the Supabase / Lovable Cloud dashboard:
//       Lovable Cloud → Authentication → Providers → Google → enable + paste
//     (or supabase.com dashboard → your project → Authentication → Providers)
//   - The secret must NEVER be placed in frontend code — the OAuth token
//     exchange happens server-to-server between Supabase and Google.
//
// REDIRECT URLs TO REGISTER:
//   1. Google Cloud Console → Credentials → your OAuth 2.0 Client:
//        https://aqonvdypfdrhusdoizpq.supabase.co/auth/v1/callback
//   2. Supabase dashboard → Authentication → URL Configuration → Redirect URLs:
//        https://markbook.top
//        https://markbook.top/profile
//        https://markbook.top/submit
//        http://localhost:8080          (local dev)

/** The production site URL, set in .env as VITE_SITE_URL. */
export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://markbook.top";

/**
 * Google OAuth Client ID (public identifier — safe to expose).
 * The Client SECRET is server-side only: configure it in
 * Lovable Cloud / Supabase dashboard → Authentication → Providers → Google.
 */
export const GOOGLE_CLIENT_ID: string =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ??
  "13710800504-c1u29vvlc62vkm12deruf69rqeg0b2k4.apps.googleusercontent.com";

/**
 * Resolve the OAuth redirect URI for a given in-app path.
 * Uses the current origin in the browser (so localhost works in dev,
 * markbook.top in production), falling back to SITE_URL during SSR.
 *
 * @param path Optional in-app path to return to after sign-in (e.g. "/profile")
 */
export function getOAuthRedirectUri(path = ""): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin + path;
  }
  return SITE_URL + path;
}
