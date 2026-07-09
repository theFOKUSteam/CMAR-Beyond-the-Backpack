/**
 * Appointment slot configuration for hair services.
 *
 * Capacity is based on actual staff, not an arbitrary number:
 *   - 3 barbers → Haircuts run in 45-minute slots, 3 people max per slot.
 *   - 3 stylists → Silk Press, Natural Updo, Kids Ponytail, and Kids
 *     Braided Styles all run in 60-minute slots, sharing ONE pool of
 *     3 spots per slot across all four style types combined (since the
 *     same 3 stylists perform any of them — three style bookings of any
 *     kind in the same hour is the real limit, not three of each type).
 *   - The event runs 10:00 AM to 1:00 PM (180 minutes).
 *
 * To change staffing, adjust BARBER_COUNT / STYLIST_COUNT below — every
 * slot's capacity updates automatically.
 */

export const BARBER_COUNT = 3;
export const STYLIST_COUNT = 3;

const EVENT_START_MINUTES = 10 * 60; // 10:00 AM
const EVENT_END_MINUTES = 13 * 60; // 1:00 PM

const STYLE_SERVICES = ["Silk Press", "Natural Updo", "Kids Ponytail Style", "Kids Braided Style"];

function formatTime(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildSlots(durationMinutes, prefix) {
  const slots = [];
  let start = EVENT_START_MINUTES;
  let index = 1;
  while (start + durationMinutes <= EVENT_END_MINUTES) {
    const end = start + durationMinutes;
    slots.push({
      id: `${prefix}-${index}`,
      label: `${formatTime(start)} – ${formatTime(end)}`,
      startMinutes: start,
      endMinutes: end
    });
    start = end;
    index += 1;
  }
  return slots;
}

const HAIRCUT_SLOTS = buildSlots(45, "barber"); // 4 slots: 10:00, 10:45, 11:30, 12:15
const STYLE_SLOTS = buildSlots(60, "stylist"); // 3 slots: 10:00, 11:00, 12:00

/**
 * "barber" (Haircut, capacity tied to BARBER_COUNT) or
 * "stylist" (the four styling services, capacity tied to STYLIST_COUNT
 * and POOLED across all of them since the same stylists do any of them).
 */
export function getCategoryForService(hairService) {
  if (hairService === "Haircut") return "barber";
  if (STYLE_SERVICES.includes(hairService)) return "stylist";
  return null;
}

/**
 * Every service name that shares the same staff pool/capacity as the given
 * service. For "Haircut" that's just itself; for any style service, that's
 * all four style services (they all draw from the same 3 stylists).
 */
export function getPooledServices(hairService) {
  const category = getCategoryForService(hairService);
  if (category === "barber") return ["Haircut"];
  if (category === "stylist") return STYLE_SERVICES;
  return [];
}

export function getCapacityForService(hairService) {
  const category = getCategoryForService(hairService);
  if (category === "barber") return BARBER_COUNT;
  if (category === "stylist") return STYLIST_COUNT;
  return 0;
}

/**
 * Returns the correct slot list for a given hair service.
 */
export function getSlotsForService(hairService) {
  const category = getCategoryForService(hairService);
  if (category === "barber") return HAIRCUT_SLOTS;
  if (category === "stylist") return STYLE_SLOTS;
  return [];
}

/**
 * Every valid slot id across both durations, useful for server-side
 * validation regardless of which service was chosen.
 */
export function getAllSlotIds() {
  return [...HAIRCUT_SLOTS, ...STYLE_SLOTS].map((s) => s.id);
}

export function getSlotById(slotId) {
  return [...HAIRCUT_SLOTS, ...STYLE_SLOTS].find((s) => s.id === slotId) || null;
}
