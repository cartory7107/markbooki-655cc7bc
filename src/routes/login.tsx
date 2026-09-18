import { createFileRoute, redirect } from "@tanstack/react-router";

// Safety net: older links/bookmarks pointing to /login should land on /auth
// instead of a 404.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/auth", replace: true });
  },
});
