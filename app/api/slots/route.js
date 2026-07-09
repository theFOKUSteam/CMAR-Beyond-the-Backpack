import { NextResponse } from "next/server";
import { getSlotsForService, SLOT_CAPACITY } from "@/lib/slots";
import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/slots?hairService=Haircut
 *
 * Returns the slot list for the given hair service, each with how many
 * spots remain. If Supabase storage isn't configured (see .env.example),
 * there's no persistent record of who booked what, so `remaining` is
 * returned as null and the UI shows the slots without a live count rather
 * than guessing.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hairService = searchParams.get("hairService");

  const slots = getSlotsForService(hairService);
  if (slots.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      slots: slots.map((s) => ({ ...s, remaining: null, capacity: SLOT_CAPACITY }))
    });
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("appointment_slot")
      .eq("hair_service", hairService);

    if (error) throw error;

    const counts = {};
    for (const row of data || []) {
      if (!row.appointment_slot) continue;
      counts[row.appointment_slot] = (counts[row.appointment_slot] || 0) + 1;
    }

    const slotsWithCounts = slots.map((s) => ({
      ...s,
      capacity: SLOT_CAPACITY,
      remaining: Math.max(SLOT_CAPACITY - (counts[s.id] || 0), 0)
    }));

    return NextResponse.json({ slots: slotsWithCounts });
  } catch (err) {
    console.error("Failed to fetch slot availability:", err);
    // Fail open with unknown counts rather than blocking the form entirely.
    return NextResponse.json({
      slots: slots.map((s) => ({ ...s, remaining: null, capacity: SLOT_CAPACITY }))
    });
  }
}
