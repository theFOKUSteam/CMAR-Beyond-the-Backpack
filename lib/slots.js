/**
 * Appointment slot configuration for hair services.
 *
 * - Haircuts run in 45-minute slots (they're quicker).
 * - All styling services (Silk Press, Natural Updo, Kids Ponytail, Kids
 *   Braided) run in 60-minute slots (they take longer).
 * - The event runs 10:00 AM to 1:00 PM (180 minutes).
 * - Each slot holds SLOT_CAPACITY families by default — change this one
 *   number to adjust capacity across every slot.
 */

export const SLOT_CAPACITY = 10;

const EVENT_START_MINUTES = 10 * 60; // 10:00 AM
const EVENT_END_MINUTES = 13 * 60; // 1:00 PM

function formatTime(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildSlots(durationMinutes) {
  const slots = [];
  let start = EVENT_START_MINUTES;
  let index = 1;
  while (start + durationMinutes <= EVENT_END_MINUTES) {
    const end = start + durationMinutes;
    slots.push({
      id: `slot-${durationMinutes}-${index}`,
      label: `${formatTime(start)} – ${formatTime(end)}`,
      startMinutes: start,
      endMinutes: end
    });
    start = end;
    index += 1;
  }
  return slots;
}

const HAIRCUT_SLOTS = buildSlots(45); // 4 slots: 10:00, 10:45, 11:30, 12:15
const STYLE_SLOTS = buildSlots(60); // 3 slots: 10:00, 11:00, 12:00

const STYLE_SERVICES = ["Silk Press", "Natural Updo", "Kids Ponytail Style", "Kids Braided Style"];

/**
 * Returns the correct slot list for a given hair service.
 */
export function getSlotsForService(hairService) {
  if (hairService === "Haircut") return HAIRCUT_SLOTS;
  if (STYLE_SERVICES.includes(hairService)) return STYLE_SLOTS;
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
