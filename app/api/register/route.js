import { NextResponse } from "next/server";
import { sendRegistrationEmail } from "@/lib/email";
import { saveRegistration, isSlotAvailable } from "@/lib/supabase";
import { getSlotById, getSlotsForService } from "@/lib/slots";

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

  // Appointment slot must be one of the valid slots FOR the chosen service
  // (a 45-min haircut slot id submitted for "Silk Press" is invalid, etc.)
  if (needsHairService) {
    const validSlotIds = getSlotsForService(body.hairService).map((s) => s.id);
    if (!validSlotIds.includes(body.appointmentSlot)) {
      errors.push("A valid appointmentSlot selection is required for this hair service.");
    }
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

  if (needsHairService && body.ackLatePolicy !== true) {
    errors.push("Missing required acknowledgement: ackLatePolicy");
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

  // Server-side capacity check — prevents two families racing for the last
  // spot in a slot from both getting confirmed. Only enforced when Supabase
  // storage is configured (see lib/supabase.js); otherwise this passes
  // through, since there's no persistent record to check against.
  const needsHairService = body.registrationType === "hair_and_backpack" || body.registrationType === "hair_only";
  if (needsHairService) {
    try {
      const available = await isSlotAvailable(body.hairService, body.appointmentSlot);
      if (!available) {
        return NextResponse.json(
          { message: "That time slot just filled up. Please choose a different time and submit again." },
          { status: 409 }
        );
      }
    } catch (err) {
      console.error("Failed to check slot availability:", err);
      // Fail open rather than blocking a registration over a capacity-check
      // hiccup — worst case, a slot is slightly over capacity, which is far
      // better than turning families away due to a database blip.
    }
  }

  const slotInfo = needsHairService ? getSlotById(body.appointmentSlot) : null;

  const registration = {
    ...body,
    registrationTypeLabel: REGISTRATION_TYPE_LABELS[body.registrationType],
    appointmentSlotLabel: slotInfo ? slotInfo.label : null
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
