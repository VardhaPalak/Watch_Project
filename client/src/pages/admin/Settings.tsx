import { useEffect, useState } from "react";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

interface SocialRow {
  platform: string;
  url: string;
}

interface SettingsForm {
  currency: { code: string; symbol: string; locale: string; position: "before" | "after" };
  business: { name: string; whatsapp: string; phone: string; email: string; address: string; hours: string };
  socials: SocialRow[];
  paymentMethods: string[];
  policies: { privacy: string; terms: string; shipping: string; returns: string };
}

const DEFAULT_FORM: SettingsForm = {
  currency: { code: "INR", symbol: "₹", locale: "en-IN", position: "before" },
  business: {
    name: "TIMECRAFT",
    whatsapp: "",
    phone: "",
    email: "care@timecraft.com",
    address: "",
    hours: "Mon - Sat, 10:00 - 20:00 IST",
  },
  socials: [],
  paymentMethods: ["Visa", "Mastercard", "Rupay", "UPI", "PayPal"],
  policies: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    shipping: "/legal/shipping",
    returns: "/legal/returns",
  },
};

export default function AdminSettings() {
  const { push } = useToast();
  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [payments, setPayments] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<{ settings?: Partial<SettingsForm> }>("/admin/settings", { auth: true })
      .then((data) => {
        if (!active || !data.settings) return;
        const next: SettingsForm = {
          currency: { ...DEFAULT_FORM.currency, ...(data.settings.currency || {}) },
          business: { ...DEFAULT_FORM.business, ...(data.settings.business || {}) },
          socials: data.settings.socials?.length ? data.settings.socials : [],
          paymentMethods: data.settings.paymentMethods?.length
            ? data.settings.paymentMethods
            : DEFAULT_FORM.paymentMethods,
          policies: { ...DEFAULT_FORM.policies, ...(data.settings.policies || {}) },
        };
        setForm(next);
        setPayments(next.paymentMethods.join(", "));
      })
      .catch(() => push("Could not load settings.", "error"))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [push]);

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        paymentMethods: payments
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      };
      await api.patch("/admin/settings", body, { auth: true });
      push("Store settings saved.");
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash";

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse border border-white/10 bg-charcoal/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-white">Store Settings</h1>
        <p className="mt-1 text-sm text-ash">
          Currency, contact channels and policy links. Changes apply to the storefront immediately.
        </p>
      </div>

      {/* Currency */}
      <section className="border border-white/10 bg-charcoal/40 p-6">
        <h2 className="font-display text-xl text-white">Currency</h2>
        <div className="gold-rule mt-3 mb-5 w-16" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>
            Code
            <input
              className="field"
              value={form.currency.code}
              onChange={(event) =>
                setForm({ ...form, currency: { ...form.currency, code: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Symbol
            <input
              className="field"
              value={form.currency.symbol}
              onChange={(event) =>
                setForm({ ...form, currency: { ...form.currency, symbol: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Locale
            <input
              className="field"
              value={form.currency.locale}
              onChange={(event) =>
                setForm({ ...form, currency: { ...form.currency, locale: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Position
            <select
              className="field"
              value={form.currency.position}
              onChange={(event) =>
                setForm({
                  ...form,
                  currency: { ...form.currency, position: event.target.value as "before" | "after" },
                })
              }
            >
              <option value="before">Before amount</option>
              <option value="after">After amount</option>
            </select>
          </label>
        </div>
      </section>

      {/* Business */}
      <section className="border border-white/10 bg-charcoal/40 p-6">
        <h2 className="font-display text-xl text-white">Business Contact</h2>
        <div className="gold-rule mt-3 mb-5 w-16" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Brand name
            <input
              className="field"
              value={form.business.name}
              onChange={(event) =>
                setForm({ ...form, business: { ...form.business, name: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            WhatsApp number (digits only, no +)
            <input
              className="field"
              placeholder="919876543210"
              value={form.business.whatsapp}
              onChange={(event) =>
                setForm({ ...form, business: { ...form.business, whatsapp: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Phone
            <input
              className="field"
              value={form.business.phone}
              onChange={(event) =>
                setForm({ ...form, business: { ...form.business, phone: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Email
            <input
              className="field"
              value={form.business.email}
              onChange={(event) =>
                setForm({ ...form, business: { ...form.business, email: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Address
            <input
              className="field"
              value={form.business.address}
              onChange={(event) =>
                setForm({ ...form, business: { ...form.business, address: event.target.value } })
              }
            />
          </label>
          <label className={labelClass}>
            Opening hours
            <input
              className="field"
              value={form.business.hours}
              onChange={(event) =>
                setForm({ ...form, business: { ...form.business, hours: event.target.value } })
              }
            />
          </label>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-white/35">
          The WhatsApp number powers the floating chat button and the enquiry links. Leave it blank to disable the
          button until a number is provided — no placeholder number is used.
        </p>
      </section>

      {/* Socials */}
      <section className="border border-white/10 bg-charcoal/40 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-white">Social Channels</h2>
          <button
            type="button"
            onClick={() => setForm({ ...form, socials: [...form.socials, { platform: "", url: "" }] })}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold transition hover:text-gold-light"
          >
            <Icon name="plus" size={13} />
            Add channel
          </button>
        </div>
        <div className="gold-rule mt-3 mb-5 w-16" />

        {form.socials.length === 0 ? (
          <p className="text-sm text-ash">No social channels configured.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {form.socials.map((social, index) => (
              <li key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  className="field sm:w-48"
                  placeholder="Platform"
                  value={social.platform}
                  onChange={(event) => {
                    const next = [...form.socials];
                    next[index] = { ...next[index], platform: event.target.value };
                    setForm({ ...form, socials: next });
                  }}
                />
                <input
                  className="field flex-1"
                  placeholder="https://"
                  value={social.url}
                  onChange={(event) => {
                    const next = [...form.socials];
                    next[index] = { ...next[index], url: event.target.value };
                    setForm({ ...form, socials: next });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, socials: form.socials.filter((_, itemIndex) => itemIndex !== index) })
                  }
                  aria-label="Remove channel"
                  className="h-[42px] w-[42px] shrink-0 border border-white/15 text-white/40 transition hover:border-red-400/60 hover:text-red-300"
                >
                  <Icon name="trash" size={15} className="mx-auto" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Payments + policies */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-white/10 bg-charcoal/40 p-6">
          <h2 className="font-display text-xl text-white">Payment Methods</h2>
          <div className="gold-rule mt-3 mb-5 w-16" />
          <label className={labelClass}>
            Comma separated list
            <input
              className="field"
              value={payments}
              onChange={(event) => setPayments(event.target.value)}
            />
          </label>
          <p className="mt-3 text-[11px] leading-relaxed text-white/35">
            These are display labels only. Online payment capture stays disabled until a payment provider is
            configured.
          </p>
        </div>

        <div className="border border-white/10 bg-charcoal/40 p-6">
          <h2 className="font-display text-xl text-white">Policy Links</h2>
          <div className="gold-rule mt-3 mb-5 w-16" />
          <div className="grid gap-4">
            {(
              [
                ["privacy", "Privacy Policy"],
                ["terms", "Terms & Conditions"],
                ["shipping", "Shipping Policy"],
                ["returns", "Returns & Refunds"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className={labelClass}>
                {label}
                <input
                  className="field"
                  value={form.policies[key]}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      policies: { ...form.policies, [key]: event.target.value },
                    })
                  }
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
