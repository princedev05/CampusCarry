import { BadgeInfo, CheckCircle2, ListChecks } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const links = [
  {
    to: "/guard/pending-deliveries",
    label: "Pending Deliveries",
    icon: ListChecks,
  },
  { to: "/guard/handover", label: "Handover Parcel", icon: CheckCircle2 },
  { to: "/guard/about", label: "About", icon: BadgeInfo },
];

export default function GuardDashboard() {
  return <DashboardLayout title="Guard Dashboard" links={links} />;
}
