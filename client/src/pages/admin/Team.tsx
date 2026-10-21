import { useEffect, useState } from "react";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { formatDateTime } from "../../lib/format";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  active: boolean;
  lastLoginAt?: string | null;
}

const EMPTY_FORM = { name: "", email: "", password: "", role: "staff" as "admin" | "staff" };

export default function AdminTeam() {
  const { push } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [resetting, setResetting] = useState<TeamMember | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: TeamMember[] }>("/admin/users", { auth: true });
      setMembers(data.items || []);
    } catch {
      push("Could not load the team.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createUser = async () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) {
      push("Name, email and a password of at least 8 characters are required.", "error");
      return;
    }
    setSaving(true);
    try {
      await api.post(
        "/admin/users",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        },
        { auth: true },
      );
      push(`${form.name.trim()} added to the team.`);
      setForm(EMPTY_FORM);
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not create the user.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateMember = async (member: TeamMember, changes: Partial<TeamMember>) => {
    try {
      await api.patch(`/admin/users/${member._id}`, changes, { auth: true });
      push(`${member.name} updated.`);
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not update the user.", "error");
    }
  };

  const resetPassword = async () => {
    if (!resetting) return;
    if (newPassword.length < 8) {
      push("Password must be at least 8 characters.", "error");
      return;
    }
    try {
      await api.patch(`/admin/users/${resetting._id}`, { password: newPassword }, { auth: true });
      push(`Password reset for ${resetting.name}.`);
      setResetting(null);
      setNewPassword("");
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not reset the password.", "error");
    }
  };

  const labelClass = "flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-white">Team</h1>
        <p className="mt-1 text-sm text-ash">
          Staff accounts can review enquiries. Admins can also manage products, settings and team access.
        </p>
      </div>

      <section className="border border-white/10 bg-charcoal/40 p-6">
        <h2 className="font-display text-xl text-white">Add Team Member</h2>
        <div className="gold-rule mt-3 mb-5 w-16" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>
            Name
            <input
              className="field"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>
          <label className={labelClass}>
            Email
            <input
              type="email"
              className="field"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label className={labelClass}>
            Temporary password
            <input
              type="password"
              className="field"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <label className={labelClass}>
            Role
            <select
              className="field"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value as "admin" | "staff" })}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <Button className="mt-5" onClick={createUser} loading={saving}>
          Create Account
        </Button>
      </section>

      <section className="overflow-hidden border border-white/10 bg-charcoal/40">
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="p-10 text-center text-sm text-ash">No team members found.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {members.map((member) => (
              <li
                key={member._id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/30 text-gold">
                    <Icon name="user" size={18} />
                  </span>
                  <div>
                    <p className="text-warm-white">{member.name}</p>
                    <p className="text-[12px] text-ash">{member.email}</p>
                    <p className="text-[11px] text-white/30">
                      Last sign-in: {member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "never"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={member.role}
                    onChange={(event) =>
                      updateMember(member, { role: event.target.value as "admin" | "staff" })
                    }
                    aria-label={`Role for ${member.name}`}
                    className="field w-auto py-2 text-[11px]"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => updateMember(member, { active: !member.active })}
                    className={`border px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition ${
                      member.active
                        ? "border-emerald-400/30 text-emerald-300/80 hover:border-emerald-400/60"
                        : "border-white/15 text-ash hover:border-gold hover:text-gold"
                    }`}
                  >
                    {member.active ? "Active" : "Disabled"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResetting(member);
                      setNewPassword("");
                    }}
                    className="text-[11px] uppercase tracking-[0.14em] text-gold transition hover:text-gold-light"
                  >
                    Reset password
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {resetting ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setResetting(null)} />
          <div className="relative z-10 w-full max-w-md border border-white/10 bg-charcoal p-6">
            <h3 className="font-display text-xl text-white">Reset password</h3>
            <p className="mt-2 text-sm text-ash">
              Set a new temporary password for {resetting.name}. Share it over a secure channel.
            </p>
            <label className={`${labelClass} mt-5`}>
              New password
              <input
                type="password"
                className="field"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setResetting(null)}>
                Cancel
              </Button>
              <Button onClick={resetPassword}>Update Password</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
