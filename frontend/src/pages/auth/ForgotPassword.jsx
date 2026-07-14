import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import { authApi, getErrorMessage } from "../../api";
import { isEmail } from "../../utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success("Password reset email sent");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Request a reset link"
      footer={<Link to="/login" className="text-[var(--primary)]">Back to login</Link>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error ? <p className="field-error">{error}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
}
