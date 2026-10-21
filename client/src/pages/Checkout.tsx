import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import WatchArtwork from "../components/ui/WatchArtwork";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";

type TextField =
  | "email"
  | "phone"
  | "name"
  | "address"
  | "city"
  | "state"
  | "postalCode"
  | "country";

interface ShippingValues {
  email: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingErrors {
  email?: string;
  phone?: string;
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

const EMPTY_SHIPPING: ShippingValues = {
  email: "",
  phone: "",
  name: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+]?[0-9\s\-()]{6,20}$/;

const FREE_SHIPPING_THRESHOLD = 50000;
const FLAT_SHIPPING_FEE = 1500;

function validate(values: ShippingValues): ShippingErrors {
  const errors: ShippingErrors = {};
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number including the country code.";
  }
  if (values.name.trim().length < 2) {
    errors.name = "Please enter the recipient's full name.";
  }
  if (values.address.trim().length < 5) {
    errors.address = "Please enter the full delivery address.";
  }
  if (values.city.trim().length < 2) {
    errors.city = "Please enter the city.";
  }
  if (values.postalCode.trim().length < 3) {
    errors.postalCode = "Please enter the postal code.";
  }
  if (values.country.trim().length < 2) {
    errors.country = "Please enter the country.";
  }
  return errors;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();
  const { format } = useCurrency();
  const { push } = useToast();

  const [values, setValues] = useState<ShippingValues>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [attempted, setAttempted] = useState(false);

  const shipping = count === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleText = (field: TextField) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    if (count === 0) {
      push("Your cart is empty. Add a timepiece before requesting an invoice.", "error");
      return;
    }

    const validation = validate(values);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      push("Please correct the highlighted fields.", "error");
      return;
    }

    navigate("/enquiry", {
      state: {
        productName: "",
        message: "Please send me a proforma invoice for my cart.",
      },
    });
  };

  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-5 py-16 text-center md:py-20">
          <span className="eyebrow">Checkout</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl">
            Request your <span className="text-gold">proforma invoice</span>
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash">
            Review your selection, confirm the delivery details and ask our team for a proforma
            invoice. We verify stock and confirm the total before anything is charged.
          </p>
        </div>
      </section>

      {/* Payment notice */}
      <section className="border-b border-gold/25 bg-charcoal">
        <div className="container-luxe flex items-start gap-3 py-4">
          <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-xs leading-relaxed text-ash">
            <span className="font-medium uppercase tracking-[0.12em] text-gold-light">
              Online payment is not enabled for this deployment.
            </span>{" "}
            No payment details are collected on this page and no payment is processed. Orders are
            confirmed by TIMECRAFT against a proforma invoice issued through the enquiry team.
          </p>
        </div>
      </section>

      <section className="container-luxe grid gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* Left: contact + shipping */}
        <Reveal>
          <div className="border border-white/10 bg-charcoal p-6 sm:p-8">
            <SectionHeading
              align="left"
              eyebrow="Step One"
              title="Contact & delivery details"
              subtitle="We use these details to prepare the invoice and to arrange delivery. Nothing is charged here."
            />

            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    Email
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleText("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "checkout-email-error" : undefined}
                    className={`field ${errors.email ? "field-error" : ""}`}
                  />
                  {errors.email ? (
                    <p id="checkout-email-error" className="mt-2 text-xs text-red-200">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    Phone
                  </label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleText("phone")}
                    placeholder="+91 00000 00000"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
                    className={`field ${errors.phone ? "field-error" : ""}`}
                  />
                  {errors.phone ? (
                    <p id="checkout-phone-error" className="mt-2 text-xs text-red-200">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-name"
                  className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                >
                  Recipient name
                </label>
                <input
                  id="checkout-name"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleText("name")}
                  placeholder="Full name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "checkout-name-error" : undefined}
                  className={`field ${errors.name ? "field-error" : ""}`}
                />
                {errors.name ? (
                  <p id="checkout-name-error" className="mt-2 text-xs text-red-200">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                >
                  Street address
                </label>
                <textarea
                  id="checkout-address"
                  name="address"
                  rows={3}
                  value={values.address}
                  onChange={handleText("address")}
                  placeholder="Flat / house number, street, landmark"
                  autoComplete="street-address"
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "checkout-address-error" : undefined}
                  className={`field resize-y ${errors.address ? "field-error" : ""}`}
                />
                {errors.address ? (
                  <p id="checkout-address-error" className="mt-2 text-xs text-red-200">
                    {errors.address}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    City
                  </label>
                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    value={values.city}
                    onChange={handleText("city")}
                    placeholder="City"
                    autoComplete="address-level2"
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "checkout-city-error" : undefined}
                    className={`field ${errors.city ? "field-error" : ""}`}
                  />
                  {errors.city ? (
                    <p id="checkout-city-error" className="mt-2 text-xs text-red-200">
                      {errors.city}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="checkout-state"
                    className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    State
                  </label>
                  <input
                    id="checkout-state"
                    name="state"
                    type="text"
                    value={values.state}
                    onChange={handleText("state")}
                    placeholder="State"
                    autoComplete="address-level1"
                    className="field"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-postal"
                    className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    Postal code
                  </label>
                  <input
                    id="checkout-postal"
                    name="postalCode"
                    type="text"
                    value={values.postalCode}
                    onChange={handleText("postalCode")}
                    placeholder="000000"
                    autoComplete="postal-code"
                    aria-invalid={Boolean(errors.postalCode)}
                    aria-describedby={errors.postalCode ? "checkout-postal-error" : undefined}
                    className={`field ${errors.postalCode ? "field-error" : ""}`}
                  />
                  {errors.postalCode ? (
                    <p id="checkout-postal-error" className="mt-2 text-xs text-red-200">
                      {errors.postalCode}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-country"
                  className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-ash"
                >
                  Country
                </label>
                <input
                  id="checkout-country"
                  name="country"
                  type="text"
                  value={values.country}
                  onChange={handleText("country")}
                  placeholder="Country"
                  autoComplete="country-name"
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={errors.country ? "checkout-country-error" : undefined}
                  className={`field ${errors.country ? "field-error" : ""}`}
                />
                {errors.country ? (
                  <p id="checkout-country-error" className="mt-2 text-xs text-red-200">
                    {errors.country}
                  </p>
                ) : null}
              </div>

              {attempted && count === 0 ? (
                <p
                  role="alert"
                  className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                >
                  Your cart is empty. Add a timepiece before requesting an invoice.
                </p>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={count === 0} icon={<Icon name="mail" size={15} />}>
                  Request Invoice via Enquiry
                </Button>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ash transition hover:text-gold"
                >
                  <Icon name="arrowLeft" size={14} />
                  Continue shopping
                </Link>
              </div>
            </form>
          </div>
        </Reveal>

        {/* Right: order summary */}
        <Reveal delay={120}>
          <div className="border border-white/10 bg-charcoal p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl text-white">Order summary</h2>
            <div className="gold-rule mt-3 w-full max-w-[90px]" />

            {items.length ? (
              <>
                <ul className="mt-6 flex flex-col gap-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="h-20 w-16 shrink-0 overflow-hidden border border-white/10 bg-[#0d0d0d]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <WatchArtwork art={item.art} label={item.name} className="h-full w-full" />
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-sm text-warm-white">{item.name}</p>
                        <p className="text-xs text-ash">{format(item.price)} each</p>
                        <div className="mt-1 flex items-center gap-3">
                          <div className="flex items-center border border-white/15">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="px-2.5 py-1.5 text-ash transition hover:text-gold"
                            >
                              <Icon name="minus" size={12} />
                            </button>
                            <span className="min-w-8 text-center text-xs text-warm-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="px-2.5 py-1.5 text-ash transition hover:text-gold"
                            >
                              <Icon name="plus" size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ash transition hover:text-red-300"
                          >
                            <Icon name="trash" size={12} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <span className="shrink-0 text-sm text-warm-white">
                        {format(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Subtotal</dt>
                    <dd className="text-warm-white">{format(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Shipping</dt>
                    <dd className="text-warm-white">{shipping === 0 ? "Free" : format(shipping)}</dd>
                  </div>
                  {remainingForFreeShipping > 0 ? (
                    <p className="text-xs leading-relaxed text-ash">
                      Add {format(remainingForFreeShipping)} more for free shipping.
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
                    <dt className="font-display text-xl text-white">Total</dt>
                    <dd className="font-display text-xl text-gold">{format(total)}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-xs leading-relaxed text-ash">
                  Duties, import taxes and any courier charges are confirmed separately in the
                  proforma invoice. This summary is an estimate, not a payable total.
                </p>
              </>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-4 border border-dashed border-white/15 px-6 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center border border-white/15 text-gold">
                  <Icon name="cart" size={24} />
                </span>
                <p className="text-sm leading-relaxed text-ash">
                  Your cart is empty. Add a timepiece and it will appear here with the full order
                  summary.
                </p>
                <Button to="/shop" variant="dark" icon={<Icon name="arrowRight" size={15} />}>
                  Continue shopping
                </Button>
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
