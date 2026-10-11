import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, MapPin, Code2 } from 'lucide-react';
import myImage from './assets/myimage.jfif';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Overlapping Draggable Cards State (Navin's photo card ON TOP, card2 shifted right for clear double-card visibility)
  const [cardsPos, setCardsPos] = useState({
    card1: { x: -60, y: -20, rot: -3 },
    card2: { x: 80, y: 50, rot: 4 }
  });
  const [cardZ, setCardZ] = useState({ card1: 5, card2: 2 });
  const [hoveredCard, setHoveredCard] = useState<'card1' | 'card2' | null>(null);

  const activeDragRef = useRef<{ id: 'card1' | 'card2'; startX: number; startY: number; itemX: number; itemY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, id: 'card1' | 'card2') => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setCardZ({
      card1: id === 'card1' ? 10 : 1,
      card2: id === 'card2' ? 10 : 1
    });

    activeDragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      itemX: cardsPos[id].x,
      itemY: cardsPos[id].y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDragRef.current) return;
    const { id, startX, startY, itemX, itemY } = activeDragRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setCardsPos(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: itemX + deltaX,
        y: itemY + deltaY
      }
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
      activeDragRef.current = null;
    }
  };

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
    <section className="about-section" ref={sectionRef} id="about-section">
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

        {/* Right Column: Overlapping Draggable Cards Stack */}
        <div className="about-right" ref={rightRef} onPointerMove={handlePointerMove}>
          <div className="cards-stack-wrapper">
            {/* Card 1: Main Profile Card */}
            <div
              className="drag-profile-card"
              style={{
                transform: `translate3d(${cardsPos.card1.x}px, ${cardsPos.card1.y}px, 0px) rotate(${hoveredCard === 'card1' ? 0 : cardsPos.card1.rot}deg) scale(${hoveredCard === 'card1' ? 1.04 : 1})`,
                zIndex: cardZ.card1
              }}
              onPointerDown={e => handlePointerDown(e, 'card1')}
              onPointerUp={handlePointerUp}
              onMouseEnter={() => setHoveredCard('card1')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="profile-card-header">
                <div className="profile-status-pill">
                  <span className="status-indicator" />
                  <span>Available for Projects</span>
                </div>
                <span className="profile-role-tag">UI / FRONTEND</span>
              </div>

              <div className="profile-image-frame">
                <img
                  src={myImage}
                  alt="Navin Boddhul"
                  className="profile-image"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/myimage.jfif';
                  }}
                />
              </div>

              <div className="profile-card-footer">
                <div className="profile-location">
                  <MapPin size={14} color="var(--accent-primary)" />
                  <span>India</span>
                </div>
                <span className="profile-company">Shaurya Technosoft</span>
              </div>
            </div>

            {/* Card 2: Secondary Overlapping Tech Card */}
            <div
              className="drag-profile-card"
              style={{
                transform: `translate3d(${cardsPos.card2.x}px, ${cardsPos.card2.y}px, 0px) rotate(${hoveredCard === 'card2' ? 0 : cardsPos.card2.rot}deg) scale(${hoveredCard === 'card2' ? 1.04 : 1})`,
                zIndex: cardZ.card2
              }}
              onPointerDown={e => handlePointerDown(e, 'card2')}
              onPointerUp={handlePointerUp}
              onMouseEnter={() => setHoveredCard('card2')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="profile-card-header">
                <div className="profile-status-pill">
                  <Code2 size={13} color="var(--accent-primary)" />
                  <span>UI / Code Craft</span>
                </div>
                <span className="profile-role-tag">REACT & GSAP</span>
              </div>

              <div className="profile-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80"
                  alt="Code & Design"
                  className="profile-image"
                  draggable={false}
                />
              </div>

              <div className="profile-card-footer">
                <div className="profile-location">
                  <span>⚡ 4+ Years Exp</span>
                </div>
                <span className="profile-company">Frontend Dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
