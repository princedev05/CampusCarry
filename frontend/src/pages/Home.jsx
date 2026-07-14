import { Link } from "react-router-dom";
import Button from "../components/Button";

const STEPS = [
  { label: "Request created" },
  { label: "At main gate" },
  { label: "Guard verifies" },
  { label: "Token scanned" },
  { label: "Delivered" },
];

const FEATURES = [
  {
    title: "For Students",
    description: "Create delivery requests, track parcels, and generate pickup tokens.",
  },
  {
    title: "For Guards",
    description: "Verify deliveries, scan tokens, and manage secure handovers.",
  },
  {
    title: "For Admins",
    description: "Monitor operations, manage users, and view system analytics.",
  },
  {
    title: "Real-Time Tracking",
    description: "Follow parcels from submission through delivery with live status updates.",
  },
  {
    title: "Secure Verification",
    description: "Email verification, token-based access, and role-based controls.",
  },
  {
    title: "Analytics Dashboard",
    description: "Insights into delivery patterns, user activity, and performance.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">CampusCarry</span>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6">
        <section className="py-20 text-center sm:py-28">
          <p className="mb-4 text-sm text-[var(--muted)]">Campus parcel delivery</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple, secure parcel management
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)]">
            Streamline deliveries between students, guards, and admins on your campus.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg">Get started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-[var(--border)] py-14">
          <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            How it works
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
            {STEPS.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center px-3 sm:px-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--muted)]">
                    {idx + 1}
                  </div>
                  <span className="mt-2 max-w-[5.5rem] text-center text-xs text-[var(--muted)]">
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="hidden h-px w-8 bg-[var(--border)] sm:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border)] py-14">
          <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Features
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border)] py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
            Join as a student, guard, or admin and manage campus deliveries in one place.
          </p>
          <div className="mt-6">
            <Link to="/register">
              <Button size="lg">Create account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
        © 2026 CampusCarry. All rights reserved.
      </footer>
    </div>
  );
}
