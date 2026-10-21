import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { api } from "../../lib/api";
import { formatDateTime } from "../../lib/format";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import type { EnquiryRecord, EnquiryStatus } from "../../types";

interface EnquiryResponse {
  enquiry: EnquiryRecord;
}

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersResponse {
  items: StaffUser[];
}

const STATUS_OPTIONS: EnquiryStatus[] = ["New", "In Progress", "Contacted", "Closed"];

const STATUS_COLORS: Record<string, string> = {
  New: "#B89458",
  "In Progress": "#6FA8DC",
  Contacted: "#6FCF97",
  Closed: "#9A9A9A",
};

function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? "#9A9A9A";
}

function StatusPill({ status }: { status: string }) {
  const color = statusColor(status);
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]"
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1A` }}
    >
      {status}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.2em] text-ash">{label}</p>
      <p className="mt-1 break-words text-sm text-warm-white">{value || "—"}</p>
    </div>
  );
}

export default function EnquiryDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const { isAdmin } = useAuth();

  const [enquiry, setEnquiry] = useState<EnquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [statusDraft, setStatusDraft] = useState<EnquiryStatus>("New");
  const [statusNote, setStatusNote] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savingAssign, setSavingAssign] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setError("This enquiry link is incomplete.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.get<EnquiryResponse>(`/admin/enquiries/${id}`, { auth: true });
      setEnquiry(data.enquiry);
      setStatusDraft(data.enquiry.status);
    } catch (err) {
      setEnquiry(null);
      setError(err instanceof Error ? err.message : "This enquiry could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let active = true;
    api
      .get<UsersResponse>("/admin/users", { auth: true })
      .then((result) => {
        if (!active) return;
        setStaff(Array.isArray(result?.items) ? result.items : []);
      })
      .catch(() => {
        if (active) setStaff([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleStatusUpdate = async () => {
    if (!enquiry) return;
    setSavingStatus(true);
    try {
      const payload: { status: EnquiryStatus; note?: string } = { status: statusDraft };
      const note = statusNote.trim();
      if (note) payload.note = note;
      const data = await api.patch<EnquiryResponse>(
        `/admin/enquiries/${enquiry._id}/status`,
        payload,
        { auth: true },
      );
      setEnquiry(data.enquiry);
      setStatusNote("");
      push(`Status updated to ${statusDraft}.`, "success");
    } catch (err) {
      push(
        err instanceof Error ? err.message : "The status could not be updated.",
        "error",
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!enquiry) return;
    const note = noteDraft.trim();
    if (!note) {
      push("Write a note before saving.", "error");
      return;
    }
    setSavingNote(true);
    try {
      const data = await api.post<EnquiryResponse>(
        `/admin/enquiries/${enquiry._id}/notes`,
        { note },
        { auth: true },
      );
      setEnquiry(data.enquiry);
      setNoteDraft("");
      push("Internal note added.", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "The note could not be saved.", "error");
    } finally {
      setSavingNote(false);
    }
  };

  const handleAssign = async (userId: string) => {
    if (!enquiry) return;
    setSavingAssign(true);
    try {
      const data = await api.patch<EnquiryResponse>(
        `/admin/enquiries/${enquiry._id}/assign`,
        { assignedTo: userId || null },
        { auth: true },
      );
      setEnquiry(data.enquiry);
      push(userId ? "Enquiry reassigned." : "Enquiry marked as unassigned.", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "The assignment could not be saved.", "error");
    } finally {
      setSavingAssign(false);
    }
  };

  const handleAttachment = async () => {
    if (!enquiry) return;
    setDownloading(true);
    try {
      const response = await api.get<Response>(
        `/admin/enquiries/${enquiry._id}/attachment`,
        { auth: true, raw: true },
      );
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const match = /filename="?([^";]+)"?/i.exec(disposition);
      const filename =
        match?.[1] ?? enquiry.attachment?.filename ?? "enquiry-attachment";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      push(err instanceof Error ? err.message : "The attachment could not be downloaded.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!enquiry) return;
    setDeleting(true);
    try {
      await api.delete<{ message?: string }>(`/admin/enquiries/${enquiry._id}`, { auth: true });
      push("Enquiry deleted.", "success");
      navigate("/admin/enquiries");
    } catch (err) {
      push(err instanceof Error ? err.message : "The enquiry could not be deleted.", "error");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-luxe flex min-h-[50vh] items-center justify-center bg-jet-black">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="container-luxe bg-jet-black py-16">
        <button
          type="button"
          onClick={() => navigate("/admin/enquiries")}
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold hover:underline"
        >
          <Icon name="arrowLeft" size={14} />
          Back to enquiries
        </button>
        <div className="border border-red-500/40 bg-red-500/10 p-6">
          <div className="flex items-start gap-3">
            <Icon name="close" size={18} className="mt-0.5 shrink-0 text-red-200" />
            <div>
              <p className="font-display text-xl text-warm-white">Enquiry unavailable</p>
              <p className="mt-2 text-sm text-red-100">
                {error || "We could not load this enquiry."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const notes = enquiry.notes ?? [];
  const history = enquiry.statusHistory ?? [];

  return (
    <div className="container-luxe bg-jet-black pb-16">
      <button
        type="button"
        onClick={() => navigate("/admin/enquiries")}
        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold transition hover:underline"
      >
        <Icon name="arrowLeft" size={14} />
        Back to enquiries
      </button>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div className="min-w-0">
          <span className="eyebrow">Enquiry {enquiry.reference}</span>
          <h1 className="mt-2 font-display text-3xl tracking-wide text-warm-white sm:text-4xl">
            {enquiry.name}
          </h1>
          <p className="mt-2 break-words text-sm text-ash">
            {enquiry.email} · {enquiry.countryCode} {enquiry.phone}
          </p>
          <p className="mt-1 text-xs text-ash">Submitted {formatDateTime(enquiry.submittedAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={enquiry.status} />
          {enquiry.assignedTo ? (
            <span className="flex items-center gap-2 border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-ash">
              <Icon name="user" size={14} />
              {enquiry.assignedTo.name}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Submitted details</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Reference" value={enquiry.reference} />
              <Field label="Full name" value={enquiry.name} />
              <Field label="Email" value={enquiry.email} />
              <Field label="Phone" value={`${enquiry.countryCode} ${enquiry.phone}`} />
              <Field label="Enquiry type" value={enquiry.enquiryType} />
              <Field label="Preferred contact" value={enquiry.preferredContact} />
              <Field label="Product of interest" value={enquiry.productName} />
              <Field label="Budget" value={enquiry.budget} />
              <Field label="Quantity" value={String(enquiry.quantity ?? 0)} />
              <Field label="Marketing consent" value={enquiry.consent ? "Granted" : "Not granted"} />
              <Field label="Submitted" value={formatDateTime(enquiry.submittedAt)} />
              <Field label="Current status" value={enquiry.status} />
            </dl>
          </section>

          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Customer message</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-relaxed text-warm-white">
              {enquiry.message}
            </p>
          </section>

          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Attachment</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            {enquiry.attachment?.url ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-white/[0.02] px-4 py-4">
                <div className="min-w-0">
                  <p className="break-words text-sm text-warm-white">
                    {enquiry.attachment.filename || "Attachment"}
                  </p>
                  <p className="mt-1 text-[11px] text-ash">
                    {enquiry.attachment.mimetype || "Unknown type"}
                    {enquiry.attachment.size
                      ? ` · ${Math.max(1, Math.round(enquiry.attachment.size / 1024))} KB`
                      : ""}
                  </p>
                </div>
                <Button
                  variant="outlineLight"
                  size="sm"
                  icon={<Icon name="download" size={14} />}
                  loading={downloading}
                  onClick={() => void handleAttachment()}
                >
                  Download
                </Button>
              </div>
            ) : (
              <p className="mt-5 text-sm text-ash">No attachment was submitted with this enquiry.</p>
            )}
          </section>

          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Status history</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            {history.length === 0 ? (
              <p className="mt-5 text-sm text-ash">No status changes have been recorded yet.</p>
            ) : (
              <ol className="mt-6 flex flex-col">
                {[...history]
                  .reverse()
                  .map((entry, index) => (
                    <li key={`${entry.at}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rotate-45 border border-gold bg-gold/40" />
                        {index < history.length - 1 ? (
                          <span className="w-px flex-1 bg-white/10" />
                        ) : null}
                      </div>
                      <div className="pb-6">
                        <StatusPill status={entry.status} />
                        <p className="mt-2 text-xs text-ash">
                          {entry.by || "System"} · {formatDateTime(entry.at)}
                        </p>
                      </div>
                    </li>
                  ))}
              </ol>
            )}
          </section>

          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Internal notes</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />

            {notes.length === 0 ? (
              <p className="mt-5 text-sm text-ash">
                No internal notes yet. Notes stay inside the atelier team.
              </p>
            ) : (
              <ul className="mt-6 flex flex-col gap-4">
                {[...notes].reverse().map((note) => (
                  <li key={note._id} className="border border-white/10 bg-white/[0.02] px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
                        {note.author || "System"}
                      </p>
                      <p className="text-[11px] text-ash">{formatDateTime(note.createdAt)}</p>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-warm-white">
                      {note.note}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <form className="mt-6 flex flex-col gap-3" onSubmit={handleAddNote}>
              <label htmlFor="internal-note" className="text-[10px] uppercase tracking-[0.2em] text-ash">
                Add internal note
              </label>
              <textarea
                id="internal-note"
                rows={4}
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder="Record what was discussed, promised, or still outstanding."
                className="field resize-y"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                icon={<Icon name="note" size={14} />}
                loading={savingNote}
                className="self-start"
              >
                Add note
              </Button>
            </form>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Update status</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label htmlFor="status-select" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-ash">
                  Status
                </label>
                <select
                  id="status-select"
                  value={statusDraft}
                  onChange={(event) => setStatusDraft(event.target.value as EnquiryStatus)}
                  className="field"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status-note" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-ash">
                  Note (optional)
                </label>
                <textarea
                  id="status-note"
                  rows={3}
                  value={statusNote}
                  onChange={(event) => setStatusNote(event.target.value)}
                  placeholder="Added to the internal notes thread with the status change."
                  className="field resize-y"
                />
              </div>
              <Button
                variant="gold"
                size="sm"
                icon={<Icon name="check" size={14} />}
                loading={savingStatus}
                onClick={() => void handleStatusUpdate()}
                className="self-start"
              >
                Save status
              </Button>
            </div>
          </section>

          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Assignment</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            <div className="mt-5">
              <label htmlFor="assign-select" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-ash">
                Assigned to
              </label>
              <select
                id="assign-select"
                value={enquiry.assignedTo?._id ?? ""}
                onChange={(event) => void handleAssign(event.target.value)}
                disabled={savingAssign || staff.length === 0}
                className="field"
              >
                <option value="">Unassigned</option>
                {staff.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} · {member.role}
                  </option>
                ))}
              </select>
              {staff.length === 0 ? (
                <p className="mt-2 text-[11px] leading-relaxed text-ash">
                  The staff directory is unavailable for this account, so assignments cannot be
                  changed here.
                </p>
              ) : null}
              {enquiry.assignedTo ? (
                <p className="mt-3 text-xs text-ash">
                  Currently with{" "}
                  <span className="text-warm-white">
                    {enquiry.assignedTo.name} ({enquiry.assignedTo.email})
                  </span>
                </p>
              ) : (
                <p className="mt-3 text-xs text-ash">Nobody owns this enquiry yet.</p>
              )}
            </div>
          </section>

          <section className="border border-white/10 bg-charcoal p-5 sm:p-6">
            <h2 className="font-display text-xl text-warm-white sm:text-2xl">Customer contact</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={`mailto:${enquiry.email}`}
                className="flex items-center gap-3 text-sm text-warm-white transition hover:text-gold"
              >
                <Icon name="mail" size={16} className="text-gold" />
                <span className="break-words">{enquiry.email}</span>
              </a>
              <a
                href={`tel:${enquiry.countryCode}${enquiry.phone}`}
                className="flex items-center gap-3 text-sm text-warm-white transition hover:text-gold"
              >
                <Icon name="phone" size={16} className="text-gold" />
                <span className="break-words">
                  {enquiry.countryCode} {enquiry.phone}
                </span>
              </a>
              <p className="flex items-center gap-3 text-sm text-warm-white">
                <Icon name="note" size={16} className="text-gold" />
                Prefers {enquiry.preferredContact}
              </p>
            </div>
          </section>

          {isAdmin ? (
            <section className="border border-red-500/30 bg-red-500/[0.06] p-5 sm:p-6">
              <h2 className="font-display text-xl text-warm-white sm:text-2xl">Danger zone</h2>
              <div className="gold-rule mt-3 w-full max-w-[90px]" />
              <p className="mt-4 text-sm leading-relaxed text-ash">
                Deleting an enquiry removes the customer message, notes and status history for good.
              </p>

              {confirmingDelete ? (
                <div className="mt-5 border border-red-500/40 bg-jet-black/40 p-4">
                  <p className="text-sm text-red-100">
                    Delete enquiry {enquiry.reference} permanently?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      variant="gold"
                      size="sm"
                      icon={<Icon name="trash" size={14} />}
                      loading={deleting}
                      onClick={() => void handleDelete()}
                    >
                      Yes, delete it
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={deleting}
                    >
                      Keep enquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outlineLight"
                  size="sm"
                  icon={<Icon name="trash" size={14} />}
                  onClick={() => setConfirmingDelete(true)}
                  className="mt-5 border-red-500/50 text-red-200 hover:border-red-400 hover:text-red-100"
                >
                  Delete enquiry
                </Button>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
