import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (!env.mail.host || !env.mail.user) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure,
      auth: { user: env.mail.user, pass: env.mail.pass },
    });
  }
  return transporter;
}

const styles = `
  body { margin:0; padding:32px; background:#080808; font-family: 'Helvetica Neue', Arial, sans-serif; color:#F5F1E9; }
  .card { max-width:640px; margin:0 auto; background:#151515; border:1px solid rgba(184,148,88,0.35); border-radius:4px; padding:32px; }
  .kicker { color:#B89458; letter-spacing:3px; font-size:11px; text-transform:uppercase; margin:0 0 12px; }
  h1 { font-size:24px; font-weight:500; margin:0 0 20px; color:#fff; }
  h2 { font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#B89458; margin:24px 0 8px; }
  p { line-height:1.6; font-size:14px; color:#cfcfcf; margin:0 0 12px; }
  table { width:100%; border-collapse:collapse; margin-top:8px; }
  td { padding:8px 0; font-size:13px; border-bottom:1px solid rgba(255,255,255,0.08); color:#cfcfcf; vertical-align:top; }
  td.label { color:#8d8d8d; width:40%; }
  .ref { display:inline-block; padding:8px 14px; border:1px solid #B89458; color:#B89458; letter-spacing:2px; font-size:13px; }
  .foot { margin-top:28px; font-size:11px; color:#7a7a7a; letter-spacing:1px; }
`;

function layout({ kicker, title, body }) {
  return `<!doctype html><html><body><div class="card"><p class="kicker">${kicker}</p><h1>${title}</h1>${body}<p class="foot">TIMECRAFT &mdash; Excellence in Every Second</p></div></body></html>`;
}

function detailRows(enquiry) {
  const rows = [
    ["Reference", enquiry.reference],
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", `${enquiry.countryCode || ""} ${enquiry.phone}`.trim()],
    ["Enquiry Type", enquiry.enquiryType],
    ["Product", enquiry.productName || "—"],
    ["Budget", enquiry.budget || "—"],
    ["Quantity", enquiry.quantity || 1],
    ["Preferred Contact", enquiry.preferredContact],
    ["Submitted At", new Date(enquiry.submittedAt || Date.now()).toUTCString()],
  ];
  return rows
    .map(
      ([label, value]) =>
        `<tr><td class="label">${label}</td><td>${String(value ?? "—")}</td></tr>`,
    )
    .join("");
}

export async function sendEnquiryNotifications(enquiry) {
  const mailer = getTransporter();
  const results = { team: false, customer: false, skipped: true };

  if (!mailer) {
    console.warn(
      `[mail] SMTP not configured - enquiry ${enquiry.reference} notifications skipped (server-side only).`,
    );
    return results;
  }

  results.skipped = false;

  try {
    await mailer.sendMail({
      from: env.mail.from,
      to: env.mail.teamEmail,
      subject: `New ${enquiry.enquiryType} enquiry ${enquiry.reference} — ${enquiry.name}`,
      html: layout({
        kicker: "New Enquiry",
        title: `${enquiry.enquiryType} from ${enquiry.name}`,
        body: `<p>A new enquiry has been received through the TIMECRAFT website.</p>
          <span class="ref">${enquiry.reference}</span>
          <table>${detailRows(enquiry)}</table>
          <h2>Message</h2><p>${String(enquiry.message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    results.team = true;
  } catch (error) {
    console.error("[mail] team notification failed:", error.message);
  }

  try {
    await mailer.sendMail({
      from: env.mail.from,
      to: enquiry.email,
      subject: `We received your TIMECRAFT enquiry ${enquiry.reference}`,
      html: layout({
        kicker: "Thank You",
        title: "Your enquiry has been received",
        body: `<p>Dear ${enquiry.name},</p>
          <p>Thank you for contacting TIMECRAFT! Your enquiry has been received. Our team will get back to you shortly.</p>
          <span class="ref">${enquiry.reference}</span>
          <table>${detailRows(enquiry)}</table>
          <p style="margin-top:20px">We aim to respond within one business day.</p>`,
      }),
    });
    results.customer = true;
  } catch (error) {
    console.error("[mail] customer acknowledgement failed:", error.message);
  }

  return results;
}

export function mailerConfigured() {
  return Boolean(env.mail.host && env.mail.user);
}
