import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, FileText, ArrowUpRight } from 'lucide-react';
import resumeFile from './assets/NavinBoddhul.pdf';
import { trackResumeDownload } from './services/analytics';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export interface FooterProps {
  email?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
}

export const Footer = ({
  email = 'boddhulnavin@gmail.com',
  linkedinUrl = 'https://www.linkedin.com/in/navin-boddhul/',
  resumeUrl = resumeFile,
}: FooterProps) => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      const container = footerRef.current.querySelector('.footer-container');
      if (container) {
        gsap.fromTo(
          container,
          { y: 45, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
          }
        );
      }
    }
  }, []);

  return (
    <footer className="standard-footer" id="footer-section" ref={footerRef}>
      <div className="footer-container">
        {/* Main Section */}
        <div className="footer-main">
          <div className="footer-title-box">
            <h2 className="footer-large-title">
              Let's <span>Connect</span>
            </h2>
            <p className="footer-subtitle">
              Open for frontend development roles, design collaborations, and creative discussions.
            </p>
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
              download="Navin_Boddhul_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackResumeDownload}
              className="footer-link-btn"
            >
              <FileText size={16} color="var(--accent-blue)" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Navin Boddhul. All rights reserved.</span>
          <span>UI Designer &amp; Frontend Architect at Shaurya Technosoft</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
