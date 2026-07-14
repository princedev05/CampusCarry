import { Activity, BarChart3, LayoutDashboard, UsersRound } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const links = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/all-orders", label: "All Orders", icon: Activity },
  { to: "/admin/users", label: "Users", icon: UsersRound },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminDashboard() {
  return <DashboardLayout title="Admin Dashboard" links={links} />;
}
