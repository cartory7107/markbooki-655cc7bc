# Vercel deployment

This is a TanStack Start application built with Nitro's `vercel` preset. The
build writes a complete Vercel Build Output API bundle to `.vercel/output`,
including the server function that handles direct requests to application
routes such as `/auth`, `/signin`, and `/signup`.

Do **not** configure Vercel's Output Directory as `.vercel/output/static`.
Doing so deploys only the static assets and bypasses the server function,
which causes deep links to return Vercel 404 responses. The committed
`vercel.json` deliberately leaves `outputDirectory` unset so Vercel uses the
complete Build Output API bundle.

## Required Vercel environment variables

Set these for **Production**, **Preview**, and **Development** as appropriate:

| Variable                        | Purpose                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Supabase project URL used by the browser client.                                  |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key used by the browser client.                       |
| `VITE_SITE_URL`                 | Canonical production URL, for example `https://markbook.top`.                     |
| `SUPABASE_URL`                  | Server runtime Supabase URL, needed by server-side features.                      |
| `SUPABASE_PUBLISHABLE_KEY`      | Server runtime publishable key.                                                   |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only key for server administration features; never prefix it with `VITE_`. |

## Google sign-in

1. In Supabase **Authentication → Providers → Google**, enable Google and set
   the Google Client ID and Client Secret. Keep the secret in Supabase only.
2. In Google Cloud Console, add this authorized redirect URI:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. In Supabase **Authentication → URL Configuration**, add each deployed
   origin to Redirect URLs, including the production domain and any Vercel
   preview domain where sign-in is tested.

## Domain errors

`NXDOMAIN` / “domain unavailable” errors occur before the application receives
the request, so they cannot be fixed in React. In Vercel, add the domain under
**Project → Settings → Domains**, then update the DNS records at the domain
registrar to the exact records Vercel shows. Wait for DNS propagation before
testing the sign-in route.
