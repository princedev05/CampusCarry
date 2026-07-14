import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
      <Inbox className="mb-3 text-[var(--muted)]" size={28} />
      <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
