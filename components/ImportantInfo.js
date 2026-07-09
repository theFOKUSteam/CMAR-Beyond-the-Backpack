const notices = [
  "Hair services are by appointment only.",
  "Appointments are limited — register early to secure your child's spot.",
  "Backpacks and school supplies are available while supplies last.",
  "Children receiving hair services should arrive with clean, detangled hair to help keep appointments on schedule."
];

export default function ImportantInfo() {
  return (
    <section>
      <div className="container">
        <div className="notice-panel">
          <div className="notice-panel-inner">
            <span className="eyebrow" style={{ color: "#ecd48a", borderColor: "rgba(236,212,138,0.4)", background: "rgba(236,212,138,0.08)" }}>
              Please Read Before Registering
            </span>
            <h2 style={{ marginTop: 16 }}>Important Information</h2>
            <ul className="notice-list">
              {notices.map((n) => (
                <li key={n}>
                  <span className="notice-icon">!</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
