import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { authApi, getErrorMessage } from "../../api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
        setMessage("Email verified successfully. You can login now.");
      } catch (error) {
        setStatus("error");
        setMessage(getErrorMessage(error, "Verification failed"));
      }
    };
    verify();
  }, [token]);

  return (
    <AuthLayout title="Email Verification" subtitle="Confirming your account">
      <div
        className={`rounded-lg border p-4 text-sm ${
          status === "success"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
            : status === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-200"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]"
        }`}
      >
        {message}
      </div>
      <Link className="mt-4 inline-block text-sm text-[var(--primary)]" to="/login">
        Go to login
      </Link>
    </AuthLayout>
  );
}
