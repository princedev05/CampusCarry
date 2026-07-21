export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p> : null}
    </div>
  );
}
