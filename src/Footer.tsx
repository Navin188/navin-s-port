import { ArrowUp, Mail, Globe } from 'lucide-react';
import './Footer.css';

export interface FooterProps {
  /** Custom email link */
  email?: string;
}

export const Footer = ({ email = 'hello@navin.dev' }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-reveal-container">
      <div className="footer-bg-glow" />

      {/* Top Row: Circular Avatar with Grayscale Filter + Status */}
      <div className="footer-top-row">
        <div className="footer-avatar-wrapper">
          <img
            src="/myimage.jfif"
            alt="Navin Avatar"
            className="footer-avatar-img"
            onError={(e) => {
              // Fallback SVG if image is missing
              (e.currentTarget as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23111"/><text x="50" y="55" font-size="30" fill="%2300FF66" text-anchor="middle">NP</text></svg>';
            }}
          />
          <div className="footer-avatar-info">
            <span className="footer-avatar-name">Navin Patil</span>
            <div className="footer-avatar-status">
              <span className="status-dot" />
              <span>Available for new projects</span>
            </div>
          </div>
        </div>

        {/* Contact Email Pill Button */}
        <a href={`mailto:${email}`} className="footer-email-btn">
          <Mail size={16} />
          <span>{email}</span>
        </a>
      </div>

      {/* Center: Massive Heading */}
      <div className="footer-heading-wrapper">
        <h2 className="footer-heading">
          LET'S BUILD <span>SOMETHING</span>
        </h2>
      </div>

      {/* Middle / Socials & Links Row */}
      <div className="footer-middle-row">
        <div className="footer-socials">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Twitter Profile"
          >
            <Globe size={20} />
          </a>
        </div>

        <button type="button" className="back-to-top-btn" onClick={scrollToTop}>
          <span>BACK TO TOP</span>
          <ArrowUp size={16} />
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} Navin Patil. All rights reserved.</span>
        <span>Designed & Engineered with React, GSAP & Lenis</span>
      </div>
    </footer>
  );
};

export default Footer;
