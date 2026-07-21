import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";
import { SkeletonCard } from "../../components/Skeleton";
import { adminApi, getErrorMessage } from "../../api";

export default function Overview() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersData, usersData] = await Promise.all([adminApi.orders(), adminApi.users()]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setUsers(Array.isArray(usersData) ? usersData : usersData?._id ? [usersData] : []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = useMemo(() => {
    const pending = orders.filter((item) => item.status === "pending").length;
    const inProgress = orders.filter((item) => ["arrived", "verified", "token_assigned"].includes(item.status)).length;
    const completed = orders.filter((item) => item.status === "completed").length;
    const cancelled = orders.filter((item) => item.status === "cancelled").length;
    const guards = users.filter((item) => item.role === "guard").length;
    const students = users.filter((item) => item.role === "student").length;
    const completionRate = orders.length ? Math.round((completed / orders.length) * 100) : 0;
    return {
      totalUsers: users.length,
      students,
      guards,
      totalOrders: orders.length,
      pending,
      inProgress,
      completed,
      cancelled,
      completionRate,
    };
  }, [orders, users]);

  const alerts = useMemo(() => {
    const stalePending = orders.filter((order) => {
      if (order.status !== "pending") return false;
      const createdAt = new Date(order.createdAt || order.updatedAt || 0).getTime();
      return Date.now() - createdAt > 24 * 60 * 60 * 1000;
    }).length;

    const highCancels = counts.totalOrders > 0 && (counts.cancelled / counts.totalOrders) * 100 >= 20;

    return [
      stalePending > 0 ? `${stalePending} pending orders are older than 24 hours.` : null,
      highCancels ? "Cancellation ratio is above 20% for current data." : null,
      counts.inProgress > 0 ? `${counts.inProgress} orders are in active guard pipeline.` : null,
    ].filter(Boolean);
  }, [orders, counts.totalOrders, counts.cancelled, counts.inProgress]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Total Users" value={counts.totalUsers} />
        <StatCard title="Students" value={counts.students} />
        <StatCard title="Guards" value={counts.guards} />
        <StatCard title="Total Orders" value={counts.totalOrders} />
        <StatCard title="Pending" value={counts.pending} />
        <StatCard title="Completed %" value={`${counts.completionRate}%`} />
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900">Admin Operational Insights</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 shadow-2xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In-Progress Orders</p>
            <p className="mt-1 text-2xl font-extrabold text-indigo-600">{counts.inProgress}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 shadow-2xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cancelled Orders</p>
            <p className="mt-1 text-2xl font-extrabold text-rose-600">{counts.cancelled}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 shadow-2xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Orders</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-600">{counts.completed}</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-bold text-slate-800">Operational Alerts</p>
          {!alerts.length ? (
            <p className="mt-2 text-sm text-slate-500">No operational alerts right now.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {alerts.map((alert) => (
                <li key={alert} className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-amber-800 font-medium">
                  ⚠️ {alert}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
