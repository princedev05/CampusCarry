import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import Button from "./Button";

export default function Sidebar({ title, links, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/80 bg-white p-6 transition-transform duration-300 md:static md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-3 py-1 border border-indigo-100/80">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CampusCarry</p>
          </div>
          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">{title}</h2>
        </div>

        <nav className="space-y-1.5">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition duration-200 ${
                  isActive
                    ? "border-indigo-200/80 bg-indigo-50/80 text-indigo-700 shadow-2xs"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon size={18} className="text-slate-500 group-hover:text-indigo-600" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 border-t border-slate-200 pt-5">
          <Button variant="ghost" className="w-full justify-center text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200" onClick={onLogout}>
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
