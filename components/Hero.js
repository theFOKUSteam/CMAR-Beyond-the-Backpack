export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-bg-shape" aria-hidden="true" />
      <div className="hero-inner">
        <div className="container">
          <div className="hero-topline">
            <img src="/images/logo.svg" alt="Central Mississippi Association of Realtists seal" width={64} height={64} />
            <span className="brand-text">CMAR Community Event · Jackson, MS</span>
          </div>

          <div className="hero-grid">
            <div>
              <h1>
                Beyond the <span className="script-word">Backpack</span>
              </h1>
              <p className="tagline">Fresh Cuts. Fresh Confidence. Fresh Start.</p>
              <p className="lede">
                A morning of free haircuts, hair styling, backpacks, and school supplies for
                Jackson-area families — hosted with pride by the Central Mississippi Association
                of Realtists as our community gets ready for a new school year.
              </p>

              <div className="hero-ctas">
                <a href="#register" className="btn btn-gold btn-lg">
                  Register Now →
                </a>
                <a href="#services" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
                  View Services
                </a>
              </div>

              <div className="hero-meta">
                <div className="hero-meta-item">
                  <span className="icon-dot">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                      <path d="M16 2v4M8 2v4M3 10h18"></path>
                    </svg>
                  </span>
                  <span>
                    <span className="meta-label" style={{ display: "block" }}>
                      Date
                    </span>
                    <span className="meta-value">Sat, Aug 1, 2026</span>
                  </span>
                </div>
                <div className="hero-meta-item">
                  <span className="icon-dot">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"></circle>
                      <path d="M12 7v5l3 3"></path>
                    </svg>
                  </span>
                  <span>
                    <span className="meta-label" style={{ display: "block" }}>
                      Time
                    </span>
                    <span className="meta-value">10 AM – 1 PM</span>
                  </span>
                </div>
                <div className="hero-meta-item">
                  <span className="icon-dot">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7-5.3-9.5-9.7C.7 7.6 2.6 4 6.2 4 8.4 4 10 5.3 12 7.5 14 5.3 15.6 4 17.8 4 21.4 4 23.3 7.6 21.5 11.3 19 15.7 12 21 12 21z"></path>
                    </svg>
                  </span>
                  <span>
                    <span className="meta-label" style={{ display: "block" }}>
                      Location
                    </span>
                    <span className="meta-value">1711 Raymond Rd, Suite B</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-collage">
                <div className="collage-card tall">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/gallery-1.svg" alt="Illustration representing free haircuts and styling at the event" />
                </div>
                <div className="collage-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/gallery-3.svg" alt="Illustration representing backpacks and school supplies" />
                </div>
                <div className="collage-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/gallery-4.svg" alt="Illustration representing community and celebration" />
                </div>
              </div>
              <div className="free-badge">
                ALL SERVICES
                <strong>ARE FREE!</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80L1440 20V80H0Z" fill="#faf8f3" />
      </svg>
    </header>
  );
}
