import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function GuardAbout() {
  const { user, refreshCurrentUser } = useAuth();

  useEffect(() => {
    refreshCurrentUser().catch(() => null);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-xl border border-(--border) bg-(--surface) p-5">
      <div>
        <h2 className="text-lg font-semibold">About</h2>
        <p className="mt-1 text-sm text-(--muted)">
          Your CampusCarry guard profile. Use Pending Deliveries to accept and verify parcels, then Handover Parcel when the student collects.
        </p>
      </div>

      <dl className="space-y-3 border-t border-(--border) pt-4 text-sm">
        <div>
          <dt className="text-(--muted)">Full Name</dt>
          <dd>{user?.fullName || user?.username || "—"}</dd>
        </div>
        <div>
          <dt className="text-(--muted)">Username</dt>
          <dd>{user?.username || "—"}</dd>
        </div>
        <div>
          <dt className="text-(--muted)">Email</dt>
          <dd>{user?.email || "—"}</dd>
        </div>
        {user?.phoneNumber ? (
          <div>
            <dt className="text-(--muted)">Phone</dt>
            <dd>{user.phoneNumber}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-(--muted)">Role</dt>
          <dd className="capitalize">{user?.role || "—"}</dd>
        </div>
        <div>
          <dt className="text-(--muted)">Email verified</dt>
          <dd>{user?.isEmailVerified ? "Yes" : "No"}</dd>
        </div>
      </dl>
    </div>
  );
}
