import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Check, Megaphone, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise on MarkBook" },
      {
        name: "description",
        content:
          "Reach people actively researching and buying AI tools with premium MarkBook placements.",
      },
      { property: "og:title", content: "Advertise on MarkBook" },
      {
        property: "og:description",
        content: "Put your AI product in front of high-intent customers.",
      },
    ],
  }),
  component: AdvertisePage,
});

function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);
  if (submitted)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-lg">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold">Campaign received.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Our team will verify your AI tool and contact you with payment details before anything goes live.
          </p>
          <Button variant="brand" className="mt-7" asChild>
            <Link to="/">Back to MarkBook</Link>
          </Button>
        </div>
      </main>
    );
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/"><ArrowLeft className="size-4" /> Back to discovery</Link>
        </Button>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white sm:p-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
              <Megaphone className="size-6" />
            </span>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              Advertise on MarkBook
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              Meet users while they're choosing their next AI tool.
            </h1>
            <p className="mt-5 leading-7 text-white/65">
              Premium, context-aware placements built for trust — not interruption.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Sidebar sponsored placement",
                "Featured AI placement",
                "Homepage promotion",
                "Category page spotlight",
                "Manual review before launch",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="grid size-5 place-items-center rounded-full bg-white/20">
                    <Check className="size-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-10"
          >
            <h2 className="text-xl font-extrabold">Create your campaign</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us about your product. All campaigns are manually verified.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required />
              <Field label="Email address" type="email" required />
              <Field label="AI tool name" required />
              <Field label="AI website URL" type="url" required />
              <div className="sm:col-span-2">
                <Field label="Advertisement title" required />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">
                  Advertisement description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
              <Field label="WhatsApp number (optional)" />
              <Field label="Telegram username (optional)" />
            </div>
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-semibold">Placement</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {["Sidebar", "Featured AI", "Homepage"].map((p) => (
                  <label
                    key={p}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm hover:bg-accent"
                  >
                    <input required type="radio" name="placement" className="accent-primary" />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 rounded-xl bg-muted p-4 text-sm">
              <b>Payment:</b> Manual payment confirmation for MVP. No charge is collected on this
              form.
            </div>
            <Button type="submit" variant="brand" size="lg" className="mt-6 w-full">
              <Zap className="size-4" /> Submit for review
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  type = "text",
  required = false,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        required={required}
        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );
}
