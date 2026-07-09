import { NextResponse } from "next/server";
import { getSlotsForService, getPooledServices, getCapacityForService } from "@/lib/slots";
import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/slots?hairService=Haircut
 *
 * Returns the slot list for the given hair service, each with how many
 * spots remain. Capacity and remaining counts are POOLED across every
 * service that shares the same staff (e.g. all 4 styling services share
 * one pool of 3 stylist spots per slot — booking any one of them counts
 * against the same total).
 *
 * If Supabase storage isn't configured (see .env.example), there's no
 * persistent record of who booked what, so `remaining` is returned as
 * null and the UI shows the slots without a live count rather than
 * guessing.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hairService = searchParams.get("hairService");

  const slots = getSlotsForService(hairService);
  if (slots.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  const capacity = getCapacityForService(hairService);
  const pooledServices = getPooledServices(hairService);

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      slots: slots.map((s) => ({ ...s, remaining: null, capacity }))
    });
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("appointment_slot")
      .in("hair_service", pooledServices);

    if (error) throw error;

    const counts = {};
    for (const row of data || []) {
      if (!row.appointment_slot) continue;
      counts[row.appointment_slot] = (counts[row.appointment_slot] || 0) + 1;
    }

    const slotsWithCounts = slots.map((s) => ({
      ...s,
      capacity,
      remaining: Math.max(capacity - (counts[s.id] || 0), 0)
    }));

    return NextResponse.json({ slots: slotsWithCounts });
  } catch (err) {
    console.error("Failed to fetch slot availability:", err);
    // Fail open with unknown counts rather than blocking the form entirely.
    return NextResponse.json({
      slots: slots.map((s) => ({ ...s, remaining: null, capacity }))
    });
  }
}
