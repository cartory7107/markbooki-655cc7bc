import { createFileRoute, redirect } from "@tanstack/react-router";

// Sign-up uses the same Google flow — send users to the unified /auth page.
export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/auth", replace: true });
  },
});
