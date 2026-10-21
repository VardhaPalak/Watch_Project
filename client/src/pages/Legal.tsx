import { Link, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { POLICY_LINKS } from "../config/site";

interface PolicySection {
  heading: string;
  body: string[];
}

interface Policy {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  sections: PolicySection[];
}

const LAST_UPDATED = "1 October 2026";

const POLICIES: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    intro:
      "This policy explains what information TIMECRAFT collects when you browse this storefront, place an enquiry or contact our team, and how that information is used.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Enquiry and contact details you submit through our forms, such as your name, email address, phone number, country code and the content of your message.",
          "Browsing information required to operate the storefront, including the products you view and the items you save to your wishlist. Wishlist and cart contents are stored locally in your own browser so that you can return to them.",
          "Basic technical information such as the browser type and the approximate region a request originates from, used to keep the site secure and to detect abuse.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "To respond to your enquiries, prepare quotations and arrange delivery, servicing and returns.",
          "To maintain the security and performance of the storefront and to prevent fraudulent activity.",
          "To send you service updates, such as dispatch confirmations or a reply to an enquiry, where you have asked us to contact you.",
        ],
      },
      {
        heading: "Sharing and retention",
        body: [
          "We share only what is necessary with the service providers that help us operate the store, such as the payment, courier and hosting providers involved in fulfilling an order. We do not sell your details to third parties.",
          "Enquiry records are retained for as long as needed to serve the customer relationship and to meet legal and accounting obligations. You can ask us to delete your details at any time by contacting us.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You may request a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to us using the details on the contact page and we will respond as quickly as we can.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    eyebrow: "Legal",
    intro:
      "These terms govern your use of the TIMECRAFT storefront and any enquiry, quotation or order placed through it.",
    sections: [
      {
        heading: "Using this storefront",
        body: [
          "This deployment is a demonstration storefront. Prices, availability, brand references and editorial content are illustrative and may change without notice.",
          "You agree to use the site lawfully and not to attempt to disrupt, probe or misuse the service or the enquiry channels it provides.",
        ],
      },
      {
        heading: "Products and availability",
        body: [
          "We aim to describe every timepiece accurately, including case material, movement type, water resistance and included accessories. Where a specification is unverified, it is marked as such.",
          "Brand names shown across the catalogue belong to their respective owners. TIMECRAFT is an independent retailer and is not affiliated with, endorsed by or authorised by the manufacturers shown.",
          "Stock levels are indicative. A confirmed order or quotation is only issued once availability has been verified with our partners.",
        ],
      },
      {
        heading: "Quotations, orders and pricing",
        body: [
          "Online payment is not enabled in this deployment, so no payment is processed on this site. Orders are confirmed by TIMECRAFT through a proforma invoice issued against a verified enquiry.",
          "Prices are shown in the currency configured for the storefront and exclude duties, import taxes and delivery charges unless those are explicitly stated.",
          "Any quotation is valid for the period stated in it. We reserve the right to withdraw a quotation if a price has been listed in error.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Nothing in these terms limits our liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be limited.",
          "Mechanical timepieces are precision instruments. We are not liable for indirect or consequential loss, including loss of profit, income or opportunity.",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping Policy",
    eyebrow: "Legal",
    intro:
      "How orders are prepared, dispatched and delivered once TIMECRAFT has confirmed an order and issued a proforma invoice.",
    sections: [
      {
        heading: "Dispatch",
        body: [
          "Once payment against a proforma invoice is confirmed, orders are prepared by our atelier partners. Preparation and quality checks typically take between three and seven working days.",
          "You receive a dispatch notification with the courier name and a tracking reference as soon as the parcel leaves us.",
        ],
      },
      {
        heading: "Delivery timelines and charges",
        body: [
          "Domestic deliveries typically arrive within two to five working days after dispatch. International deliveries typically arrive within five to twelve working days, depending on the destination and the courier used.",
          "Delivery charges and any duty or import tax are quoted per order and shown before the invoice is issued. Where a promotion states that shipping is free, that applies to the destinations named in the promotion.",
        ],
      },
      {
        heading: "Tracking, loss and damage",
        body: [
          "If a parcel is delayed, lost or arrives damaged, contact us within seven days of the expected delivery date and we will open a claim with the courier on your behalf.",
          "Please inspect the packaging on arrival. Damage should be photographed before the parcel is opened where possible, so the carrier can assess it.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    eyebrow: "Legal",
    intro:
      "The process for returning a timepiece, the condition we expect it in, and how refunds are issued once a return has been inspected.",
    sections: [
      {
        heading: "Return window",
        body: [
          "Unused, unworn timepieces in their original packaging may be returned within thirty days of delivery. A return request must be raised with us before the item is sent back.",
          "We cannot accept returns on engraved, sized or commissioned pieces once they have been personalised, or on items that have been worn, serviced or altered.",
        ],
      },
      {
        heading: "How to return an item",
        body: [
          "Contact us with your order reference and the reason for the return. We will confirm the return address and the courier arrangements in writing.",
          "Items should be returned in the original TIMECRAFT packaging, with all accessories, tags and documentation. You are responsible for the return journey until the parcel reaches us.",
        ],
      },
      {
        heading: "Inspection and refunds",
        body: [
          "Returned pieces are inspected against the original condition record before a refund is approved. Inspection usually takes between five and ten working days after the parcel arrives.",
          "Approved refunds are issued to the original payment method. Your bank or card provider may take a further few working days to show the credit. Original delivery charges are only refunded where the return was caused by our error.",
        ],
      },
    ],
  },
];

const NAV_ITEMS = POLICY_LINKS.map((policy) => ({
  slug: policy.to.replace("/legal/", ""),
  label: policy.label,
}));

export default function Legal() {
  const { slug } = useParams();
  const policy = POLICIES.find((item) => item.slug === slug);

  if (!policy) {
    return (
      <section className="flex min-h-[70vh] items-center bg-jet-black">
        <div className="container-luxe flex flex-col items-center gap-6 py-24 text-center">
          <span className="font-display text-7xl leading-none text-gold sm:text-8xl">404</span>
          <h1 className="font-display text-3xl text-white sm:text-4xl">Policy not found</h1>
          <p className="max-w-md text-sm leading-relaxed text-ash">
            The policy page you requested does not exist. Browse the available policies or get in
            touch with the team.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/" variant="gold">
              Back to Home
            </Button>
            <Button to="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-5 py-20 text-center md:py-24">
          <span className="eyebrow">{policy.eyebrow}</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl">
            {policy.title}
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash sm:text-base">
            {policy.intro}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-ash/80">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Document */}
      <section className="container-luxe grid gap-10 py-16 md:py-20 lg:grid-cols-[240px_1fr] lg:gap-14">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Policies" className="border border-white/10 bg-charcoal p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gold">Policies</p>
            <ul className="mt-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/legal/${item.slug}`}
                    aria-current={item.slug === policy.slug ? "page" : undefined}
                    className={`flex items-center gap-2 text-sm transition ${
                      item.slug === policy.slug ? "text-gold" : "text-ash hover:text-gold"
                    }`}
                  >
                    <Icon name="chevronRight" size={13} className="shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="gold-rule my-5 w-full" />
            <p className="text-xs leading-relaxed text-ash">
              Need something clarified? Our team handles policy questions directly.
            </p>
            <Button to="/contact" variant="outline" size="sm" className="mt-4 w-full">
              Contact Us
            </Button>
          </nav>
        </Reveal>

        <Reveal delay={100}>
          <article className="flex flex-col gap-10">
            {policy.sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-3">
                <h2 className="font-display text-2xl text-white sm:text-3xl">{section.heading}</h2>
                <div className="gold-rule w-full max-w-[90px]" />
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-ash sm:text-[15px]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <div className="border border-gold/25 bg-gold/5 p-6">
              <h2 className="font-display text-xl text-white">Questions about this policy?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                Written clarifications are the fastest way to settle a question about orders,
                deliveries or returns. Send us the details and we will respond in writing.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button to="/contact" icon={<Icon name="mail" size={15} />}>
                  Contact the Team
                </Button>
                <Button to="/enquiry" variant="outline">
                  Make an Enquiry
                </Button>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-ash/80">
              This document is template copy prepared for the TIMECRAFT storefront build. It is a
              starting point and should be reviewed against your business requirements and local
              law before launch.
            </p>
          </article>
        </Reveal>
      </section>
    </div>
  );
}
