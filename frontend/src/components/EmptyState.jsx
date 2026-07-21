import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-2xs">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-indigo-600">
        <Inbox size={22} />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
