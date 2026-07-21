import { toTitleCase } from "../utils/format";

const colorByStatus = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/80 shadow-2xs font-semibold",
  arrived: "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-2xs font-semibold",
  collected: "bg-slate-100 text-slate-700 border-slate-200/80 shadow-2xs font-semibold",
  completed: "bg-teal-50 text-teal-700 border-teal-200/80 shadow-2xs font-semibold",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200/80 shadow-2xs font-semibold",
  verified: "bg-sky-50 text-sky-700 border-sky-200/80 shadow-2xs font-semibold",
  token_assigned: "bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-2xs font-semibold",
};

const dotByStatus = {
  pending: "bg-amber-500",
  arrived: "bg-emerald-500",
  collected: "bg-slate-500",
  completed: "bg-teal-500",
  cancelled: "bg-rose-500",
  verified: "bg-sky-500",
  token_assigned: "bg-indigo-500",
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
