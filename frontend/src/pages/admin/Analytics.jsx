import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi, getErrorMessage } from "../../api";

const COLORS = {
  pending: "#f59e0b",
  arrived: "#10b981",
  verified: "#0284c7",
  token_assigned: "#6366f1",
  completed: "#14b8a6",
  cancelled: "#ef4444",
};

export default function Analytics() {
  const [orders, setOrders] = useState([]);

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

  const statusData = useMemo(() => {
    const counts = {
      pending: 0,
      arrived: 0,
      verified: 0,
      token_assigned: 0,
      completed: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status] += 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const timeData = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt || order.updatedAt || "1970-01-01")
        .toISOString()
        .slice(0, 10);
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [orders]);

  const serviceData = useMemo(() => {
    const counts = {};
    orders.forEach((order) => {
      const service = order.deliveryService || "unknown";
      counts[service] = (counts[service] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [orders]);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="h-[360px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
        <h3 className="mb-3 text-base font-bold text-slate-900">Orders by Status</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={105} label>
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || "#64748b"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="h-[360px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
        <h3 className="mb-3 text-base font-bold text-slate-900">Orders Over Time</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="h-[360px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs xl:col-span-2">
        <h3 className="mb-3 text-base font-bold text-slate-900">Top Delivery Services</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={serviceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="service" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
