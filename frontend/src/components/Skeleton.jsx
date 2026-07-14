export function SkeletonRow() {
  return (
    <div className="grid animate-pulse grid-cols-6 gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="h-5 rounded bg-[var(--surface-2)]" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)]" />;
}
