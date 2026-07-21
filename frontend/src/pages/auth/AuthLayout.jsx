import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-indigo-100/50">
        <Link to="/login" className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 border border-indigo-100">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          CampusCarry
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm font-medium text-slate-500">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 border-t border-slate-100 pt-4 text-sm font-medium text-slate-500">{footer}</div> : null}
      </div>
    </div>
  );
}
