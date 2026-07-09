import { NextResponse } from "next/server";
import { sendRegistrationEmail } from "@/lib/email";
import { saveRegistration } from "@/lib/supabase";

// This route needs the Node.js runtime (not Edge) because the Resend and
// Supabase SDKs rely on Node APIs.
export const runtime = "nodejs";

const REGISTRATION_TYPE_LABELS = {
  hair_and_backpack: "Hair Service + Backpack",
  hair_only: "Hair Service Only",
  backpack_only: "Backpack & School Supplies Only"
};

const VALID_HAIR_SERVICES = ["Haircut", "Silk Press", "Natural Updo", "Kids Ponytail Style", "Kids Braided Style"];

function validate(body) {
  const errors = [];

  const requiredStrings = ["parentName", "phone", "email", "studentName", "studentAge", "grade", "school"];
  for (const field of requiredStrings) {
    if (!body[field] || String(body[field]).trim() === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (!REGISTRATION_TYPE_LABELS[body.registrationType]) {
    errors.push("Invalid or missing registrationType.");
  }

  const needsHairService = body.registrationType === "hair_and_backpack" || body.registrationType === "hair_only";
  if (needsHairService && !VALID_HAIR_SERVICES.includes(body.hairService)) {
    errors.push("A valid hairService selection is required for this registration type.");
  }

  const requiredConsents = [
    "consentParent",
    "consentLiability",
    "ackApptOnly",
    "ackNoGuarantee",
    "ackAccompanied",
    "ackWhileSuppliesLast",
    "ackAccurate"
  ];
  for (const field of requiredConsents) {
    if (body[field] !== true) {
      errors.push(`Missing required acknowledgement: ${field}`);
    }
  }

  if (body.photoRelease !== "yes" && body.photoRelease !== "no") {
    errors.push("photoRelease must be 'yes' or 'no'.");
  }

  // Basic email sanity check.
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Invalid email address.");
  }

  return errors;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ message: "Please complete all required fields.", errors }, { status: 400 });
  }

  const registration = {
    ...body,
    registrationTypeLabel: REGISTRATION_TYPE_LABELS[body.registrationType]
  };

  // Storage is best-effort: a database hiccup should never block someone
  // from successfully registering, since the email notification (below) is
  // the required, must-always-work path.
  try {
    await saveRegistration(registration);
  } catch (err) {
    console.error("Failed to save registration to Supabase:", err);
  }

  try {
    await sendRegistrationEmail(registration);
  } catch (err) {
    console.error("Failed to send registration email:", err);
    return NextResponse.json(
      {
        message:
          "Your registration could not be emailed to our team automatically. Please call CMAR at 601-301-4144 to confirm your registration."
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Registration received." }, { status: 200 });
}
