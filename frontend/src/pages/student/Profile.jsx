import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { authApi, getErrorMessage } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { minLength } from "../../utils/validators";

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshCurrentUser, logout } = useAuth();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCurrentUser().catch(() => null);
  }, []);

  const changePassword = async (event) => {
    event.preventDefault();
    const next = {};
    if (!minLength(passwords.oldPassword, 1)) next.oldPassword = "Old password is required.";
    if (!minLength(passwords.newPassword, 6)) next.newPassword = "New password must be at least 6 chars.";
    if (passwords.confirmPassword !== passwords.newPassword) {
      next.confirmPassword = "Confirm password must match new password.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await authApi.changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    try {
      await authApi.resendVerification();
      toast.success("Verification email sent");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-(--border) bg-(--surface) p-5">
        <h2 className="text-lg font-semibold">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-(--muted)">Full Name</dt>
            <dd>{user?.fullName || user?.username || "-"}</dd>
          </div>
          <div>
            <dt className="text-(--muted)">Username</dt>
            <dd>{user?.username || "-"}</dd>
          </div>
          <div>
            <dt className="text-(--muted)">Email</dt>
            <dd>{user?.email || "-"}</dd>
          </div>
          <div>
            <dt className="text-(--muted)">Role</dt>
            <dd className="capitalize">{user?.role || "-"}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={resendEmail}>Resend Verification Email</Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </section>

      <section className="rounded-xl border border-(--border) bg-(--surface) p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Change Password</h3>
            <p className="mt-1 text-sm text-(--muted)">
              Keep your account secure with a strong password.
            </p>
          </div>
          <span className="rounded-full border border-(--border) bg-(--surface-2) px-3 py-1 text-xs text-(--muted)">
            Security
          </span>
        </div>

        <div className="mt-4 rounded-lg border border-(--border) bg-(--surface-2) p-3 text-xs text-(--muted)">
          Use at least 6 characters and avoid sharing your password with anyone.
        </div>

        <form className="mt-4 space-y-4" onSubmit={changePassword}>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">Old Password</label>
            <input
              type="password"
              className="input"
              autoComplete="current-password"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords((s) => ({ ...s, oldPassword: e.target.value }))}
            />
            {errors.oldPassword ? <p className="field-error">{errors.oldPassword}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">New Password</label>
            <input
              type="password"
              className="input"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((s) => ({ ...s, newPassword: e.target.value }))}
            />
            {errors.newPassword ? <p className="field-error">{errors.newPassword}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">Confirm New Password</label>
            <input
              type="password"
              className="input"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((s) => ({ ...s, confirmPassword: e.target.value }))}
            />
            {errors.confirmPassword ? <p className="field-error">{errors.confirmPassword}</p> : null}
          </div>
          <div className="pt-1">
            <Button type="submit" className="min-w-40" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
