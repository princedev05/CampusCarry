import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] bg-[radial-gradient(circle_at_20%_20%,rgba(240,192,64,0.09),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(61,214,172,0.08),transparent_25%),radial-gradient(circle_at_70%_80%,rgba(255,90,90,0.06),transparent_25%)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
          CampusCarry
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[var(--text)]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-5 text-sm text-[var(--muted)]">{footer}</div> : null}
      </div>
    </div>
  );
}
