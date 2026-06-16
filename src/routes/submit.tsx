import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Check, Plus, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit Your AI Tool — MarkBook" },
      { name: "description", content: "Submit your AI tool to be listed on MarkBook." },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-lg">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold">Submission received!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Our team will review your AI tool and contact you before it goes live. This usually takes 1-2 business days.
          </p>
          <Button variant="brand" className="mt-7" asChild>
            <Link to="/">Back to MarkBook</Link>
          </Button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/"><ArrowLeft className="size-4" /> Back to discovery</Link>
        </Button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Info Panel */}
          <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white sm:p-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
              <Rocket className="size-6" />
            </span>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              Submit your AI tool
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              Get discovered by thousands of AI enthusiasts.
            </h1>
            <p className="mt-5 leading-7 text-white/65">
              List your tool on MarkBook and reach users actively searching for AI solutions.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Free listing with full details",
                "Category & tag classification",
                "Appears in search & rankings",
                "Manual review for quality",
                "Updated daily in our directory",
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

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-10"
          >
            <div className="flex items-center gap-2 mb-1">
              <Plus className="size-5 text-primary" />
              <h2 className="text-xl font-extrabold">Add your AI tool</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-7">
              Fill in the details below. All submissions are manually reviewed for quality.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tool name" required />
              <Field label="Website URL" type="url" required />
              <Field label="Category" required placeholder="e.g. AI Image Generator" />
              <Field label="Pricing model" required placeholder="Free, Paid, or Freemium" />
              <div className="sm:col-span-2">
                <Field label="Short description" required placeholder="One-line description of your tool" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">
                  Full description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell users what makes your tool special..."
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
              <Field label="Your name" required />
              <Field label="Your email" type="email" required />
              <Field label="Logo URL (optional)" type="url" placeholder="https://example.com/logo.png" />
              <Field label="Tags (optional)" placeholder="e.g. video, image, writing" />
            </div>
            <Button type="submit" variant="brand" size="lg" className="mt-6 w-full">
              <Sparkles className="size-4" /> Submit for review
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
  placeholder,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );
}
