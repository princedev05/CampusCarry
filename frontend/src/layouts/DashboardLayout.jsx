import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, links }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.06),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.06),transparent_25%),radial-gradient(circle_at_60%_85%,rgba(244,63,94,0.05),transparent_30%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar
          title={title}
          links={links}
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
