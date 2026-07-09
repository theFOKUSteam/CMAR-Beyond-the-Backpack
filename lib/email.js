import { Resend } from "resend";

/**
 * Sends the "New Beyond the Backpack Registration" notification email to the
 * CMAR team whenever someone submits the registration form.
 *
 * Requires the RESEND_API_KEY environment variable. See .env.example and the
 * README for setup instructions (https://resend.com).
 */
export async function sendRegistrationEmail(registration) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Fail loudly in logs so this is easy to notice during setup, but throw
    // so the API route can return a clear error to the person registering
    // rather than silently pretending the email was sent.
    throw new Error(
      "RESEND_API_KEY is not set. Add it to your environment variables (see .env.example)."
    );
  }

  const resend = new Resend(apiKey);

  const from = process.env.EMAIL_FROM || "Beyond the Backpack <onboarding@resend.dev>";
  const toList = (process.env.EMAIL_TO || "kaye@thefokusteam.com,cmarealtist@gmail.com")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short"
  });

  const row = (label, value) =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e7e2d6;font-weight:600;color:#1F3A5F;white-space:nowrap;">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e7e2d6;color:#14201b;">${value || "—"}</td>
    </tr>`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1F3A5F;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;font-size:18px;margin:0;">New Beyond the Backpack Registration</h1>
      </div>
      <div style="border:1px solid #e7e2d6;border-top:none;border-radius:0 0 8px 8px;padding:8px 0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row("Parent Name", registration.parentName)}
          ${row("Phone Number", registration.phone)}
          ${row("Email", registration.email)}
          ${row("Student Name", registration.studentName)}
          ${row("Student Age", registration.studentAge)}
          ${row("Grade", registration.grade)}
          ${row("School", registration.school)}
          ${row("Registration Type", registration.registrationTypeLabel)}
          ${row("Hair Service Requested", registration.hairService || "None")}
          ${row("Backpack Requested", registration.backpackRequested ? "Yes" : "No")}
          ${row("Photo/Video Release", registration.photoRelease === "yes" ? "Yes" : "No")}
          ${row("Special Notes", registration.specialNotes)}
          ${row("Date &amp; Time Submitted", submittedAt + " (Central)")}
        </table>
      </div>
      <p style="font-size:12px;color:#6b7a75;margin-top:16px;">
        This is an automated notification from the Beyond the Backpack registration website.
      </p>
    </div>
  `;

  const text = [
    "New Beyond the Backpack Registration",
    `Parent Name: ${registration.parentName}`,
    `Phone Number: ${registration.phone}`,
    `Email: ${registration.email}`,
    `Student Name: ${registration.studentName}`,
    `Student Age: ${registration.studentAge}`,
    `Grade: ${registration.grade}`,
    `School: ${registration.school}`,
    `Registration Type: ${registration.registrationTypeLabel}`,
    `Hair Service Requested: ${registration.hairService || "None"}`,
    `Backpack Requested: ${registration.backpackRequested ? "Yes" : "No"}`,
    `Photo/Video Release: ${registration.photoRelease === "yes" ? "Yes" : "No"}`,
    `Special Notes: ${registration.specialNotes || "—"}`,
    `Date & Time Submitted: ${submittedAt} (Central)`
  ].join("\n");

  return resend.emails.send({
    from,
    to: toList,
    replyTo: registration.email || undefined,
    subject: "New Beyond the Backpack Registration",
    html,
    text
  });
}
