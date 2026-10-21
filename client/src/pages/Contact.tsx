import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import { ApiError, api } from "../lib/api";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";
import { WHATSAPP_DEFAULT_MESSAGE } from "../config/site";

type TextField = "name" | "email" | "phone" | "message";

interface FieldValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: string;
}

interface EnquiryResponse {
  message?: string;
  reference?: string;
  duplicate?: boolean;
  enquiry?: { reference?: string; submittedAt?: string; status?: string };
}

const EMPTY_VALUES: FieldValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+]?[0-9\s\-()]{6,20}$/;

function validate(values: FieldValues, consent: boolean): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number including the country code.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Please tell us a little more (at least 10 characters).";
  }
  if (!consent) {
    errors.consent = "Please accept the privacy policy to continue.";
  }
  return errors;
}

function toFormErrors(serverErrors: Record<string, string>): FormErrors {
  const errors: FormErrors = {};
  if (serverErrors.name) errors.name = serverErrors.name;
  if (serverErrors.email) errors.email = serverErrors.email;
  if (serverErrors.phone) errors.phone = serverErrors.phone;
  if (serverErrors.message) errors.message = serverErrors.message;
  if (serverErrors.consent) errors.consent = serverErrors.consent;
  return errors;
}

export default function Contact() {
  const { settings } = useCurrency();
  const { push } = useToast();

  const business = settings?.business;
  const email = business?.email || "care@timecraft.com";
  const phone = business?.phone || "";
  const hours = business?.hours || "Mon - Sat, 10:00 - 20:00 IST";
  const address = business?.address || "";

  const whatsappDigits = (business?.whatsapp || "").replace(/\D/g, "");
  const whatsappNumber = whatsappDigits
    ? whatsappDigits.length === 10
      ? `91${whatsappDigits}`
      : whatsappDigits
    : "";
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`
    : "";

  const [values, setValues] = useState<FieldValues>(EMPTY_VALUES);
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleText = (field: TextField) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle") setStatus("idle");
  };

  const handleConsent = (event: ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.checked);
    setErrors((current) => ({ ...current, consent: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values, consent);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      setStatus("error");
      setStatusMessage("Please correct the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const data = await api.post<EnquiryResponse>("/enquiries", {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        countryCode: "+91",
        enquiryType: "Other",
        productName: "",
        budget: "",
        quantity: 1,
        preferredContact: "Email",
        message: values.message.trim(),
        consent: true,
      });

      setReference(data.reference || data.enquiry?.reference || "");
      setStatusMessage(
        data.message || "Thank you for contacting TIMECRAFT. We have received your message.",
      );
      setStatus("success");
      setValues(EMPTY_VALUES);
      setErrors({});
      push("Your message has been sent to TIMECRAFT.", "success");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && Object.keys(error.errors).length > 0) {
          setErrors(toFormErrors(error.errors));
          setStatusMessage(error.message || "Please correct the highlighted fields.");
          setStatus("error");
        } else if (error.status === 409) {
          setStatusMessage(
            error.message ||
              "This enquiry has already been received. Our team will contact you shortly.",
          );
          setStatus("success");
          push("We already have this enquiry on file.", "info");
        } else {
          setStatusMessage(error.message || "Something went wrong. Please try again.");
          setStatus("error");
          push("We could not send your message. Please try again.", "error");
        }
      } else {
        setStatusMessage("Something went wrong. Please try again.");
        setStatus("error");
        push("We could not send your message. Please try again.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const details = [
    {
      icon: "mail" as const,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: "phone" as const,
      label: "Phone",
      value: phone || "Not published — please use the form or email",
      href: phone ? `tel:${phone}` : "",
    },
    {
      icon: "clock" as const,
      label: "Hours",
      value: hours,
      href: "",
    },
    {
      icon: "pin" as const,
      label: "Address",
      value: address || "Studio address available on request",
      href: "",
    },
  ];

  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-6 py-20 text-center md:py-24">
          <span className="eyebrow">Contact</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
            Speak to the <span className="text-gold">atelier</span>
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash sm:text-base">
            Questions about a reference, a service booking or a corporate order — send a note and a
            member of the TIMECRAFT team will come back to you.
          </p>
        </div>
      </section>

      {/* Details + form */}
      <section className="container-luxe grid gap-10 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal className="flex flex-col gap-6">
          <div className="border border-white/10 bg-charcoal p-6">
            <h2 className="font-display text-2xl text-white">Reach us directly</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />
            <ul className="mt-6 flex flex-col gap-5">
              {details.map((detail) => (
                <li key={detail.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-gold/30 text-gold">
                    <Icon name={detail.icon} size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ash">{detail.label}</p>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="mt-1 block break-words text-sm text-warm-white transition hover:text-gold"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="mt-1 break-words text-sm text-warm-white">{detail.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/10 bg-charcoal p-6">
            <h3 className="font-display text-xl text-white">Prefer WhatsApp?</h3>
            {whatsappHref ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-ash">
                  Send us a message and we will reply with availability, pricing and delivery
                  timelines.
                </p>
                <Button
                  href={whatsappHref}
                  variant="outline"
                  className="mt-5"
                  icon={<Icon name="whatsapp" size={15} />}
                >
                  Chat on WhatsApp
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-ash">
                  A WhatsApp number has not been published for this deployment. Use the form on this
                  page or email us directly and we will respond the same way.
                </p>
                <Button
                  to="/enquiry"
                  variant="outline"
                  className="mt-5"
                  icon={<Icon name="mail" size={15} />}
                >
                  Use the Enquiry Form
                </Button>
              </>
            )}
          </div>

          <p className="text-xs leading-relaxed text-ash">
            Enquiries are answered in the order they arrive, usually within one business day. For
            servicing an existing timepiece, include the model name and your reference number.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="border border-white/10 bg-charcoal p-6 sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-5 py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center border border-gold/40 text-gold">
                  <Icon name="check" size={26} />
                </span>
                <h2 className="font-display text-3xl text-white">Message received</h2>
                <p className="max-w-md text-sm leading-relaxed text-ash">
                  {statusMessage ||
                    "Thank you for contacting TIMECRAFT. Our team will get back to you shortly."}
                </p>
                {reference ? (
                  <p className="border border-gold/30 bg-gold/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                    Reference: {reference}
                  </p>
                ) : null}
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("idle");
                    setReference("");
                    setStatusMessage("");
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <SectionHeading
                  align="left"
                  eyebrow="Send a Message"
                  title="Contact the TIMECRAFT team"
                  subtitle="We read every message. The more context you give — budget, occasion, references you like — the more useful our reply will be."
                />

                {status === "error" && statusMessage ? (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                  >
                    <Icon name="close" size={16} className="mt-0.5 shrink-0 text-red-200" />
                    <p>{statusMessage}</p>
                  </div>
                ) : null}

                <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                    >
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={values.name}
                      onChange={handleText("name")}
                      placeholder="Your name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      className={`field ${errors.name ? "field-error" : ""}`}
                    />
                    {errors.name ? (
                      <p id="contact-name-error" className="mt-2 text-xs text-red-200">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleText("email")}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={`field ${errors.email ? "field-error" : ""}`}
                      />
                      {errors.email ? (
                        <p id="contact-email-error" className="mt-2 text-xs text-red-200">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                      >
                        Phone
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleText("phone")}
                        placeholder="+91 00000 00000"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                        className={`field ${errors.phone ? "field-error" : ""}`}
                      />
                      {errors.phone ? (
                        <p id="contact-phone-error" className="mt-2 text-xs text-red-200">
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={handleText("message")}
                      placeholder="Tell us which timepiece you are interested in, your budget and how you would like to proceed."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className={`field resize-y ${errors.message ? "field-error" : ""}`}
                    />
                    {errors.message ? (
                      <p id="contact-message-error" className="mt-2 text-xs text-red-200">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ash">
                      <input
                        name="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={handleConsent}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? "contact-consent-error" : undefined}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#B89458]"
                      />
                      <span>
                        I agree that TIMECRAFT may store these details in order to respond to my
                        enquiry. Read our{" "}
                        <Link
                          to="/legal/privacy"
                          className="text-gold underline underline-offset-4"
                        >
                          privacy policy
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.consent ? (
                      <p id="contact-consent-error" className="mt-2 text-xs text-red-200">
                        {errors.consent}
                      </p>
                    ) : null}
                  </div>

                  <Button type="submit" loading={submitting} className="sm:w-fit">
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* Support band */}
      <section className="border-t border-white/10 bg-charcoal">
        <div className="container-luxe grid gap-6 py-14 sm:grid-cols-3">
          {[
            {
              icon: "headset" as const,
              title: "Service bookings",
              body: "Servicing, strap changes and battery replacement are arranged through the same enquiry channel.",
            },
            {
              icon: "truck" as const,
              title: "Delivery questions",
              body: "We share dispatch and courier details with you directly once an order is confirmed.",
            },
            {
              icon: "sparkle" as const,
              title: "Corporate gifting",
              body: "Bulk orders, engraving and multi-recipient delivery are quoted case by case.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="flex flex-col gap-3">
              <Icon name={item.icon} size={22} className="text-gold" />
              <h3 className="font-display text-xl text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ash">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
