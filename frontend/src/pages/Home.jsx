import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Package, ShieldCheck, BarChart3, Clock, Lock, Sparkles } from "lucide-react";

const STEPS = [
  { label: "Request created", color: "bg-indigo-500" },
  { label: "At main gate", color: "bg-sky-500" },
  { label: "Guard verifies", color: "bg-amber-500" },
  { label: "Token scanned", color: "bg-purple-500" },
  { label: "Delivered", color: "bg-emerald-500" },
];

const FEATURES = [
  {
    title: "For Students",
    description: "Create delivery requests, track parcels, and generate pickup tokens.",
    icon: Package,
    badgeBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    title: "For Guards",
    description: "Verify deliveries, scan tokens, and manage secure handovers.",
    icon: ShieldCheck,
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "For Admins",
    description: "Monitor operations, manage users, and view system analytics.",
    icon: BarChart3,
    badgeBg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    title: "Real-Time Tracking",
    description: "Follow parcels from submission through delivery with live status updates.",
    icon: Clock,
    badgeBg: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    title: "Secure Verification",
    description: "Email verification, token-based access, and role-based controls.",
    icon: Lock,
    badgeBg: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    title: "Analytics Dashboard",
    description: "Insights into delivery patterns, user activity, and performance.",
    icon: Sparkles,
    badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CampusCarry</span>
          </div>
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
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs">
            <Sparkles size={14} className="text-indigo-600" />
            Modern Campus Parcel Management
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 leading-tight">
            Simple, secure parcel management
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
            Streamline deliveries between students, guards, and admins on your campus with zero friction.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="px-8 shadow-md shadow-indigo-200">Get started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-slate-200/80 py-16">
          <h2 className="mb-10 text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
            How it works
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-0">
            {STEPS.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center px-4 sm:px-6">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white text-sm font-bold shadow-xs ${step.color}`}>
                    {idx + 1}
                  </div>
                  <span className="mt-3 max-w-[6rem] text-center text-xs font-semibold text-slate-600">
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="hidden h-0.5 w-10 bg-slate-200 sm:block rounded-full" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200/80 py-16">
          <h2 className="mb-10 text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${feature.badgeBg}`}>
                  <feature.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200/80 py-20 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 p-10 shadow-sm">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 font-medium">
              Join as a student, guard, or admin and manage campus deliveries effortlessly.
            </p>
            <div className="mt-6">
              <Link to="/register">
                <Button size="lg" className="px-8 shadow-md shadow-indigo-200">Create account</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-8 text-center text-xs font-medium text-slate-400">
        © 2026 CampusCarry. All rights reserved.
      </footer>
    </div>
  );
}
