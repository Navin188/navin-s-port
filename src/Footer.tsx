import { Mail, FileText, ArrowUpRight, Sparkles } from 'lucide-react';
import './Footer.css';

export interface FooterProps {
  email?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
}

export const Footer = ({
  email = 'hello@navin.dev',
  linkedinUrl = 'https://linkedin.com/in/navinpatil',
  resumeUrl = '/Resume_Navin_Patil.pdf',
}: FooterProps) => {
  return (
    <footer className="standard-footer" id="footer-section">
      <div className="footer-container">
        {/* Main Section */}
        <div className="footer-main">
          <div className="footer-title-box">
            <div className="footer-connect-tag">
              <Sparkles size={14} color="var(--accent-primary)" />
              <span>Get In Touch</span>
            </div>
            <h2 className="footer-large-title">
              Let's <span>Connect.</span>
            </h2>
          </div>

          {/* Clean Layout Links */}
          <div className="footer-links-grid">
            <a href={`mailto:${email}`} className="footer-link-btn footer-link-btn-highlight">
              <Mail size={16} />
              <span>{email}</span>
              <ArrowUpRight size={15} />
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LinkedIn</span>
              <ArrowUpRight size={15} />
            </a>

            <a
              href={resumeUrl}
              download="Resume_Navin_Patil.pdf"
              className="footer-link-btn"
            >
              <FileText size={16} color="var(--accent-blue)" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Navin Patil. All rights reserved.</span>
          <span>UI Designer &amp; Frontend Architect at Shaurya Technosoft</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
