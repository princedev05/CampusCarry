import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import { adminApi, getErrorMessage } from "../../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [verification, setVerification] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.users();
        const normalized = Array.isArray(data) ? data : data?._id ? [data] : [];
        setUsers(normalized);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const roleMatch = role ? user.role === role : true;
      const verifyMatch =
        verification === ""
          ? true
          : verification === "verified"
            ? Boolean(user.isEmailVerified)
            : !user.isEmailVerified;
      const searchMatch = search
        ? `${user.fullName || ""} ${user.username || ""} ${user.email || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      return roleMatch && verifyMatch && searchMatch;
    });
  }, [users, role, verification, search]);

  const metrics = useMemo(() => {
    const students = filtered.filter((user) => user.role === "student").length;
    const guards = filtered.filter((user) => user.role === "guard").length;
    const admins = filtered.filter((user) => user.role === "admin").length;
    const verified = filtered.filter((user) => user.isEmailVerified).length;
    return {
      total: filtered.length,
      students,
      guards,
      admins,
      verifiedRate: filtered.length ? Math.round((verified / filtered.length) * 100) : 0,
    };
  }, [filtered]);

  const exportCsv = () => {
    const headers = ["fullName", "username", "email", "role", "isEmailVerified"];
    const rows = filtered.map((user) => [
      user.fullName || "",
      user.username || "",
      user.email || "",
      user.role || "",
      user.isEmailVerified ? "yes" : "no",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!filtered.length) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            className="input"
            placeholder="Search name / username / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="guard">Guard</option>
            <option value="admin">Admin</option>
          </select>
          <select className="input" value={verification} onChange={(e) => setVerification(e.target.value)}>
            <option value="">All verification states</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <EmptyState
          title="No users available"
          description="No user matched your current filters."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          className="input"
          placeholder="Search name / username / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="guard">Guard</option>
          <option value="admin">Admin</option>
        </select>
        <select className="input" value={verification} onChange={(e) => setVerification(e.target.value)}>
          <option value="">All verification states</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Visible Users</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{metrics.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Students</p>
          <p className="mt-1 text-2xl font-extrabold text-indigo-600">{metrics.students}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Guards</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">{metrics.guards}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admins</p>
          <p className="mt-1 text-2xl font-extrabold text-violet-600">{metrics.admins}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Rate</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-600">{metrics.verifiedRate}%</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={exportCsv}>
          Export Filtered CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
            <tr>
              <th className="px-4 py-3.5">Full Name</th>
              <th className="px-4 py-3.5">Username</th>
              <th className="px-4 py-3.5">Email</th>
              <th className="px-4 py-3.5">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <tr key={user._id || user.email} className="transition-colors hover:bg-slate-50/80">
                <td className="px-4 py-3.5 font-medium text-slate-900">{user.fullName || user.username || "-"}</td>
                <td className="px-4 py-3.5 text-slate-600">{user.username || "-"}</td>
                <td className="px-4 py-3.5 text-slate-600">{user.email || "-"}</td>
                <td className="px-4 py-3.5 capitalize text-slate-700 font-medium">{user.role || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
