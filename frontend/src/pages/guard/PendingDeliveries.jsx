import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import { guardApi, getErrorMessage } from "../../api";
import { formatDate } from "../../utils/format";

const viewConfig = {
  arrived: {
    label: "Arrived",
    description: "Requests waiting for guard acceptance. Tracking and OTP stay hidden here.",
    statuses: ["pending"],
    columns: ["student", "service", "status", "date", "actions"],
  },
  pending: {
    label: "Pending",
    description: "Accepted requests that can now be verified with tracking ID and OTP.",
    statuses: ["arrived"],
    columns: ["student", "tracking", "otp", "service", "status", "date", "actions"],
  },
  accepted: {
    label: "Accepted",
    description: "Verified requests with a generated pickup token.",
    statuses: ["verified", "token_assigned"],
    columns: ["student", "tracking", "token", "service", "status", "date"],
  },
  completed: {
    label: "Completed",
    description: "Successfully handed over to students.",
    statuses: ["completed"],
    columns: ["student", "tracking", "service", "status", "date"],
  },
};

export default function PendingDeliveries() {
  const [status, setStatus] = useState("arrived");
  const [deliveries, setDeliveries] = useState([]);

  const load = async () => {
    try {
      const data = await guardApi.deliveries();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setDeliveries([]);
    }
  };

  const refreshAndToast = async (message) => {
    await load();
    if (message) {
      toast.success(message);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await guardApi.acceptDelivery({ orderId });
      await refreshAndToast("Delivery request accepted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleVerify = async (delivery) => {
    try {
      await guardApi.verifyDelivery({
        trackingId: delivery.trackingId,
        otp: delivery.deliveryOtp,
      });
      await refreshAndToast("Delivery verified and pickup token generated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const currentView = viewConfig[status] || viewConfig.arrived;

  const filtered = useMemo(() => {
    return deliveries.filter((item) => currentView.statuses.includes(item.status));
  }, [deliveries, currentView]);

  if (!filtered.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-(--muted)">Status</label>
          <select className="input max-w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="arrived">Arrived</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <p className="text-sm text-(--muted)">{currentView.description}</p>
        <EmptyState
          title="No deliveries to show"
          description="No guard deliveries matched this status filter."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-(--muted)">Status</label>
          <select className="input max-w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="arrived">Arrived</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <h3 className="text-base font-semibold">{currentView.label}</h3>
        <p className="text-sm text-(--muted)">{currentView.description}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--surface)">
        <table className="min-w-full text-sm">
          <thead className="bg-(--surface-2) text-left text-xs uppercase tracking-[0.14em] text-(--muted)">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              {currentView.columns.includes("tracking") ? <th className="px-4 py-3">Tracking ID</th> : null}
              {currentView.columns.includes("otp") ? <th className="px-4 py-3">OTP</th> : null}
              {currentView.columns.includes("token") ? <th className="px-4 py-3">Token</th> : null}
              <th className="px-4 py-3">Delivery Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Arrived Date</th>
              {currentView.columns.includes("actions") ? <th className="px-4 py-3">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.map((delivery) => (
              <tr key={delivery._id} className="border-t border-(--border)">
                <td className="px-4 py-3">{delivery?.student?.fullName || delivery?.student?.username || delivery?.student?.email || "-"}</td>
                {currentView.columns.includes("tracking") ? (
                  <td className="px-4 py-3 font-mono">{delivery.trackingId || "-"}</td>
                ) : null}
                {currentView.columns.includes("otp") ? (
                  <td className="px-4 py-3 font-mono">{delivery.deliveryOtp || "-"}</td>
                ) : null}
                {currentView.columns.includes("token") ? (
                  <td className="px-4 py-3 font-mono">{delivery?.tokenNumber?.tokenNumber || "-"}</td>
                ) : null}
                <td className="px-4 py-3">{delivery.deliveryService || "-"}</td>
                <td className="px-4 py-3"><Badge status={delivery.status || "pending"} /></td>
                <td className="px-4 py-3">{formatDate(delivery.arrivalDate || delivery.updatedAt)}</td>
                {currentView.columns.includes("actions") ? (
                  <td className="px-4 py-3">
                    {status === "arrived" ? (
                      <Button size="sm" onClick={() => handleAccept(delivery._id)}>
                        Accept
                      </Button>
                    ) : status === "pending" ? (
                      <Button size="sm" onClick={() => handleVerify(delivery)}>
                        Verify
                      </Button>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
