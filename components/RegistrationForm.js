"use client";

import { useState, useEffect, useCallback } from "react";

const HAIR_SERVICES = ["Haircut", "Silk Press", "Natural Updo", "Kids Ponytail Style", "Kids Braided Style"];

const REGISTRATION_TYPES = [
  { value: "hair_and_backpack", title: "Hair Service + Backpack", sub: "Get styled and take home a backpack" },
  { value: "hair_only", title: "Hair Service Only", sub: "Just the haircut or style" },
  { value: "backpack_only", title: "Backpack & School Supplies Only", sub: "No hair service needed" }
];

const initialState = {
  parentName: "",
  phone: "",
  email: "",
  studentName: "",
  studentAge: "",
  grade: "",
  school: "",
  registrationType: "",
  hairService: "",
  appointmentSlot: "",
  specialNotes: "",
  consentParent: false,
  consentLiability: false,
  ackApptOnly: false,
  ackNoGuarantee: false,
  ackAccompanied: false,
  ackWhileSuppliesLast: false,
  ackAccurate: false,
  ackLatePolicy: false,
  photoRelease: ""
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const needsHairService = form.registrationType === "hair_and_backpack" || form.registrationType === "hair_only";
  const wantsBackpack = form.registrationType === "hair_and_backpack" || form.registrationType === "backpack_only";

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Whenever the chosen hair service changes, fetch that service's slot
  // list (with live remaining-capacity counts if the database is set up).
  const fetchSlots = useCallback(async (hairService) => {
    if (!hairService) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/slots?hairService=${encodeURIComponent(hairService)}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (needsHairService && form.hairService) {
      fetchSlots(form.hairService);
    } else {
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.hairService, needsHairService]);

  function validate() {
    const e = {};
    if (!form.parentName.trim()) e.parentName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.studentName.trim()) e.studentName = "Required";
    if (!form.studentAge.trim()) e.studentAge = "Required";
    if (!form.grade.trim()) e.grade = "Required";
    if (!form.school.trim()) e.school = "Required";
    if (!form.registrationType) e.registrationType = "Please select a registration type";
    if (needsHairService && !form.hairService) e.hairService = "Please select one hair service";
    if (needsHairService && form.hairService && !form.appointmentSlot) {
      e.appointmentSlot = "Please choose an appointment time";
    }
    if (!form.consentParent) e.consentParent = "Required";
    if (!form.consentLiability) e.consentLiability = "Required";
    if (!form.ackApptOnly) e.ackApptOnly = "Required";
    if (!form.ackNoGuarantee) e.ackNoGuarantee = "Required";
    if (!form.ackAccompanied) e.ackAccompanied = "Required";
    if (!form.ackWhileSuppliesLast) e.ackWhileSuppliesLast = "Required";
    if (!form.ackAccurate) e.ackAccurate = "Required";
    if (needsHairService && !form.ackLatePolicy) e.ackLatePolicy = "Required";
    if (!form.photoRelease) e.photoRelease = "Please choose yes or no";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hairService: needsHairService ? form.hairService : null,
          appointmentSlot: needsHairService ? form.appointmentSlot : null,
          backpackRequested: wantsBackpack
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setServerError(data.message || "Something went wrong. Please try again or call 601-301-4144.");
        // If the slot just filled, refresh availability so the picker reflects reality.
        if (res.status === 409 && needsHairService) {
          fetchSlots(form.hairService);
        }
        return;
      }

      const chosenSlot = slots.find((s) => s.id === form.appointmentSlot);

      setConfirmation({
        parentName: form.parentName,
        studentName: form.studentName,
        registrationType: REGISTRATION_TYPES.find((t) => t.value === form.registrationType)?.title,
        hairService: needsHairService ? form.hairService : null,
        appointmentSlotLabel: chosenSlot ? chosenSlot.label : null,
        backpackRequested: wantsBackpack
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError("We couldn't reach the server. Please check your connection and try again.");
    }
  }

  function resetForm() {
    setForm(initialState);
    setErrors({});
    setStatus("idle");
    setConfirmation(null);
    setSlots([]);
  }

  if (status === "success" && confirmation) {
    return (
      <div className="confirm-shell">
        <div className="confirm-badge">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </div>
        <h2>Thank you for registering!</h2>
        <p className="confirm-lede">
          Your registration has been received. If you requested a hair service, a CMAR representative
          will contact you with your appointment time. We look forward to serving you on Saturday,
          August 1, 2026.
        </p>

        <dl className="confirm-summary">
          <dt>Parent / Guardian</dt>
          <dd>{confirmation.parentName}</dd>
          <dt>Student</dt>
          <dd>{confirmation.studentName}</dd>
          <dt>Registration Type</dt>
          <dd>{confirmation.registrationType}</dd>
          {confirmation.hairService && (
            <>
              <dt>Hair Service Requested</dt>
              <dd>{confirmation.hairService}</dd>
            </>
          )}
          {confirmation.appointmentSlotLabel && (
            <>
              <dt>Requested Appointment Time</dt>
              <dd>{confirmation.appointmentSlotLabel} on Saturday, August 1, 2026</dd>
            </>
          )}
          <dt>Backpack &amp; Supplies</dt>
          <dd>{confirmation.backpackRequested ? "Yes — while supplies last" : "Not requested"}</dd>
        </dl>

        <p className="hint">
          Questions in the meantime? Call CMAR at <strong>601-301-4144</strong>.
        </p>

        {confirmation.appointmentSlotLabel && (
          <p className="hint" style={{ marginTop: 8 }}>
            Please arrive <strong>10–15 minutes early</strong>. Appointments are held for up to 10 minutes
            past the scheduled start time — after that, the slot may be given to another family. If
            anything about your appointment changes, CMAR will contact you directly.
          </p>
        )}

        <button type="button" className="btn btn-outline" onClick={resetForm} style={{ marginTop: 20 }}>
          Register Another Student
        </button>
      </div>
    );
  }

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      {status === "error" && <div className="form-alert show">{serverError}</div>}

      {/* ---------------- Parent Information ---------------- */}
      <fieldset>
        <legend>Parent / Guardian Information</legend>
        <div className="field-row">
          <div>
            <label htmlFor="parentName">
              Parent / Guardian Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="parentName"
              autoComplete="name"
              value={form.parentName}
              onChange={(e) => update("parentName", e.target.value)}
              data-error={Boolean(errors.parentName)}
            />
            {errors.parentName && <div className="error-text show">Please enter your name.</div>}
          </div>
          <div>
            <label htmlFor="phone">
              Phone Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              autoComplete="tel"
              placeholder="(601) 555-0123"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              data-error={Boolean(errors.phone)}
            />
            {errors.phone && <div className="error-text show">Please enter a phone number.</div>}
          </div>
        </div>
        <div>
          <label htmlFor="email">
            Email Address <span className="req">*</span>
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            data-error={Boolean(errors.email)}
          />
          {errors.email && <div className="error-text show">Please enter a valid email address.</div>}
        </div>
      </fieldset>

      {/* ---------------- Student Information ---------------- */}
      <fieldset>
        <legend>Student Information</legend>
        <div className="field-row">
          <div>
            <label htmlFor="studentName">
              Student Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              value={form.studentName}
              onChange={(e) => update("studentName", e.target.value)}
              data-error={Boolean(errors.studentName)}
            />
            {errors.studentName && <div className="error-text show">Please enter the student&apos;s name.</div>}
          </div>
          <div>
            <label htmlFor="studentAge">
              Student Age <span className="req">*</span>
            </label>
            <input
              type="number"
              id="studentAge"
              min="0"
              max="21"
              value={form.studentAge}
              onChange={(e) => update("studentAge", e.target.value)}
              data-error={Boolean(errors.studentAge)}
            />
            {errors.studentAge && <div className="error-text show">Please enter the student&apos;s age.</div>}
          </div>
        </div>
        <div className="field-row">
          <div>
            <label htmlFor="grade">
              Grade <span className="req">*</span>
            </label>
            <input
              type="text"
              id="grade"
              placeholder="e.g. 3rd Grade"
              value={form.grade}
              onChange={(e) => update("grade", e.target.value)}
              data-error={Boolean(errors.grade)}
            />
            {errors.grade && <div className="error-text show">Please enter the student&apos;s grade.</div>}
          </div>
          <div>
            <label htmlFor="school">
              School <span className="req">*</span>
            </label>
            <input
              type="text"
              id="school"
              value={form.school}
              onChange={(e) => update("school", e.target.value)}
              data-error={Boolean(errors.school)}
            />
            {errors.school && <div className="error-text show">Please enter the student&apos;s school.</div>}
          </div>
        </div>
      </fieldset>

      {/* ---------------- Registration Type ---------------- */}
      <fieldset>
        <legend>
          Registration Type <span className="req">*</span>
        </legend>
        <div className="radio-cards">
          {REGISTRATION_TYPES.map((t) => (
            <label className={`radio-card ${form.registrationType === t.value ? "checked" : ""}`} key={t.value}>
              <input
                type="radio"
                name="registrationType"
                value={t.value}
                checked={form.registrationType === t.value}
                onChange={(e) => {
                  update("registrationType", e.target.value);
                  update("hairService", "");
                  update("appointmentSlot", "");
                }}
              />
              <span className="rc-title">{t.title}</span>
              <span className="rc-sub">{t.sub}</span>
            </label>
          ))}
        </div>
        {errors.registrationType && <div className="error-text show">{errors.registrationType}</div>}

        {needsHairService && (
          <div className="conditional-block" style={{ marginTop: 20 }}>
            <label style={{ marginBottom: 12 }}>
              Select ONE Hair Service <span className="req">*</span>
            </label>
            <div className="hair-options">
              {HAIR_SERVICES.map((service) => (
                <label className={`hair-option ${form.hairService === service ? "checked" : ""}`} key={service}>
                  <input
                    type="radio"
                    name="hairService"
                    value={service}
                    checked={form.hairService === service}
                    onChange={(e) => {
                      update("hairService", e.target.value);
                      update("appointmentSlot", "");
                    }}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {errors.hairService && <div className="error-text show">{errors.hairService}</div>}

            {form.hairService && (
              <div style={{ marginTop: 20 }}>
                <label style={{ marginBottom: 6 }}>
                  Choose an Appointment Time <span className="req">*</span>
                </label>
                <p className="hint" style={{ marginTop: -2, marginBottom: 12 }}>
                  {form.hairService === "Haircut"
                    ? "Haircuts are scheduled in 45-minute slots."
                    : "Styling services are scheduled in 60-minute slots."}
                </p>
                {slotsLoading ? (
                  <p className="hint">Loading available times…</p>
                ) : (
                  <div className="slots">
                    {slots.map((slot) => {
                      const isFull = slot.remaining !== null && slot.remaining <= 0;
                      const isSelected = form.appointmentSlot === slot.id;
                      return (
                        <label
                          key={slot.id}
                          className={`slot ${isSelected ? "selected" : ""} ${isFull ? "full" : ""}`}
                        >
                          <input
                            type="radio"
                            name="appointmentSlot"
                            value={slot.id}
                            disabled={isFull}
                            checked={isSelected}
                            onChange={(e) => update("appointmentSlot", e.target.value)}
                          />
                          {slot.label}
                          <span className="cap">
                            {isFull
                              ? "Full"
                              : slot.remaining !== null
                              ? `${slot.remaining} spot${slot.remaining === 1 ? "" : "s"} left`
                              : "Limited availability"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {errors.appointmentSlot && <div className="error-text show">{errors.appointmentSlot}</div>}

                {form.appointmentSlot && (
                  <div className="late-policy-box">
                    <p>
                      <strong>Please arrive 10–15 minutes before your scheduled time.</strong> Appointments
                      are held for up to 10 minutes past the start time — after that, the slot may be given
                      to another family so we can serve as many children as possible. If anything about your
                      appointment changes, a CMAR representative will contact you directly using the phone
                      number or email you provided below.
                    </p>
                    <label className="consent-item" style={{ marginTop: 12 }}>
                      <input
                        type="checkbox"
                        checked={form.ackLatePolicy}
                        onChange={(e) => update("ackLatePolicy", e.target.checked)}
                        data-error={Boolean(errors.ackLatePolicy)}
                      />
                      <p>
                        I understand the 10-minute late policy and will do my best to arrive on time.{" "}
                        <span className="req">*</span>
                      </p>
                    </label>
                    {errors.ackLatePolicy && <div className="error-text show">This acknowledgement is required.</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </fieldset>

      {/* ---------------- Special Notes ---------------- */}
      <fieldset>
        <legend>Special Notes</legend>
        <label htmlFor="specialNotes">Allergies, medical concerns, or anything we should know</label>
        <textarea
          id="specialNotes"
          value={form.specialNotes}
          onChange={(e) => update("specialNotes", e.target.value)}
          placeholder="Optional"
        />
      </fieldset>

      {/* ---------------- Consent & Acknowledgements ---------------- */}
      <fieldset>
        <legend>Parent Consent &amp; Event Acknowledgements</legend>
        <div className="consent-list">
          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.consentParent}
              onChange={(e) => update("consentParent", e.target.checked)}
              data-error={Boolean(errors.consentParent)}
            />
            <p>
              <strong>Parent/Guardian Consent —</strong> I certify that I am the parent or legal guardian
              of the child listed above and authorize my child to receive the selected hair service
              during the Beyond the Backpack event. <span className="req">*</span>
            </p>
          </label>
          {errors.consentParent && <div className="error-text show">This acknowledgement is required.</div>}

          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.consentLiability}
              onChange={(e) => update("consentLiability", e.target.checked)}
              data-error={Boolean(errors.consentLiability)}
            />
            <p>
              <strong>Liability Acknowledgement —</strong> I understand that hair services are provided
              by volunteer licensed professionals and/or supervised cosmetology students participating
              in this community event. I voluntarily allow my child to participate and release the
              Central Mississippi Association of Realtists (CMAR), event sponsors, volunteers,
              participating barbers, stylists, cosmetology students, instructors, and the event venue
              from liability for ordinary risks associated with participation, except where prohibited
              by applicable law. <span className="req">*</span>
            </p>
          </label>
          {errors.consentLiability && <div className="error-text show">This acknowledgement is required.</div>}

          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.ackApptOnly}
              onChange={(e) => update("ackApptOnly", e.target.checked)}
              data-error={Boolean(errors.ackApptOnly)}
            />
            <p>Hair services are by appointment only. <span className="req">*</span></p>
          </label>
          {errors.ackApptOnly && <div className="error-text show">This acknowledgement is required.</div>}

          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.ackNoGuarantee}
              onChange={(e) => update("ackNoGuarantee", e.target.checked)}
              data-error={Boolean(errors.ackNoGuarantee)}
            />
            <p>
              Completing this registration does not guarantee an appointment until I receive
              confirmation from CMAR. <span className="req">*</span>
            </p>
          </label>
          {errors.ackNoGuarantee && <div className="error-text show">This acknowledgement is required.</div>}

          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.ackAccompanied}
              onChange={(e) => update("ackAccompanied", e.target.checked)}
              data-error={Boolean(errors.ackAccompanied)}
            />
            <p>My child must be accompanied by a parent or legal guardian. <span className="req">*</span></p>
          </label>
          {errors.ackAccompanied && <div className="error-text show">This acknowledgement is required.</div>}

          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.ackWhileSuppliesLast}
              onChange={(e) => update("ackWhileSuppliesLast", e.target.checked)}
              data-error={Boolean(errors.ackWhileSuppliesLast)}
            />
            <p>Backpacks and school supplies are available while supplies last. <span className="req">*</span></p>
          </label>
          {errors.ackWhileSuppliesLast && <div className="error-text show">This acknowledgement is required.</div>}

          <label className="consent-item">
            <input
              type="checkbox"
              checked={form.ackAccurate}
              onChange={(e) => update("ackAccurate", e.target.checked)}
              data-error={Boolean(errors.ackAccurate)}
            />
            <p>I certify that the information provided is accurate. <span className="req">*</span></p>
          </label>
          {errors.ackAccurate && <div className="error-text show">This acknowledgement is required.</div>}
        </div>
      </fieldset>

      {/* ---------------- Photo Release ---------------- */}
      <fieldset>
        <legend>
          Optional Photo &amp; Video Release <span className="req">*</span>
        </legend>
        <p className="hint" style={{ marginTop: -6, marginBottom: 14 }}>
          Giving permission is entirely optional — either answer is welcome and will not affect your
          child&apos;s registration or services.
        </p>
        <div className="photo-release">
          <label className={`radio-card ${form.photoRelease === "yes" ? "checked" : ""}`}>
            <input
              type="radio"
              name="photoRelease"
              value="yes"
              checked={form.photoRelease === "yes"}
              onChange={(e) => update("photoRelease", e.target.value)}
            />
            <span className="rc-title">Yes, I give permission</span>
            <span className="rc-sub">
              CMAR may photograph and/or record my child during the event for future promotional and
              community outreach purposes.
            </span>
          </label>
          <label className={`radio-card ${form.photoRelease === "no" ? "checked" : ""}`}>
            <input
              type="radio"
              name="photoRelease"
              value="no"
              checked={form.photoRelease === "no"}
              onChange={(e) => update("photoRelease", e.target.value)}
            />
            <span className="rc-title">No, I do not give permission</span>
            <span className="rc-sub">My child will not be photographed or recorded.</span>
          </label>
        </div>
        {errors.photoRelease && <div className="error-text show">{errors.photoRelease}</div>}
      </fieldset>

      <div className="submit-row">
        <button type="submit" className="btn btn-gold btn-lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting…" : "Submit Registration"}
        </button>
        <span className="form-msg">Free event · A CMAR representative will confirm hair service appointment times.</span>
      </div>
    </form>
  );
}
