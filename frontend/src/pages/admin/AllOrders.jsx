import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import { adminApi, getErrorMessage } from "../../api";
import { formatDate } from "../../utils/format";

const STATUS_OPTIONS = [
  "pending",
  "arrived",
  "verified",
  "token_assigned",
  "completed",
  "cancelled",
];

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.orders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };
    load();
  }, []);

  const services = useMemo(() => {
    return Array.from(new Set(orders.map((order) => order.deliveryService).filter(Boolean))).sort();
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch = status ? order.status === status : true;
      const serviceMatch = service ? order.deliveryService === service : true;
      const searchMatch = search
        ? `${order.trackingId || ""} ${order?.student?.fullName || ""} ${order?.student?.username || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      return statusMatch && serviceMatch && searchMatch;
    });
  }, [orders, status, service, search]);

  const sorted = useMemo(() => {
    const next = [...filtered];
    next.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });
    return next;
  }, [filtered, sort]);

  const metrics = useMemo(() => {
    const completed = filtered.filter((order) => order.status === "completed").length;
    const active = filtered.filter((order) => order.status !== "completed" && order.status !== "cancelled").length;
    return {
      total: filtered.length,
      completed,
      active,
      completionRate: filtered.length ? Math.round((completed / filtered.length) * 100) : 0,
    };
  }, [filtered]);

  const exportCsv = () => {
    const headers = [
      "trackingId",
      "student",
      "username",
      "service",
      "status",
      "otp",
      "token",
      "createdAt",
    ];

    const rows = sorted.map((order) => [
      order.trackingId || "",
      order?.student?.fullName || "",
      order?.student?.username || "",
      order.deliveryService || "",
      order.status || "",
      order.deliveryOtp || "",
      order?.tokenNumber?.tokenNumber || "",
      order.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!sorted.length) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            className="input"
            placeholder="Search tracking / student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All status</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">All services</option>
            {services.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
        <EmptyState
          title="No orders found"
          description="No orders matched your current filter combination."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          className="input"
          placeholder="Search tracking / student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          {STATUS_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">All services</option>
          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Visible Orders</p>
          <p className="text-xl font-semibold">{metrics.total}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Active Pipeline</p>
          <p className="text-xl font-semibold">{metrics.active}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Completed</p>
          <p className="text-xl font-semibold">{metrics.completed}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
          <p className="text-xs text-(--muted)">Completion Rate</p>
          <p className="text-xl font-semibold">{metrics.completionRate}%</p>
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
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Tracking ID</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">OTP</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((order) => (
              <tr key={order._id} className="border-t border-(--border)">
                <td className="px-4 py-3">{order?.student?.fullName || order?.student?.username || "-"}</td>
                <td className="px-4 py-3 font-mono">{order.trackingId || "-"}</td>
                <td className="px-4 py-3">{order.deliveryService || "-"}</td>
                <td className="px-4 py-3"><Badge status={order.status || "pending"} /></td>
                <td className="px-4 py-3 font-mono">{order.deliveryOtp || "-"}</td>
                <td className="px-4 py-3">{formatDate(order.createdAt || order.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
