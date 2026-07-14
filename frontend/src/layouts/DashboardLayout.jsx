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
    <div className="min-h-screen bg-[var(--bg)] bg-[radial-gradient(circle_at_20%_20%,rgba(240,192,64,0.07),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(61,214,172,0.08),transparent_25%),radial-gradient(circle_at_70%_80%,rgba(255,90,90,0.06),transparent_25%)] text-[var(--text)]">
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
