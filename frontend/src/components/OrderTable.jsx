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
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--surface-2)] text-left text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3">Tracking ID</th>
            <th className="px-4 py-3">Delivery Service</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">OTP</th>
            <th className="px-4 py-3">Created Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t border-[var(--border)] text-[var(--text)]">
              <td className="px-4 py-3 font-mono text-xs">{order.trackingId}</td>
              <td className="px-4 py-3">{order.deliveryService}</td>
              <td className="px-4 py-3">
                <Badge status={order.status} />
              </td>
              <td className="px-4 py-3 font-mono">{order.deliveryOtp}</td>
              <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3">{renderActions(order)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
