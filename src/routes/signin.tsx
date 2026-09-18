import { createFileRoute, redirect } from "@tanstack/react-router";

// Safety net: legacy /signin links redirect to the dedicated /auth page.
export const Route = createFileRoute("/signin")({
  beforeLoad: () => {
    throw redirect({ to: "/auth", replace: true });
  },
});
