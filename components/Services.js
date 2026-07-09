const services = [
  {
    title: "Haircuts",
    desc: "Fresh, sharp cuts from experienced barbers and stylists for kids and adults.",
    appt: true,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M20 4L8.5 15.5M14.5 14.5L20 20M8.5 8.5L10 10"></path>
      </svg>
    )
  },
  {
    title: "Silk Press",
    desc: "Smooth, healthy silk press styling for a polished, back-to-school look.",
    appt: true,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"></path>
      </svg>
    )
  },
  {
    title: "Natural Updo",
    desc: "Elegant natural-hair updo styling done with care by our stylists.",
    appt: true,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
      </svg>
    )
  },
  {
    title: "Kids Ponytail Styles",
    desc: "Fun, neat ponytail styles to send your little one to school with confidence.",
    appt: true,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M12 11v9M9 14l3-3 3 3"></path>
      </svg>
    )
  },
  {
    title: "Kids Braided Styles",
    desc: "Durable, cute braided styles built to last through the first weeks of school.",
    appt: true,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M10 4v16M14 4v16M18 4v16"></path>
      </svg>
    )
  },
  {
    title: "Backpacks",
    desc: "Sturdy backpacks for every child who registers, while supplies last.",
    appt: false,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0v3H6z"></path>
        <rect x="4" y="11" width="16" height="10" rx="2"></rect>
        <path d="M9 15h6"></path>
      </svg>
    )
  },
  {
    title: "School Supplies",
    desc: "Notebooks, pencils, and classroom essentials to help every child start ready.",
    appt: false,
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    )
  }
];

export default function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What&apos;s Available</span>
          <h2>Services for the whole family</h2>
          <p>Every service is free thanks to our sponsors, volunteers, and CMAR members giving back to Jackson.</p>
        </div>

        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className={`tag ${s.appt ? "tag-appt" : "tag-open"}`}>
                {s.appt ? "Appointment Only" : "No Appointment · While Supplies Last"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
