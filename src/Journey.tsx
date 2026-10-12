import { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import './Journey.css';

interface JourneyMilestone {
  id: number;
  stepStr: string;
  title: string;
  subtitle: string;
  period: string;
  details: string;
  tags: string[];
  accentColor: string;
  icon: React.ReactNode;
}

const JOURNEY_ITEMS: JourneyMilestone[] = [
  {
    id: 1,
    stepStr: '01 / 04',
    title: 'Academy',
    subtitle: 'BIGCE',
    period: '2016 – 2020',
    details:
      'Completed Diploma and Engineering degree, laying the foundation for UI development.',
    tags: ['Diploma', 'Engineering Degree', 'Algorithmic Thinking', 'Core CS'],
    accentColor: '#F59E0B',
    icon: <GraduationCap size={18} />,
  },
  {
    id: 2,
    stepStr: '02 / 04',
    title: 'UI Designer',
    subtitle: 'Vertex',
    period: '2021 – 2022',
    details:
      'Started career focusing on wireframing and pixel-perfect UI design.',
    tags: ['Figma', 'Wireframing', 'Visual Hierarchy', 'Pixel Perfection'],
    accentColor: '#38BDF8',
    icon: <Sparkles size={18} />,
  },
  {
    id: 3,
    stepStr: '03 / 04',
    title: 'UI Designer',
    subtitle: 'Shaurya Technosoft',
    period: '2022 – 2024',
    details:
      'Designed over 10 complex websites and admin panels, prioritizing user experience.',
    tags: ['Web Applications', 'Admin Dashboards', 'Design Tokens', 'User Experience'],
    accentColor: '#F43F5E',
    icon: <Briefcase size={18} />,
  },
  {
    id: 4,
    stepStr: '04 / 04',
    title: 'Frontend Developer',
    subtitle: 'Shaurya Technosoft',
    period: '2024 – Present',
    details:
      'Transitioned to development (4+ years). Converting wireframes into dynamic React screens and binding REST APIs. Won 2nd place in Rentloop Hackathon.',
    tags: ['React', 'TypeScript', 'REST APIs', 'Rentloop Hackathon Winner', 'Dynamic UI'],
    accentColor: '#10B981',
    icon: <Briefcase size={18} />,
  },
];

export const Journey = () => {
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeMilestone =
    JOURNEY_ITEMS.find((item) => item.id === activeModalId) || null;

  const handlePrevMilestone = () => {
    if (!activeModalId) return;
    const currentIndex = JOURNEY_ITEMS.findIndex((item) => item.id === activeModalId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : JOURNEY_ITEMS.length - 1;
    setActiveModalId(JOURNEY_ITEMS[prevIndex].id);
  };

  const handleNextMilestone = () => {
    if (!activeModalId) return;
    const currentIndex = JOURNEY_ITEMS.findIndex((item) => item.id === activeModalId);
    const nextIndex = currentIndex < JOURNEY_ITEMS.length - 1 ? currentIndex + 1 : 0;
    setActiveModalId(JOURNEY_ITEMS[nextIndex].id);
  };

  const handleCopyDetails = () => {
    if (!activeMilestone) return;
    const copyText = `[${activeMilestone.stepStr}] ${activeMilestone.title} at ${activeMilestone.subtitle} (${activeMilestone.period})\n\n${activeMilestone.details}\n\nKey Focus: ${activeMilestone.tags.join(', ')}`;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="journey-section" id="journey-section">
      {/* Background ambient spotlight */}
      <div className="journey-bg-ambient" />

      {/* Section Header */}
      <div className="journey-header">
        <h2 className="journey-title">
          Career <span>Journey</span>
        </h2>
        <p className="journey-subtitle">
          Real milestones from education to full-stack engineering. Pick a card from the box.
        </p>
      </div>

      {/* 3D Isometric Open Storage Box Container (Matching jameschugh.com) */}
      <div className="box-stage-container">
        <div className="box-fit">
          <div className="box3">
            {/* Box Shadow */}
            <div className="box-shadow" />

            {/* Box Floor */}
            <div className="box-floor" />

            {/* Inner Back Wall */}
            <div className="f wall-i wall-back" />

            {/* Inner Left Wall */}
            <div className="f wall-i wall-left" />

            {/* Open Lid Hinged at the Back */}
            <div className="f box-lid">
              <div className="lid-stitch" />
              <div className="stamp2">ARCHIVES · 2016 – 2026</div>
            </div>

            {/* 4 Standing Cards inside the Box Cavity */}
            {JOURNEY_ITEMS.map((item, index) => {
              const xPos = 108 + index * 148;
              const leftPos = xPos - 112; // x - CW / 2 (CW = 224)
              const topPos = 130 - 304;   // BD / 2 - CH (BD = 260, CH = 304)
              const isHovered = hoveredCardId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModalId(item.id)}
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onFocus={() => setHoveredCardId(item.id)}
                  onBlur={() => setHoveredCardId(null)}
                  className={`f box-card-3d ${isHovered ? 'is-hovered' : ''}`}
                  style={{
                    left: `${leftPos}px`,
                    top: `${topPos}px`,
                    '--card-accent': item.accentColor,
                  } as React.CSSProperties}
                  aria-label={`${item.title} at ${item.subtitle}, open milestone details`}
                >
                  {/* Glowing Top Flap Accent Line */}
                  <div
                    className="card-3d-top-glow"
                    style={{ background: item.accentColor }}
                  />

                  {/* Card Top Row: Icon & Step Tag */}
                  <div className="card-3d-header">
                    <div
                      className="card-3d-icon"
                      style={{ color: item.accentColor }}
                    >
                      {item.icon}
                    </div>
                    <span className="card-3d-tag">{item.stepStr}</span>
                  </div>

                  {/* Card Body: Title & Subtitle */}
                  <div className="card-3d-body">
                    <h3 className="card-3d-title">{item.title}</h3>
                    <div className="card-3d-subtitle">@{item.subtitle}</div>
                  </div>

                  {/* Card Footer: Period & Click Hint */}
                  <div className="card-3d-footer">
                    <span className="card-3d-period">{item.period}</span>
                    <span
                      className="card-3d-cta"
                      style={{ color: item.accentColor }}
                    >
                      Open ↗
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Outer Right Wall */}
            <div className="f wall-o wall-right" />

            {/* Outer Front Wall with Embossed Text */}
            <div className="f wall-o wall-front">
              <span className="brand">Things I achieved</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── POPUP / MODAL DIALOG (When User Clicks a Card) ─── */}
      {activeMilestone && (
        <div
          className="journey-modal-backdrop"
          onClick={() => setActiveModalId(null)}
        >
          <div
            className="journey-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Top Bar */}
            <div className="modal-top-bar">
              <div className="modal-nav-arrows">
                <button
                  onClick={handlePrevMilestone}
                  className="modal-arrow-btn"
                  title="Previous milestone"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="modal-step-counter">
                  {activeMilestone.stepStr}
                </span>
                <button
                  onClick={handleNextMilestone}
                  className="modal-arrow-btn"
                  title="Next milestone"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div
                className="modal-chapter-chip"
                style={{
                  borderColor: activeMilestone.accentColor,
                  color: activeMilestone.accentColor,
                }}
              >
                <span>●</span> CHAPTER 0{activeMilestone.id}
              </div>

              <button
                onClick={() => setActiveModalId(null)}
                className="modal-close-btn"
                title="Close popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Heading */}
            <div className="modal-heading-group">
              <h3 className="modal-main-title">
                {activeMilestone.title}{' '}
                <span style={{ color: activeMilestone.accentColor }}>
                  @{activeMilestone.subtitle}
                </span>
              </h3>
              <p className="modal-subtitle-text">
                Verified Career Milestone · {activeMilestone.period}
              </p>
            </div>

            {/* Structured Info Rows */}
            <div className="modal-meta-table">
              <div className="meta-row">
                <span className="meta-label">Organization</span>
                <span className="meta-val highlight">
                  {activeMilestone.subtitle}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Timeline</span>
                <span className="meta-val">{activeMilestone.period}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Role Focus</span>
                <span className="meta-val">{activeMilestone.title}</span>
              </div>
            </div>

            {/* Milestone Story Details */}
            <div className="modal-details-box">
              <p className="modal-story-paragraph">
                {activeMilestone.details}
              </p>
            </div>

            {/* Competency Tags */}
            <div className="modal-tags-section">
              <span className="tags-header">Key Highlights & Competencies:</span>
              <div className="modal-tags-list">
                {activeMilestone.tags.map((tag) => (
                  <span key={tag} className="modal-tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer-bar">
              <button
                onClick={handleCopyDetails}
                className={`modal-copy-btn ${copied ? 'is-copied' : ''}`}
              >
                {copied ? (
                  <>
                    <Check size={16} /> Copied Details!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy Details
                  </>
                )}
              </button>

              <button
                onClick={handleNextMilestone}
                className="modal-next-btn"
                style={{ background: activeMilestone.accentColor }}
              >
                <span>Next Milestone</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Journey;
