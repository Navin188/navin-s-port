import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, Server, Navigation, Users, CheckCircle2, ExternalLink } from 'lucide-react';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export interface FocusProject {
  id: string;
  indexNum: string;
  badge: string;
  title: string;
  domain?: string;
  description: string;
  tech: string[];
  accentColor: string;
  icon: React.ReactNode;
  url: string;
  metric1: { label: string; val: string };
  metric2: { label: string; val: string };
  highlightTag: string;
}

const resumeProjects: FocusProject[] = [
  {
    id: 'insurance-seva-desk',
    indexNum: '01 / 04',
    badge: 'INSURANCE MANAGEMENT SYSTEM',
    title: 'Insurance Seva Desk (ISD)',
    domain: 'Insurance',
    description:
      'Enterprise frontend claims portal streamlining policy lifecycle, claim verification, and citizen insurance support with AI-assisted dynamic forms and real-time REST API integration.',
    tech: ['React.js', 'TypeScript', 'Redux Toolkit', 'Material UI', 'React Query', 'REST APIs'],
    accentColor: '#10B981',
    icon: <ShieldCheck size={16} color="#10B981" />,
    url: 'https://insurance-seva-desk.app',
    metric1: { label: 'Claims Verified', val: '1.2M+' },
    metric2: { label: 'Avg Speed', val: '45 sec' },
    highlightTag: 'JWT Auth & AI Dynamic Forms',
  },
  {
    id: 'nexgate-erp',
    indexNum: '02 / 04',
    badge: 'ENTERPRISE RESOURCE PLANNING',
    title: 'NexGate (ERP)',
    domain: 'ERP Business Systems',
    description:
      'Comprehensive ERP platform with operational reporting dashboards, automated business process workflows, reusable React component libraries, and full CRUD REST APIs.',
    tech: ['React.js', 'TypeScript', 'Redux Toolkit', 'Material UI', 'REST APIs'],
    accentColor: '#3B82F6',
    icon: <Server size={16} color="#3B82F6" />,
    url: 'https://nexgate-erp.app',
    metric1: { label: 'Daily Users', val: '450K+' },
    metric2: { label: 'Efficiency Gain', val: '+340%' },
    highlightTag: 'Enterprise Operational Dashboards',
  },
  {
    id: 'fleet-express-gps',
    indexNum: '03 / 04',
    badge: 'FLEET MANAGEMENT & GPS',
    title: 'Fleet Express GPS',
    domain: 'Fleet Management',
    description:
      'Real-time vehicle tracking and fleet analytics system featuring live GPS monitoring dashboards, operational telemetry visualizers, and responsive cross-platform UI.',
    tech: ['React.js', 'TypeScript', 'Redux Toolkit', 'Material UI', 'REST APIs'],
    accentColor: '#F59E0B',
    icon: <Navigation size={16} color="#F59E0B" />,
    url: 'https://fleet-express-gps.app',
    metric1: { label: 'Vehicles Tracked', val: '120K+' },
    metric2: { label: 'GPS Latency', val: '< 200ms' },
    highlightTag: 'Live GPS Telemetry Integration',
  },
  {
    id: 'bsk-crm',
    indexNum: '04 / 04',
    badge: 'CUSTOMER RELATIONSHIP MGMT',
    title: 'BSK (CRM)',
    domain: 'CRM System',
    description:
      'Full-featured CRM web platform enabling customer account management, role-based access control, responsive dashboards, and seamless REST API backend integration.',
    tech: ['React.js', 'TypeScript', 'Redux Toolkit', 'Material UI', 'REST APIs'],
    accentColor: '#8B5CF6',
    icon: <Users size={16} color="#8B5CF6" />,
    url: 'https://bsk-crm.app',
    metric1: { label: 'Leads Processed', val: '850K+' },
    metric2: { label: 'RBAC Security', val: '100%' },
    highlightTag: 'Role-Based Access Control',
  },
];

export const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current && trackRef.current) {
        const validCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

        // Force Card 1 to start at x: 0
        gsap.set(trackRef.current, { x: 0 });

        const getScrollAmount = () => {
          if (!trackRef.current || validCards.length < 2) return 0;
          // Exact distance between Card 1 center and Card N center (offsetLeft is immune to CSS transforms)
          const firstCard = validCards[0];
          const lastCard = validCards[validCards.length - 1];
          return Math.max(0, lastCard.offsetLeft - firstCard.offsetLeft);
        };

        const updateFocusModifiers = () => {
          const screenCenter = window.innerWidth / 2;
          const maxDist = window.innerWidth * 0.45;

          validCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(screenCenter - cardCenter);
            const normDist = Math.min(dist / maxDist, 1);

            const scale = 1.04 - normDist * 0.12;
            const opacity = 1 - normDist * 0.35;
            const blur = normDist * 1.5;

            gsap.set(card, {
              scale: scale,
              opacity: opacity,
              filter: `blur(${blur}px)`,
            });

            if (normDist < 0.3) {
              card.classList.add('is-active');
            } else {
              card.classList.remove('is-active');
            }
          });
        };

        // Pin section and translate track horizontally from Card 1 centered to Card 4 centered
        gsap.to(trackRef.current, {
          x: () => -getScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: 'top top',
            end: () => '+=' + getScrollAmount(),
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${self.progress * 100}%`;
              }
              updateFocusModifiers();
            },
          },
        });

        updateFocusModifiers();
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cinematic-projects-section" ref={sectionRef} id="projects">
      <div className="cinematic-progress-bar" ref={progressBarRef} />

      {/* Standard Header Flow (NO OVERLAP!) */}
      <div className="cinematic-header-flow">
        <div className="cinematic-tag">
          <span>Projects</span>
        </div>
        <h2 className="cinematic-title">Projects</h2>
      </div>

      {/* Horizontal Track holding 4 resume project cards */}
      <div className="cinematic-track" ref={trackRef}>
        {resumeProjects.map((proj, index) => (
          <div
            key={proj.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="focus-card"
          >
            {/* Left Column: Details & Tech */}
            <div className="focus-card-left">
              <div>
                <div className="focus-card-top-row">
                  <div
                    className="focus-card-category"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-card)',
                      color: proj.accentColor,
                    }}
                  >
                    {proj.icon}
                    <span>{proj.badge}</span>
                  </div>
                  <span className="focus-card-index">{proj.indexNum}</span>
                </div>

                <h3 className="focus-card-title">{proj.title}</h3>
                <p className="focus-card-desc">{proj.description}</p>

                <div className="focus-tech-list">
                  {proj.tech.map((t) => (
                    <span key={t} className="focus-tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="focus-card-actions">
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.4rem',
                    borderRadius: '9999px',
                    background: proj.accentColor,
                    color: '#000000',
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  }}
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight size={15} />
                </button>

                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.1rem',
                    borderRadius: '9999px',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                  }}
                >
                  <span>Live Preview</span>
                  <ExternalLink size={14} color="var(--text-muted)" />
                </button>
              </div>
            </div>

            {/* Right Column: Handcrafted macOS Browser Window */}
            <div className="focus-card-right">
              <div className="focus-mockup-window">
                <div className="mockup-top-bar">
                  <div className="mockup-dots">
                    <div className="mockup-dot" style={{ background: '#FF5F56' }} />
                    <div className="mockup-dot" style={{ background: '#FFBD2E' }} />
                    <div className="mockup-dot" style={{ background: '#27C93F' }} />
                  </div>
                  <div className="mockup-url-bar">{proj.url}</div>
                </div>

                <div className="mockup-body">
                  <div className="mockup-metrics-grid">
                    <div className="mockup-metric-box">
                      <div className="mockup-metric-label">{proj.metric1.label}</div>
                      <div className="mockup-metric-val" style={{ color: proj.accentColor }}>
                        {proj.metric1.val}
                      </div>
                    </div>

                    <div className="mockup-metric-box">
                      <div className="mockup-metric-label">{proj.metric2.label}</div>
                      <div className="mockup-metric-val" style={{ color: 'var(--text-primary)' }}>
                        {proj.metric2.val}
                      </div>
                    </div>
                  </div>

                  <div className="mockup-highlight-bar">
                    <CheckCircle2 size={16} color={proj.accentColor} />
                    <span className="mockup-highlight-text">{proj.highlightTag}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
