export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{title}</p>
      <p className="mt-2 text-3xl font-bold text-[var(--text)]">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p> : null}
    </div>
  );
}
