export default function EventInfo() {
  return (
    <div className="info-strip">
      <div className="container">
        <div className="info-cards">
          <div className="info-card">
            <span className="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                <path d="M16 2v4M8 2v4M3 10h18"></path>
              </svg>
            </span>
            <div>
              <div className="info-label">Date</div>
              <div className="info-value">Saturday, August 1, 2026</div>
            </div>
          </div>

          <div className="info-card">
            <span className="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
              </svg>
            </span>
            <div>
              <div className="info-label">Time</div>
              <div className="info-value">10:00 AM – 1:00 PM</div>
            </div>
          </div>

          <div className="info-card">
            <span className="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-5.3-9.5-9.7C.7 7.6 2.6 4 6.2 4 8.4 4 10 5.3 12 7.5 14 5.3 15.6 4 17.8 4 21.4 4 23.3 7.6 21.5 11.3 19 15.7 12 21 12 21z"></path>
              </svg>
            </span>
            <div>
              <div className="info-label">Location</div>
              <div className="info-value">1711 Raymond Rd, Suite B</div>
              <div className="info-sub">Jackson, MS 39204</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
