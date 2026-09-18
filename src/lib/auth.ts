// Direct Supabase authentication — no Lovable gateway involved.
// Works identically on any host (Vercel, Netlify, self-hosted).
import { supabase } from "@/integrations/supabase/client";
import { getOAuthRedirectUri } from "@/lib/auth-config";

type SignInResult =
  | { ok: true }
  | { ok: false; error: Error };

/**
 * Start Google OAuth via Supabase's server-side flow:
 * browser → Supabase /auth/v1/authorize?provider=google → Google consent →
 * Supabase /auth/v1/callback → redirect back to `redirectTo` with session.
 *
 * The Google Client ID + Secret are configured once in the Supabase
 * dashboard (Authentication → Providers → Google) — never in this repo.
 *
 * @param path Optional in-app path to return the user to after sign-in
 *             (e.g. "/profile", "/submit"). Must be whitelisted in
 *             Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export async function signInWithGoogle(path = ""): Promise<SignInResult> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthRedirectUri(path),
      },
    });
    if (error) return { ok: false, error };
    // supabase-js redirects the browser to Google automatically.
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e : new Error(String(e)),
    };
  }
}

/** Sign the current user out (client session + Supabase). */
export async function signOut() {
  await supabase.auth.signOut();
}
