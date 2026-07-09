import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client for securely storing registrations, or null if
 * Supabase hasn't been configured. This makes storage entirely optional:
 * the site works perfectly (and still emails every registration) even if
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are never set.
 *
 * Setup instructions and the required table schema are in the README.
 */
export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

/**
 * Saves a registration row. Any failure here is caught by the caller so a
 * storage hiccup never blocks the (more time-sensitive) email notification
 * or the confirmation shown to the family registering.
 */
export async function saveRegistration(registration) {
  const supabase = getSupabaseClient();
  if (!supabase) return { skipped: true };

  const { error } = await supabase.from("registrations").insert([
    {
      parent_name: registration.parentName,
      phone: registration.phone,
      email: registration.email,
      student_name: registration.studentName,
      student_age: registration.studentAge,
      grade: registration.grade,
      school: registration.school,
      registration_type: registration.registrationType,
      hair_service: registration.hairService,
      backpack_requested: registration.backpackRequested,
      special_notes: registration.specialNotes,
      photo_release: registration.photoRelease,
      submitted_at: new Date().toISOString()
    }
  ]);

  if (error) throw error;
  return { skipped: false };
}
