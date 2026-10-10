import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, MapPin } from 'lucide-react';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftRef.current && sectionRef.current) {
        gsap.from(leftRef.current, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (rightRef.current && sectionRef.current) {
        gsap.from(rightRef.current, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-section" ref={sectionRef} id="about">
      {/* Background Spotlight */}
      <div className="about-bg-spotlight" />

      {/* Symmetrical 2-Column Split Grid */}
      <div className="about-split-container">
        {/* Left Column: Simple Title & Bio */}
        <div className="about-left" ref={leftRef}>
          <div className="about-tag">
            <Sparkles size={14} color="var(--accent-primary)" />
            <span>Introduction</span>
          </div>

          <h2 className="about-title">
            Welcome to <span>Navin's World</span>
          </h2>

          {/* Glass Bio Panel */}
          <div className="about-bio-panel">
            <p className="about-subtext">
              <strong>UI Designer turned Frontend Developer.</strong> 4+ years experience transforming complex wireframes into dynamic, high-performance, and API-driven reality at{' '}
              <span className="company-link">Shaurya Technosoft</span>.
            </p>
          </div>

          {/* Stats Row */}
          <div className="about-stats-row">
            <div className="stat-card">
              <span className="stat-value">4+ Yrs</span>
              <span className="stat-title">Industry Exp</span>
            </div>

            <div className="stat-card">
              <span className="stat-value">50+</span>
              <span className="stat-title">UI Modules</span>
            </div>

            <div className="stat-card">
              <span className="stat-value">100%</span>
              <span className="stat-title">API-Driven</span>
            </div>
          </div>
        </div>

        {/* Right Column: Integrated Profile Card */}
        <div className="about-right" ref={rightRef}>
          <div className="profile-card-container">
            {/* Card Header Bar */}
            <div className="profile-card-header">
              <div className="profile-status-pill">
                <span className="status-indicator" />
                <span>Available for Projects</span>
              </div>
              <span className="profile-role-tag">UI / FRONTEND</span>
            </div>

            {/* Profile Image Frame */}
            <div className="profile-image-frame">
              <img
                src="/myimage.jfif"
                alt="Navin Patil"
                className="profile-image"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="440" height="350" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e2e8f0"/><text x="50" y="55" font-size="20" fill="%230f172a" text-anchor="middle">NAVIN PATIL</text></svg>';
                }}
              />
            </div>

            {/* Card Footer Bar */}
            <div className="profile-card-footer">
              <div className="profile-location">
                <MapPin size={14} color="var(--accent-primary)" />
                <span>India</span>
              </div>
              <span className="profile-company">Shaurya Technosoft</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
