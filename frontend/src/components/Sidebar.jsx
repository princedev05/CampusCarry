import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import Button from "./Button";

export default function Sidebar({ title, links, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--border)] bg-[var(--surface)] p-5 transition-transform duration-300 md:static md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">CampusCarry</p>
          <h2 className="mt-2 text-xl font-bold text-[var(--text)]">{title}</h2>
        </div>

        <nav className="space-y-2">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition duration-200 ${
                  isActive
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-transparent text-[var(--text)] hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 border-t border-[var(--border)] pt-5">
          <Button variant="ghost" className="w-full justify-center" onClick={onLogout}>
            <span className="inline-flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
}
