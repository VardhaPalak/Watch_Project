import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { api, ApiError } from "../../lib/api";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";
import type { ContactMethod, EnquiryType } from "../../types";

const ENQUIRY_TYPES: EnquiryType[] = [
  "Product Enquiry",
  "Price Enquiry",
  "Bulk Order",
  "Corporate Gifting",
  "Partnership",
  "Other",
];

const CONTACT_METHODS: ContactMethod[] = ["Phone", "WhatsApp", "Email"];

const COUNTRY_CODES = [
  { code: "+91", label: "India" },
  { code: "+1", label: "USA / Canada" },
  { code: "+44", label: "United Kingdom" },
  { code: "+61", label: "Australia" },
  { code: "+971", label: "UAE" },
  { code: "+65", label: "Singapore" },
  { code: "+81", label: "Japan" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+39", label: "Italy" },
  { code: "+55", label: "Brazil" },
  { code: "+27", label: "South Africa" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;
const MIN_FILL_SECONDS = 1.5;

interface Props {
  defaultProductName?: string;
  defaultMessage?: string;
  compact?: boolean;
  onSuccess?: (reference: string) => void;
  id?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  enquiryType: EnquiryType;
  productName: string;
  budget: string;
  quantity: number;
  preferredContact: ContactMethod;
  message: string;
  consent: boolean;
  website: string;
}

export default function EnquiryForm({
  defaultProductName = "",
  defaultMessage = "",
  compact = false,
  onSuccess,
  id,
}: Props) {
  const { currency } = useCurrency();
  const { push } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);
  const mountedAt = useRef(Date.now());
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState<{ reference: string; message: string } | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    enquiryType: "Product Enquiry",
    productName: defaultProductName,
    budget: "",
    quantity: 1,
    preferredContact: "Email",
    message: defaultMessage,
    consent: false,
    website: "",
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      productName: current.productName || defaultProductName,
      message: current.message || defaultMessage,
    }));
  }, [defaultProductName, defaultMessage]);

  const budgetOptions = useMemo(
    () => [
      `Under ${currency.symbol}25,000`,
      `${currency.symbol}25,000 - ${currency.symbol}50,000`,
      `${currency.symbol}50,000 - ${currency.symbol}1,00,000`,
      `${currency.symbol}1,00,000 - ${currency.symbol}5,00,000`,
      `Above ${currency.symbol}5,00,000`,
      "Prefer to discuss",
    ],
    [currency.symbol],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!PHONE_PATTERN.test(form.phone.trim())) {
      next.phone = "Please enter a valid phone number with the country code.";
    }
    if (!form.enquiryType) next.enquiryType = "Please choose an enquiry type.";
    if (form.message.trim().length < 10) {
      next.message = "Please tell us a little more (at least 10 characters).";
    }
    if (Number(form.quantity) < 1) next.quantity = "Quantity must be at least 1.";
    if (!form.consent) next.consent = "Please accept the privacy policy to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (form.website) return; // honeypot - silently drop bot submissions
    if (Date.now() - mountedAt.current < MIN_FILL_SECONDS * 1000) {
      setFormError("Please take a moment to review your details before submitting.");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("phone", form.phone.trim());
      payload.append("countryCode", form.countryCode);
      payload.append("enquiryType", form.enquiryType);
      payload.append("productName", form.productName.trim());
      payload.append("budget", form.budget);
      payload.append("quantity", String(form.quantity));
      payload.append("preferredContact", form.preferredContact);
      payload.append("message", form.message.trim());
      payload.append("consent", form.consent ? "true" : "false");
      payload.append("website", form.website);
      if (file) payload.append("attachment", file);

      const response = await api.post<{ message: string; reference: string }>("/enquiries", payload);
      setSuccess({ reference: response.reference, message: response.message });
      push("Enquiry submitted successfully.");
      formRef.current?.reset();
      setFile(null);
      setForm((current) => ({ ...current, message: "", productName: defaultProductName, consent: false }));
      onSuccess?.(response.reference);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.errors || {});
        setFormError(error.message);
      } else {
        setFormError("We could not submit your enquiry. Please try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null;
    if (selected && selected.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, attachment: "Attachments must be 5 MB or smaller." }));
      setFile(null);
      return;
    }
    setErrors((current) => {
      const next = { ...current };
      delete next.attachment;
      return next;
    });
    setFile(selected);
  };

  if (success) {
    return (
      <div
        id={id}
        className="flex flex-col items-center gap-5 border border-gold/30 bg-charcoal/60 px-6 py-12 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 text-gold">
          <Icon name="check" size={28} />
        </span>
        <div>
          <h3 className="font-display text-2xl text-white">Enquiry Received</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ash">
            Thank you for contacting TIMECRAFT! Your enquiry has been received. Our team will get back to you
            shortly.
          </p>
        </div>
        <div className="border border-gold/40 px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-gold">
          Ref: {success.reference}
        </div>
        <p className="text-[11px] text-white/40">
          Keep this reference for your records. A confirmation email is on its way if email notifications are
          configured.
        </p>
        <Button variant="outline" onClick={() => setSuccess(null)}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const labelClass = "mb-2 block text-[10px] uppercase tracking-[0.22em] text-ash";
  const errorClass = "mt-1.5 text-[11px] text-red-300";

  return (
    <form
      id={id}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(event) => update("website", event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div className={`grid gap-5 ${compact ? "" : "md:grid-cols-2"}`}>
        <div>
          <label className={labelClass} htmlFor="enq-name">
            Full Name *
          </label>
          <input
            id="enq-name"
            name="name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className={`field ${errors.name ? "field-error" : ""}`}
            placeholder="Your full name"
            autoComplete="name"
          />
          {errors.name ? <p className={errorClass}>{errors.name}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-email">
            Email Address *
          </label>
          <input
            id="enq-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={`field ${errors.email ? "field-error" : ""}`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-phone">
            Phone Number *
          </label>
          <div className="flex">
            <select
              aria-label="Country code"
              value={form.countryCode}
              onChange={(event) => update("countryCode", event.target.value)}
              className="field w-[104px] shrink-0 border-r-0"
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
            <input
              id="enq-phone"
              name="phone"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              className={`field ${errors.phone ? "field-error" : ""}`}
              placeholder="98765 43210"
              autoComplete="tel"
            />
          </div>
          {errors.phone ? <p className={errorClass}>{errors.phone}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-type">
            Enquiry Type *
          </label>
          <select
            id="enq-type"
            name="enquiryType"
            value={form.enquiryType}
            onChange={(event) => update("enquiryType", event.target.value as EnquiryType)}
            className={`field ${errors.enquiryType ? "field-error" : ""}`}
          >
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.enquiryType ? <p className={errorClass}>{errors.enquiryType}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-product">
            Interested Product / Watch Model
          </label>
          <input
            id="enq-product"
            name="productName"
            value={form.productName}
            onChange={(event) => update("productName", event.target.value)}
            className="field"
            placeholder="e.g. Classic Chronograph"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-budget">
            Estimated Budget
          </label>
          <select
            id="enq-budget"
            name="budget"
            value={form.budget}
            onChange={(event) => update("budget", event.target.value)}
            className="field"
          >
            <option value="">Select a range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-quantity">
            Quantity
          </label>
          <input
            id="enq-quantity"
            name="quantity"
            type="number"
            min={1}
            value={form.quantity}
            onChange={(event) => update("quantity", Number(event.target.value))}
            className={`field ${errors.quantity ? "field-error" : ""}`}
          />
          {errors.quantity ? <p className={errorClass}>{errors.quantity}</p> : null}
        </div>

        <div>
          <span className={labelClass}>Preferred Contact Method</span>
          <div className="flex flex-wrap gap-2">
            {CONTACT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => update("preferredContact", method)}
                aria-pressed={form.preferredContact === method}
                className={`border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition ${
                  form.preferredContact === method
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/12 text-ash hover:border-gold/50 hover:text-warm-white"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="enq-message">
          Message / Requirements *
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className={`field resize-y ${errors.message ? "field-error" : ""}`}
          placeholder="Tell us about the timepiece, occasion, timeline or gifting requirements."
        />
        {errors.message ? <p className={errorClass}>{errors.message}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="enq-attachment">
          Attachment (optional)
        </label>
        <label
          htmlFor="enq-attachment"
          className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-white/20 px-4 py-4 text-[11px] uppercase tracking-[0.18em] text-ash transition hover:border-gold/60 hover:text-gold"
        >
          <Icon name="upload" size={15} />
          {file ? file.name : "Attach a reference image or document (max 5 MB)"}
        </label>
        <input
          id="enq-attachment"
          type="file"
          name="attachment"
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
          onChange={handleFile}
          className="sr-only"
        />
        {errors.attachment ? <p className={errorClass}>{errors.attachment}</p> : null}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-ash">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          className={`mt-0.5 h-4 w-4 shrink-0 appearance-none border border-white/25 bg-transparent transition checked:border-gold checked:bg-gold ${
            errors.consent ? "border-red-400" : ""
          }`}
        />
        <span>
          I consent to TIMECRAFT storing my details to respond to this enquiry, in line with the{" "}
          <Link to="/legal/privacy" className="text-gold underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          . *
        </span>
      </label>
      {errors.consent ? <p className={errorClass}>{errors.consent}</p> : null}

      {formError ? (
        <div className="flex items-start gap-2 border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
          <Icon name="close" size={14} className="mt-0.5 shrink-0" />
          <p>{formError}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" loading={submitting} disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Submitting" : "Submit Enquiry"}
        </Button>
        <p className="text-[11px] leading-relaxed text-white/35">
          We reply to every enquiry within one business day. Your details are never published.
        </p>
      </div>
    </form>
  );
}
