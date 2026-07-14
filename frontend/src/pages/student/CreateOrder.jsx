import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { ordersApi, getErrorMessage } from "../../api";
import { isOtp, minLength } from "../../utils/validators";

export default function CreateOrder() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    deliveryService: "",
    trackingId: "",
    deliveryOtp: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!minLength(values.deliveryService, 2)) next.deliveryService = "Delivery service is required.";
    if (!minLength(values.trackingId, 2)) next.trackingId = "Tracking ID is required.";
    if (!isOtp(values.deliveryOtp)) next.deliveryOtp = "Delivery OTP must be a 6-digit number.";
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await ordersApi.create(values);
      toast.success("Order created successfully");
      navigate("/student/my-orders");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold">Create New Order</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Delivery Service</label>
          <input className="input" value={values.deliveryService} onChange={(e) => setValues((s) => ({ ...s, deliveryService: e.target.value }))} />
          {errors.deliveryService ? <p className="field-error">{errors.deliveryService}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Tracking ID</label>
          <input className="input font-mono" value={values.trackingId} onChange={(e) => setValues((s) => ({ ...s, trackingId: e.target.value }))} />
          {errors.trackingId ? <p className="field-error">{errors.trackingId}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Delivery OTP</label>
          <input className="input font-mono" value={values.deliveryOtp} onChange={(e) => setValues((s) => ({ ...s, deliveryOtp: e.target.value }))} />
          {errors.deliveryOtp ? <p className="field-error">{errors.deliveryOtp}</p> : null}
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Create Order"}
        </Button>
      </form>
    </div>
  );
}
