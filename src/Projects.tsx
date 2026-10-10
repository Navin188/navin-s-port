import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, Server, Award, Activity, CheckCircle2 } from 'lucide-react';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export interface FocusProject {
  id: string;
  badge: string;
  title: string;
  description: string;
  tech: string[];
  accentColor: string;
  icon: React.ReactNode;
  metric1: { label: string; val: string };
  metric2: { label: string; val: string };
  highlightTag: string;
}

const cinematicProjects: FocusProject[] = [
  {
    id: 'insurance-seva-desk',
    badge: 'INSURTECH PLATFORM',
    title: 'Insurance Seva Desk',
    description:
      'Automated digital claims portal streamlining policy lifecycle, claim verification, and citizen insurance support with real-time API authentication.',
    tech: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'GSAP'],
    accentColor: 'var(--accent-primary)',
    icon: <ShieldCheck size={18} color="var(--accent-primary)" />,
    metric1: { label: 'Claims Verified', val: '1.2M+' },
    metric2: { label: 'Avg Speed', val: '45 sec' },
    highlightTag: '99.98% Verification Accuracy',
  },
  {
    id: 'nexgate-erp',
    badge: 'ENTERPRISE SAAS',
    title: 'NexGate ERP',
    description:
      'Next-gen enterprise resource planning system with real-time inventory tracking, automated financial workflows, and AI demand forecasting.',
    tech: ['React', 'Redux Toolkit', 'TypeScript', 'Material UI', 'Chart.js'],
    accentColor: 'var(--accent-blue)',
    icon: <Server size={18} color="var(--accent-blue)" />,
    metric1: { label: 'Daily Users', val: '450K+' },
    metric2: { label: 'Efficiency Gain', val: '+340%' },
    highlightTag: 'Enterprise Grade Security',
  },
  {
    id: 'rentloop',
    badge: '🏆 HACKATHON 2ND PLACE WINNER',
    title: 'Rentloop',
    description:
      'Full-stack digital property rental ecosystem connecting landlords and tenants with instant lease agreements, automated escrow, and rent tracking.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'GSAP'],
    accentColor: 'var(--accent-gold)',
    icon: <Award size={18} color="var(--accent-gold)" />,
    metric1: { label: 'Leases Signed', val: '85,000+' },
    metric2: { label: 'Hackathon Award', val: '2nd Place' },
    highlightTag: 'Instant Escrow Settlement',
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
        const totalScrollX = trackRef.current.scrollWidth - window.innerWidth;

        // Scale 1.05 max, opacity 0.6 min, blur 2px max
        const updateFocusModifiers = () => {
          const screenCenter = window.innerWidth / 2;
          const maxDist = window.innerWidth * 0.55;

          validCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(screenCenter - cardCenter);
            const normDist = Math.min(dist / maxDist, 1);

            const scale = 1.05 - normDist * 0.15;
            const opacity = 1 - normDist * 0.4;
            const blur = normDist * 2;

            gsap.set(card, {
              scale: scale,
              opacity: opacity,
              filter: `blur(${blur}px)`,
            });

            if (normDist < 0.25) {
              card.classList.add('is-active');
            } else {
              card.classList.remove('is-active');
            }
          });
        };

        // Pin section and translate track horizontally
        gsap.to(trackRef.current, {
          x: -totalScrollX,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: () => '+=' + totalScrollX,
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
          <Activity size={14} color="var(--accent-primary)" />
          <span>Projects</span>
        </div>
        <h2 className="cinematic-title">Projects</h2>
      </div>

      {/* Horizontal Track holding 3 project cards */}
      <div className="cinematic-track" ref={trackRef}>
        {cinematicProjects.map((proj, index) => (
          <div
            key={proj.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="focus-card"
          >
            {/* Left Column (50% Grid): Details & Tech */}
            <div className="focus-card-left">
              <div>
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

              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  background: proj.accentColor,
                  color: '#050505',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  width: 'fit-content',
                  marginTop: '1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}
              >
                <span>Explore Case Study</span>
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Right Column (50% Grid): Metrics & Mockup Window */}
            <div className="focus-card-right">
              <div className="focus-mockup-window">
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginTop: '0.85rem' }}>
                  <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'Inter' }}>{proj.metric1.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: proj.accentColor, fontFamily: 'Inter' }}>{proj.metric1.val}</div>
                  </div>
                  <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'Inter' }}>{proj.metric2.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Inter' }}>{proj.metric2.val}</div>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', background: 'var(--bg-input)', padding: '0.7rem 0.85rem', borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color={proj.accentColor} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'Inter' }}>{proj.highlightTag}</span>
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
