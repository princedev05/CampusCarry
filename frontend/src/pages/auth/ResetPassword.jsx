import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import { authApi, getErrorMessage } from "../../api";
import { minLength } from "../../utils/validators";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!minLength(password, 6)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await authApi.resetPassword(token, { newPassword: password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set your new password"
      footer={<Link to="/login" className="text-[var(--primary)]">Back to login</Link>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">New Password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="field-error">{error}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Updating..." : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
