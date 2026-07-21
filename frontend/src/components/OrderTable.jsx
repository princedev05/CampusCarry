import Badge from "./Badge";
import { formatDate } from "../utils/format";
import EmptyState from "./EmptyState";

export default function OrderTable({ orders = [], renderActions }) {
  if (!orders.length) {
    return (
      <EmptyState
        title="No orders found"
        description="Create a new order or change filters to see parcel entries here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
          <tr>
            <th className="px-4 py-3.5">Tracking ID</th>
            <th className="px-4 py-3.5">Delivery Service</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">OTP</th>
            <th className="px-4 py-3.5">Created Date</th>
            <th className="px-4 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order._id} className="transition-colors hover:bg-slate-50/80">
              <td className="px-4 py-3.5 font-mono text-xs text-slate-800 font-semibold">{order.trackingId}</td>
              <td className="px-4 py-3.5 text-slate-600">{order.deliveryService}</td>
              <td className="px-4 py-3.5">
                <Badge status={order.status} />
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-700">{order.deliveryOtp}</td>
              <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3.5">{renderActions(order)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
