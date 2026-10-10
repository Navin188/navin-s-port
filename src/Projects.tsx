import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight, ShieldCheck, Server, Home, Activity, CheckCircle2, TrendingUp } from 'lucide-react';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export interface ProjectData {
  id: string;
  index: string;
  category: string;
  title: string;
  description: string;
  tech: string[];
  accentColor: string;
  icon: React.ReactNode;
  stat1: { label: string; value: string };
  stat2: { label: string; value: string };
  badgeText: string;
}

const projects: ProjectData[] = [
  {
    id: 'insurance-seva-desk',
    index: '01',
    category: 'INSURTECH & GOVT PLATFORM',
    title: 'Insurance Seva Desk',
    description:
      'Automated digital claims portal streamlining policy lifecycle, claim verification, and citizen insurance support with real-time API authentication.',
    tech: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'GSAP'],
    accentColor: '#00FF66',
    icon: <ShieldCheck size={20} color="#00FF66" />,
    stat1: { label: 'Claims Processed', value: '1.2M+' },
    stat2: { label: 'Verification Time', value: '45 sec' },
    badgeText: '99.98% Verification Accuracy',
  },
  {
    id: 'nexgate-erp',
    index: '02',
    category: 'ENTERPRISE SAAS & LOGISTICS',
    title: 'NexGate ERP',
    description:
      'Next-gen enterprise resource planning system with real-time inventory tracking, automated financial workflows, and AI demand forecasting.',
    tech: ['React', 'Redux Toolkit', 'TypeScript', 'Material UI', 'Chart.js'],
    accentColor: '#00E5FF',
    icon: <Server size={20} color="#00E5FF" />,
    stat1: { label: 'Daily Active Users', value: '450K+' },
    stat2: { label: 'Workflow Efficiency', value: '+340%' },
    badgeText: 'Enterprise Grade Security',
  },
  {
    id: 'rentloop',
    index: '03',
    category: 'PROPTECH & RENTAL MARKETPLACE',
    title: 'Rentloop',
    description:
      'Full-stack digital property rental ecosystem connecting landlords and tenants with instant lease agreements, automated escrow, and rent tracking.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'GSAP'],
    accentColor: '#FF9900',
    icon: <Home size={20} color="#FF9900" />,
    stat1: { label: 'Leases Signed', value: '85,000+' },
    stat2: { label: 'Monthly GMV', value: '$14.2M' },
    badgeText: 'Instant Escrow Settlement',
  },
];

export const Projects = () => {
  const pinnedOuterRef = useRef<HTMLDivElement>(null);
  const innerTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scroll and integrate with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // GSAP Horizontal Pin ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (pinnedOuterRef.current && innerTrackRef.current) {
        const cards = gsap.utils.toArray('.project-card');
        const totalScrollX = innerTrackRef.current.scrollWidth - window.innerWidth;

        gsap.to(innerTrackRef.current, {
          x: -totalScrollX,
          ease: 'none',
          scrollTrigger: {
            trigger: pinnedOuterRef.current,
            pin: true,
            scrub: 1, // Tied directly to vertical scroll wheel
            snap: 1 / (cards.length - 1),
            end: () => '+=' + totalScrollX,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${self.progress * 100}%`;
              }
            },
          },
        });
      }
    }, pinnedOuterRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="projects-outer-pinned" ref={pinnedOuterRef}>
      {/* Scroll Progress Bar */}
      <div className="projects-progress-bar" ref={progressBarRef} />

      {/* Horizontal Scroll Inner Track (300vw) */}
      <div className="projects-inner-track" ref={innerTrackRef}>
        {projects.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-card-wrapper">
              <span className="project-index-num">{proj.index}</span>

              {/* Left Column Content */}
              <div className="project-content">
                <div>
                  <div
                    className="project-tag"
                    style={{
                      background: `${proj.accentColor}15`,
                      border: `1px solid ${proj.accentColor}40`,
                      color: proj.accentColor,
                    }}
                  >
                    {proj.icon}
                    <span>{proj.category}</span>
                  </div>

                  <h2 className="project-title">{proj.title}</h2>
                  <p className="project-desc">{proj.description}</p>

                  <div className="project-tech-pills">
                    {proj.tech.map((t) => (
                      <span key={t} className="tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="project-btn"
                  style={{
                    background: proj.accentColor,
                    color: '#050505',
                    boxShadow: `0 10px 25px ${proj.accentColor}40`,
                  }}
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>

              {/* Right Column Visual Dashboard Mockup */}
              <div className="project-visual">
                <div className="project-mockup-card">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <div className="mockup-dot" style={{ background: '#FF5F56' }} />
                      <div className="mockup-dot" style={{ background: '#FFBD2E' }} />
                      <div className="mockup-dot" style={{ background: '#27C93F' }} />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        color: proj.accentColor,
                        fontFamily: 'Inter',
                        fontWeight: 600,
                      }}
                    >
                      <Activity size={14} /> Live Dashboard
                    </div>
                  </div>

                  <div className="mockup-stats-grid">
                    <div className="stat-box">
                      <div className="stat-lbl">{proj.stat1.label}</div>
                      <div className="stat-val" style={{ color: proj.accentColor }}>
                        {proj.stat1.value}
                      </div>
                    </div>

                    <div className="stat-box">
                      <div className="stat-lbl">{proj.stat2.label}</div>
                      <div className="stat-val" style={{ color: '#ffffff' }}>
                        {proj.stat2.value}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '1.2rem',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <CheckCircle2 size={16} color={proj.accentColor} />
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter' }}>
                      {proj.badgeText}
                    </span>
                    <TrendingUp size={16} color={proj.accentColor} style={{ marginLeft: 'auto' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
