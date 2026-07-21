import { Menu } from "lucide-react";

export default function Navbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-base font-bold tracking-tight text-slate-800">{title}</h1>
        </div>
      </div>
    </header>
  );
}
