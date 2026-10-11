import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Palette, Code2, Award } from 'lucide-react';
import './Journey.css';

gsap.registerPlugin(ScrollTrigger);

export interface MapStopItem {
  id: string;
  stepCount: string;
  year: string;
  pinLabel: string;
  companyName: string;
  heading: string;
  description: string;
  xPercent: number;
  yPercent: number;
  icon: React.ReactNode;
  tags: string[];
}

const mapStops: MapStopItem[] = [
  {
    id: 'stop-1',
    stepCount: '01 / 04',
    year: '2022 – 2025',
    pinLabel: 'Academic',
    companyName: 'Electronics & Telecommunication',
    heading: 'B.Tech in Electronics & Telecommunication',
    description:
      'Graduated with a degree in Electronics and Telecommunication Engineering. Built a strong foundation in Electronics and Telecommunication at Bharatratna Indira Gandhi College of Engineering.',
    xPercent: 18,
    yPercent: 70,
    icon: <GraduationCap size={18} />,
    tags: ['Electronics & Telecommunication'],
  },
  {
    id: 'stop-2',
    stepCount: '02 / 04',
    year: '2021 – 2022',
    pinLabel: 'UI Design',
    companyName: 'Figma & Web Design at Vertex Technosys',
    heading: 'The Beginning: UI Designer (Wireframes & Pixel Perfection)',
    description:
      'Crafted high-fidelity Figma wireframes, design tokens, and interactive component libraries. Focused heavily on visual hierarchy, typographic precision, and user conversion psychology.',
    xPercent: 38,
    yPercent: 28,
    icon: <Palette size={18} />,
    tags: ['Figma', 'Wireframing', 'Web Design', 'Pixel Perfection'],
  },
  {
    id: 'stop-3',
    stepCount: '03 / 04',
    year: '2022 – 2024',
    pinLabel: 'Shaurya Technosoft Pvt Ltd as a UI Designer',
    companyName: 'Shaurya Technosoft',
    heading: 'UI Designer at Shaurya Technosoft (2 Years)',
    description:
      'My responsibilities during this period included creating wireframes and converting them into pixel-perfect designs for various screen sizes. I designed over 20 web applications and websites during this time.',
    xPercent: 62,
    yPercent: 72,
    icon: <Code2 size={18} />,
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS', 'Angular'],
  },
  {
    id: 'stop-4',
    stepCount: '04 / 04',
    year: '2026 - present',
    pinLabel: 'Frontend Developer',
    companyName: 'Shaurya Technosoft',
    heading: 'Frontend Developer at Shaurya Technosoft',
    description:
      'Throughout this journey, I have learned a lot and transformed my workflow. Previously, I focused on converting wireframes into web pages and screens. Now, bringing those designs to life by making them dynamic and interactive has sparked even greater interest in my work. I genuinely enjoy my work and responsibilities.',
    xPercent: 84,
    yPercent: 26,
    icon: <Award size={18} />,
    tags: ['React', 'Redux Toolkit', 'UI Design', 'Figma'],
  },
];

export const Journey = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 50%',
          end: 'bottom 70%',
          scrub: true,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * mapStops.length),
              mapStops.length - 1
            );
            setActiveIndex(idx);
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeStop = mapStops[activeIndex];

  return (
    <section className="journey-section" ref={sectionRef} id="journey-section">
      {/* Header */}
      <div className="journey-header">
        <h2 className="journey-title">
          Career <span>Journey</span>
        </h2>
        <p className="journey-subtitle">
          Four major milestones from 2021 to now.
        </p>
      </div>

      {/* Side-by-Side Grid (Details Card Left, Map Canvas Right) */}
      <div className="journey-side-grid">
        {/* Left Column: Active Milestone Details Card */}
        <div className="journey-details-card">
          <div>
            <div className="card-header-bar">
              <div className="card-company-badge">
                <div className="card-icon-box">{activeStop.icon}</div>
                <div>
                  <div className="card-company-name">{activeStop.companyName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Inter' }}>
                    {activeStop.year}
                  </div>
                </div>
              </div>

              <span className="card-step-count">{activeStop.stepCount}</span>
            </div>

            <h3 className="card-heading-title" style={{ marginTop: '1rem' }}>
              {activeStop.heading}
            </h3>
            <p className="card-body-text" style={{ marginTop: '0.65rem' }}>
              {activeStop.description}
            </p>
          </div>

          <div className="card-tags-container">
            {activeStop.tags.map((t) => (
              <span key={t} className="card-tag-item">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Google Map Canvas & Stepper Bar */}
        <div className="journey-right-column">
          <div className="map-canvas-wrapper">
            <div className="map-vector-bg" />
            <div className="map-river-shape" />

            {/* SVG S-Curve Travel Route Path */}
            <svg className="map-route-svg" viewBox="0 0 760 380" preserveAspectRatio="none">
              <path
                d="M 136,266 C 215,106 288,106 288,106 C 288,106 370,273 471,273 C 570,273 570,98 638,98"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="4"
              />
            </svg>

            {/* Glowing Route Travel Cursor */}
            <div
              className="route-travel-cursor"
              style={{
                left: `${activeStop.xPercent}%`,
                top: `${activeStop.yPercent}%`,
              }}
            />

            {/* 4 Map Pin Markers */}
            {mapStops.map((stop, index) => {
              const alignClass =
                stop.xPercent > 70
                  ? 'pin-align-right'
                  : stop.xPercent < 25
                    ? 'pin-align-left'
                    : 'pin-align-center';

              return (
                <div
                  key={stop.id}
                  className={`map-pin-marker ${alignClass} ${index === activeIndex ? 'is-active' : ''}`}
                  style={{
                    left: `${stop.xPercent}%`,
                    top: `${stop.yPercent}%`,
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="pin-bubble">{stop.icon}</div>
                  <div className="pin-label-pill">{stop.pinLabel}</div>
                </div>
              );
            })}
          </div>

          {/* Stepper Bar Underneath Map */}
          <div className="map-stepper-bar">
            <div className="stepper-dots-row">
              {mapStops.map((stop, index) => (
                <div
                  key={`dot-${stop.id}`}
                  className={`stepper-dot-item ${index === activeIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <div className="stepper-range-text">2022 → now</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
