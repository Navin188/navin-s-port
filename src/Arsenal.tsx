import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Database, Layers, Layout, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';
import './Arsenal.css';

gsap.registerPlugin(ScrollTrigger);

export interface BentoCardData {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gridClass: string;
  badge: string;
}

export const Arsenal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP ScrollTrigger stagger entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      if (validCards.length > 0 && sectionRef.current) {
        gsap.from(validCards, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Smooth 3D tilt & spotlight glow on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (-(y - centerY) / centerY) * 6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section className="arsenal-section" ref={sectionRef}>
      <div className="arsenal-container">
        {/* Section Header */}
        <div className="arsenal-header">
          <div className="arsenal-tag">
            <Terminal size={14} color="#00FF66" />
            <span>Tech Stack & Tools</span>
          </div>
          <h2 className="arsenal-title">
            The <span>Arsenal</span> I Build With
          </h2>
          <p className="arsenal-subtitle">
            Engineered for extreme performance, clean architecture, and scalably converting visitors into customers.
          </p>
        </div>

        {/* 5-Card Bento Box Grid */}
        <div className="bento-grid">
          {/* Card 1: Frontend (React / TS - Span 2 cols, 2 rows) */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el;
            }}
            className="bento-card bento-card-hero"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bento-card-glow" />
            <div className="bento-card-header">
              <div className="bento-icon-wrapper">
                <Code2 size={24} />
              </div>
              <span className="bento-pill">01 / FRONTEND</span>
            </div>

            <div className="bento-card-body">
              <h3 className="bento-card-title">React & TypeScript</h3>
              <p className="bento-card-desc">
                Building strongly typed, bulletproof UI architectures with modular component design and lightning-fast rendering.
              </p>

              <div className="code-preview-box">
                <div><span style={{ color: '#ff79c6' }}>interface</span> <span style={{ color: '#50fa7b' }}>HeroProps</span> &#123;</div>
                <div>&nbsp;&nbsp;title: <span style={{ color: '#f1fa8c' }}>string</span>;</div>
                <div>&nbsp;&nbsp;onConvert: () =&gt; <span style={{ color: '#8be9fd' }}>Promise</span>&lt;<span style={{ color: '#50fa7b' }}>Success</span>&gt;;</div>
                <div>&#125;</div>
              </div>
            </div>
          </div>

          {/* Card 2: Data Binding (REST APIs - Span 2 cols, 1 row) */}
          <div
            ref={(el) => {
              cardsRef.current[1] = el;
            }}
            className="bento-card bento-card-data"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bento-card-glow" />
            <div className="bento-card-header">
              <div className="bento-icon-wrapper">
                <Database size={22} />
              </div>
              <span className="bento-pill">02 / DATA BINDING</span>
            </div>

            <div className="bento-card-body">
              <h3 className="bento-card-title">REST APIs & Async Flow</h3>
              <p className="bento-card-desc">
                Seamless real-time data integration, optimistic updates, and resilient state synchronization.
              </p>
              <div className="api-flow-wrapper">
                <span className="api-badge">GET /api/v1/metrics</span>
                <ArrowUpRight size={16} color="#00FF66" />
                <span className="api-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>200 OK</span>
              </div>
            </div>
          </div>

          {/* Card 3: State (Redux - Span 1 col, 1 row) */}
          <div
            ref={(el) => {
              cardsRef.current[2] = el;
            }}
            className="bento-card bento-card-state"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bento-card-glow" />
            <div className="bento-card-header">
              <div className="bento-icon-wrapper">
                <Layers size={22} />
              </div>
              <span className="bento-pill">03 / STATE</span>
            </div>

            <div className="bento-card-body">
              <h3 className="bento-card-title">Redux Toolkit</h3>
              <p className="bento-card-desc">
                Predictable, centralized global state management with immutability guarantees.
              </p>
            </div>
          </div>

          {/* Card 4: UI (Material UI - Span 1 col, 1 row) */}
          <div
            ref={(el) => {
              cardsRef.current[3] = el;
            }}
            className="bento-card bento-card-ui"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bento-card-glow" />
            <div className="bento-card-header">
              <div className="bento-icon-wrapper">
                <Layout size={22} />
              </div>
              <span className="bento-pill">04 / UI SYSTEM</span>
            </div>

            <div className="bento-card-body">
              <h3 className="bento-card-title">Material UI & Design Systems</h3>
              <p className="bento-card-desc">
                Custom themed design tokens, accessible components, and unified design language.
              </p>
            </div>
          </div>

          {/* Card 5: AI (Cursor - Span 4 cols, 1 row) */}
          <div
            ref={(el) => {
              cardsRef.current[4] = el;
            }}
            className="bento-card bento-card-ai"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bento-card-glow" />
            <div className="bento-card-header">
              <div className="bento-icon-wrapper" style={{ background: 'rgba(0, 255, 102, 0.15)', borderColor: '#00FF66' }}>
                <Sparkles size={22} color="#00FF66" />
              </div>
              <span className="bento-pill" style={{ color: '#00FF66', borderColor: 'rgba(0, 255, 102, 0.3)' }}>
                05 / AI WORKFLOW
              </span>
            </div>

            <div className="bento-card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 className="bento-card-title">Cursor & AI Integration</h3>
                <p className="bento-card-desc" style={{ maxWidth: '600px' }}>
                  Accelerating software delivery 10x with intelligent context-aware code generation, automated refactoring, and AI agent workflows.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.6)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 255, 102, 0.3)',
                }}
              >
                <Sparkles size={16} color="#00FF66" />
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#00FF66' }}>
                  ai.generate(&#123; speed: "10x", quality: "100%" &#125;)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arsenal;
