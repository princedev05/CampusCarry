import { ClipboardList, PlusSquare, UserRound } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const links = [
  { to: "/student/my-orders", label: "My Orders", icon: ClipboardList },
  { to: "/student/create-order", label: "Create Order", icon: PlusSquare },
  { to: "/student/profile", label: "Profile", icon: UserRound },
];

export default function StudentDashboard() {
  return <DashboardLayout title="Student Dashboard" links={links} />;
}
