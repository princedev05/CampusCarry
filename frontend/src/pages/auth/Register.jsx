import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import { authApi, getErrorMessage } from "../../api";
import { isEmail, minLength } from "../../utils/validators";

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    hostelName: "",
    roomNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mapBackendErrors = (error) => {
    const message = getErrorMessage(error);
    const errorMap = {
      "already exists": "",
      "E11000": "",
      "duplicate": "",
    };

    const next = {};
    if (message.includes("username") || message.includes("duplicate")) {
      next.username = "Username already exists. Please choose another.";
    }
    if (message.includes("email")) {
      next.email = "Email already registered. Please use a different email.";
    }
    if (message.includes("phoneNumber") || message.includes("phone")) {
      next.phoneNumber = "Phone number already registered.";
    }
    return Object.keys(next).length > 0 ? next : null;
  };

  const validate = () => {
    const next = {};
    if (!minLength(values.username, 3)) next.username = "Username must be at least 3 chars.";
    if (!isEmail(values.email)) next.email = "Valid email is required.";
    if (!minLength(values.password, 6)) next.password = "Password must be at least 6 chars.";
    if (!values.phoneNumber.trim()) next.phoneNumber = "Phone number is required.";
    if (!/^[0-9]{10}$/.test(values.phoneNumber.replace(/\D/g, ""))) next.phoneNumber = "Please enter a valid 10-digit phone number.";
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await authApi.register(values);
      toast.success("Registered. Please verify your email.");
      navigate("/login");
    } catch (error) {
      const backendErrors = mapBackendErrors(error);
      if (backendErrors) {
        setErrors(backendErrors);
        toast.error("Please check your input and try again.");
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register to manage campus parcel deliveries"
      footer={<span>Already have an account? <Link to="/login" className="text-[var(--primary)]">Sign in</Link></span>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Full Name</label>
          <input
            className="input"
            value={values.fullName}
            onChange={(e) => setValues((s) => ({ ...s, fullName: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Username</label>
          <input
            className="input"
            placeholder="Unique username"
            value={values.username}
            onChange={(e) => setValues((s) => ({ ...s, username: e.target.value.toLowerCase() }))}
          />
          {errors.username ? <p className="field-error">{errors.username}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Unique email address"
            value={values.email}
            onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
          />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            className="input"
            placeholder="Unique 10-digit phone number"
            value={values.phoneNumber}
            onChange={(e) => setValues((s) => ({ ...s, phoneNumber: e.target.value }))}
          />
          {errors.phoneNumber ? <p className="field-error">{errors.phoneNumber}</p> : null}
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
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Role</label>
          <select
            className="input"
            value={values.role}
            onChange={(e) => setValues((s) => ({ ...s, role: e.target.value }))}
          >
            <option value="student">Student</option>
            <option value="guard">Guard</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {values.role === "student" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-[var(--muted)]">Hostel Name</label>
              <input
                className="input"
                placeholder="e.g., A Block, North Hostel"
                value={values.hostelName}
                onChange={(e) => setValues((s) => ({ ...s, hostelName: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--muted)]">Room Number</label>
              <input
                className="input"
                placeholder="e.g., 201, 305"
                value={values.roomNumber}
                onChange={(e) => setValues((s) => ({ ...s, roomNumber: e.target.value }))}
              />
            </div>
          </>
        )}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
}
