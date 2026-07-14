import { toTitleCase } from "../utils/format";

const colorByStatus = {
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  arrived: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  collected: "bg-slate-500/20 text-slate-200 border-slate-400/30",
  completed: "bg-green-500/10 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-300 border-red-500/30",
  verified: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  token_assigned: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
};

const dotByStatus = {
  pending: "bg-yellow-400",
  arrived: "bg-[var(--success)]",
  collected: "bg-slate-300",
  completed: "bg-green-400",
  cancelled: "bg-[var(--danger)]",
  verified: "bg-sky-400",
  token_assigned: "bg-cyan-400",
};

export default function Badge({ status }) {
  const key = (status || "pending").toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${colorByStatus[key] || colorByStatus.pending}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotByStatus[key] || dotByStatus.pending}`} />
      {toTitleCase(key)}
    </span>
  );
}
