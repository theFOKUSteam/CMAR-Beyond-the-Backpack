export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="container footer-grid">
          <div>
            <h3>Central Mississippi Association of Realtists</h3>
            <p className="org-tagline">Proud host of Beyond the Backpack</p>
            <p style={{ marginTop: 14, fontSize: 14, color: "rgba(250,248,243,0.7)", maxWidth: 420 }}>
              CMAR is committed to strengthening homeownership and opportunity across Central
              Mississippi — and to showing up for our community, one fresh start at a time.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem" }}>Contact &amp; Info</h3>
            <ul className="contact-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>P.O. Box 384, Jackson, MS 39208</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M2 7l10 6 10-6"></path>
                </svg>
                <a href="mailto:cmarealtist@gmail.com">cmarealtist@gmail.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"></path>
                </svg>
                <a href="https://www.cmarealtist.com" target="_blank" rel="noopener noreferrer">
                  www.cmarealtist.com
                </a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.7 2z"></path>
                </svg>
                <span>More info: 601-301-4144</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="footer-bottom">
        © 2026 Central Mississippi Association of Realtists. All rights reserved. · Beyond the
        Backpack — Fresh Cuts. Fresh Confidence. Fresh Start.
      </p>
    </footer>
  );
}
