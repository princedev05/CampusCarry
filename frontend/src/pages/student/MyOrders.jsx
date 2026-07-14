import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import OrderTable from "../../components/OrderTable";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { SkeletonRow } from "../../components/Skeleton";
import { ordersApi, getErrorMessage } from "../../api";
import { formatDate, toTitleCase } from "../../utils/format";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [pickupToken, setPickupToken] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.myOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const timeline = useMemo(() => {
    if (!detailsOrder) return [];
    const events = [
      { title: "Order created", date: detailsOrder.createdAt },
      detailsOrder.arrivalDate ? { title: "Arrived at gate", date: detailsOrder.arrivalDate } : null,
      detailsOrder.collectedAt ? { title: "Collected", date: detailsOrder.collectedAt } : null,
    ].filter(Boolean);
    return events;
  }, [detailsOrder]);

  const handleCancel = async (order) => {
    try {
      await ordersApi.cancel(order._id);
      toast.success("Order cancelled");
      loadOrders();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleGenerateToken = async (order) => {
    const numericToken = order?.tokenNumber?.tokenNumber;
    if (typeof numericToken !== "number") {
      toast.error("Pickup token is not ready yet. Please refresh and try again.");
      return;
    }
    setPickupToken(numericToken);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <SkeletonRow key={idx} />
        ))}
      </div>
    );
  }

  // Separate completed orders
  const completedOrders = orders.filter((order) => order.status === "completed");
  const activeOrders = orders.filter((order) => order.status !== "completed");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">My Orders</h2>
        <OrderTable
          orders={activeOrders}
          renderActions={(order) => (
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => setDetailsOrder(order)}>
                View Details
              </Button>
              {order.status === "pending" ? (
                <Button variant="danger" onClick={() => handleCancel(order)}>
                  Cancel Order
                </Button>
              ) : null}
              {order.status === "token_assigned" ? (
                <Button variant="success" onClick={() => handleGenerateToken(order)}>
                  View Pickup Token
                </Button>
              ) : null}
            </div>
          )}
        />
      </div>

      {completedOrders.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-green-400">Completed Orders</h3>
          <OrderTable
            orders={completedOrders}
            renderActions={() => <span className="text-xs text-(--muted)">Collected</span>}
          />
        </div>
      )}

      <Modal open={Boolean(detailsOrder)} onClose={() => setDetailsOrder(null)} title="Order Details">
        {detailsOrder ? (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <p><span className="text-(--muted)">Tracking ID:</span> <span className="font-mono">{detailsOrder.trackingId}</span></p>
              <p><span className="text-(--muted)">Service:</span> {detailsOrder.deliveryService}</p>
              <p><span className="text-(--muted)">OTP:</span> <span className="font-mono">{detailsOrder.status === "pending" ? "Hidden until guard accepts" : detailsOrder.deliveryOtp}</span></p>
              <p><span className="text-(--muted)">Pickup Token:</span> <span className="font-mono">{detailsOrder?.tokenNumber?.tokenNumber || "-"}</span></p>
              <p><span className="text-(--muted)">Status:</span> {toTitleCase(detailsOrder.status)}</p>
            </div>
            <div>
              <p className="mb-2 font-medium">Status Timeline</p>
              <ul className="space-y-2">
                {timeline.map((event) => (
                  <li key={event.title} className="rounded-lg border border-(--border) bg-(--surface-2) p-2">
                    <p>{event.title}</p>
                    <p className="text-xs text-(--muted)">{formatDate(event.date)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={Boolean(pickupToken)} onClose={() => setPickupToken(null)} title="Pickup Token">
        <p className="text-sm text-(--muted)">Share this token with guard at handover time.</p>
        <p className="mt-3 rounded-lg border border-(--primary)/40 bg-(--primary)/10 p-3 font-mono text-xl tracking-wider text-(--primary)">
          {pickupToken}
        </p>
      </Modal>
    </div>
  );
}
