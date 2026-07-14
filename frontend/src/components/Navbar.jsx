import { Menu } from "lucide-react";

export default function Navbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-2 text-[var(--text)] md:hidden"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-base font-semibold tracking-wide text-[var(--text)]">{title}</h1>
        </div>
      </div>
    </header>
  );
}
