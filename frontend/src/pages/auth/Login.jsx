import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api";
import { isEmail, minLength } from "../../utils/validators";

const rolePath = {
  student: "/student/my-orders",
  guard: "/guard/pending-deliveries",
  admin: "/admin/overview",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const next = {};
    if (!isEmail(values.email)) next.email = "Valid email is required.";
    if (!minLength(values.password, 1)) next.password = "Password is required.";
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success("Welcome back");
      const nextPath = location.state?.from?.pathname || rolePath[user?.role] || "/login";
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Login to CampusCarry"
      subtitle="Access your role-based parcel dashboard"
      footer={
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
          <span>New here? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4">Create account</Link></span>
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
        </div>
      }
    >
      <div className="mb-5 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-3.5 text-xs font-medium text-indigo-900 shadow-2xs">
        💡 <span className="font-bold">Demo credentials:</span> Use any user registered or seeded in backend. Example roles are student, guard, admin.
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Email</label>
          <input
            type="email"
            className="input"
            value={values.email}
            onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
          />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input pr-10"
              value={values.password}
              onChange={(e) => setValues((s) => ({ ...s, password: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L9.172 9.172m5.656 5.656l2.83 2.83m-3.536 0a6 6 0 01-8.485-8.485m8.485 8.485L21 3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password ? <p className="field-error">{errors.password}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
}
