import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { guardApi, getErrorMessage } from "../../api";

export default function Handover() {
  const [values, setValues] = useState({ trackingId: "", username: "", token: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!values.trackingId.trim() || !values.username.trim() || !values.token.trim()) {
      toast.error("Tracking ID, username, and token are required");
      return;
    }

    setSubmitting(true);
    try {
      const data = await guardApi.handover(values);
      toast.success("Parcel handed over successfully");
      setResult({ ok: true, data });
      setValues({ trackingId: "", username: "", token: "" });
    } catch (error) {
      const message = getErrorMessage(error);
      setResult({ ok: false, message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-(--border) bg-(--surface) p-5">
      <h2 className="text-lg font-semibold">Handover Parcel</h2>
      <p className="mt-2 text-sm text-(--muted)">
        Confirm the student’s username, tracking ID, and pickup token before handing over the parcel.
      </p>
      <form className="mt-4 space-y-4" onSubmit={submit}>
        <div>
          <label className="mb-1 block text-sm text-(--muted)">Tracking ID</label>
          <input
            className="input font-mono"
            value={values.trackingId}
            onChange={(e) => setValues((state) => ({ ...state, trackingId: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-(--muted)">Username</label>
          <input
            className="input"
            value={values.username}
            onChange={(e) => setValues((state) => ({ ...state, username: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-(--muted)">Token</label>
          <input
            className="input font-mono"
            value={values.token}
            onChange={(e) => setValues((state) => ({ ...state, token: e.target.value }))}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Confirm Handover"}
        </Button>
      </form>

      {result ? (
        result.ok ? (
          <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <p className="font-semibold">Parcel handed over successfully</p>
            <div className="mt-2 grid gap-1">
              <p>
                Tracking: <span className="font-mono">{result.data?.trackingId || values.trackingId}</span>
              </p>
              <p>Status: {result.data?.status || "completed"}</p>
              <p>
                Student: {result.data?.student?.fullName || result.data?.student?.username || values.username}
              </p>
              <p>
                Token: <span className="font-mono">{result.data?.tokenNumber?.tokenNumber || values.token}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {result.message}
          </div>
        )
      ) : null}
    </div>
  );
}
