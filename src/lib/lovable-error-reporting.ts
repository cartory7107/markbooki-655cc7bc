// Legacy no-op. This was a Lovable-preview-only telemetry hook; outside the
// Lovable sandbox `window.__lovableEvents` never exists, so it did nothing.
// Kept as a no-op so existing imports keep working — errors are logged to
// the console instead.

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[app-error]", error, context);
}
