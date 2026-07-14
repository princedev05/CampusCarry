import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../../components/EmptyState";
import Badge from "../../components/Badge";
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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Visible Users</p>
          <p className="text-xl font-semibold">{metrics.total}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Students</p>
          <p className="text-xl font-semibold">{metrics.students}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Guards</p>
          <p className="text-xl font-semibold">{metrics.guards}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Admins</p>
          <p className="text-xl font-semibold">{metrics.admins}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Verified Rate</p>
          <p className="text-xl font-semibold">{metrics.verifiedRate}%</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={exportCsv}>
          Export Filtered CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--surface)">
        <table className="min-w-full text-sm">
          <thead className="bg-(--surface-2) text-left text-xs uppercase tracking-[0.14em] text-(--muted)">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id || user.email} className="border-t border-(--border)">
                <td className="px-4 py-3">{user.fullName || user.username || "-"}</td>
                <td className="px-4 py-3">{user.username || "-"}</td>
                <td className="px-4 py-3">{user.email || "-"}</td>
                <td className="px-4 py-3 capitalize">{user.role || "-"}</td>
                <td className="px-4 py-3">
                  <Badge status={user.isEmailVerified ? "verified" : "pending"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
