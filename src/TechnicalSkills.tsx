import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import {
  IcoHTML5, IcoCSS3, IcoBootstrap, IcoJavaScript, IcoReact,
  IcoMaterialUI, IcoRedux, IcoGit, IcoGitea, IcoAngular,
  IcoGitHub, IcoCursor, IcoFigma, IcoJira, IcoSQL,
} from './SkillIcons';
import laptopImg from './assets/laptop-wire-desktop.png';
import './TechnicalSkills.css';

gsap.registerPlugin(Draggable);

const SKILLS = [
  // Row 1 (5 items)
  { id: 'html',       label: 'HTML 5',        Icon: IcoHTML5,      color: '#E34F26' },
  { id: 'css',        label: 'CSS 3',         Icon: IcoCSS3,       color: '#1572B6' },
  { id: 'bootstrap',  label: 'Bootstrap',     Icon: IcoBootstrap,  color: '#7952B3' },
  { id: 'javascript', label: 'JavaScript',    Icon: IcoJavaScript, color: '#F7DF1E' },
  { id: 'react',      label: 'React',         Icon: IcoReact,      color: '#61DAFB' },
  // Row 2 (5 items)
  { id: 'materialui', label: 'Material UI',   Icon: IcoMaterialUI, color: '#007FFF' },
  { id: 'redux',      label: 'Redux Toolkit', Icon: IcoRedux,      color: '#764ABC' },
  { id: 'git',        label: 'Git',           Icon: IcoGit,        color: '#F05032' },
  { id: 'gitea',      label: 'Gitea',         Icon: IcoGitea,      color: '#609926' },
  { id: 'angular',    label: 'Angular',       Icon: IcoAngular,    color: '#DD0031' },
  // Row 3 (5 items)
  { id: 'github',     label: 'GitHub',        Icon: IcoGitHub,     color: '#e2e8f0' },
  { id: 'cursor',     label: 'Cursor',        Icon: IcoCursor,     color: '#00D4FF' },
  { id: 'figma',      label: 'Figma',         Icon: IcoFigma,      color: '#F24E1E' },
  { id: 'jira',       label: 'Jira',          Icon: IcoJira,       color: '#0052CC' },
  { id: 'sql',        label: 'SQL',           Icon: IcoSQL,        color: '#4479A1' },
];

export const TechnicalSkills = () => {
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [booting,     setBooting]     = useState(false);

  const screenRef     = useRef<HTMLDivElement>(null);
  const badgeRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const draggablesRef = useRef<Draggable[]>([]);
  const matrixRef     = useRef<HTMLCanvasElement>(null);
  const matrixRafRef  = useRef<number>(0);

  /* ── Matrix rain ─────────────────────────────────────────── */
  const startMatrix = useCallback(() => {
    const canvas = matrixRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cols  = Math.floor(canvas.width / 16);
    const drops = Array.from({ length: cols }, () => Math.random() * -canvas.height);
    const chars = '01アイウエカキクサシスタチ<>{}[]|=+-*/';

    const tick = () => {
      ctx.fillStyle = 'rgba(2,12,27,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px JetBrains Mono, monospace';
      drops.forEach((y, i) => {
        const ch    = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.93 ? 1 : 0.1 + Math.random() * 0.2;
        ctx.fillStyle = `rgba(0,255,102,${alpha})`;
        ctx.fillText(ch, i * 16, y);
        drops[i] += 16;
        if (drops[i] > canvas.height && Math.random() > 0.975) drops[i] = 0;
      });
      matrixRafRef.current = requestAnimationFrame(tick);
    };
    matrixRafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopMatrix = useCallback(() => {
    cancelAnimationFrame(matrixRafRef.current);
    const canvas = matrixRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  /* ── Boot ON / OFF ───────────────────────────────────────── */
  useEffect(() => {
    if (isPoweredOn) {
      setBooting(true);
      startMatrix();

      const validBadges = badgeRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.fromTo(
        validBadges,
        { opacity: 0, scale: 0.35, y: 20, rotate: () => (Math.random() - 0.5) * 24 },
        {
          opacity: 1, scale: 1, y: 0, rotate: 0,
          duration: 0.48, stagger: 0.06, ease: 'back.out(2)', delay: 0.15,
          onComplete: () => {
            setBooting(false);
            if (screenRef.current) {
              draggablesRef.current = Draggable.create(validBadges, {
                type:           'x,y',
                bounds:         screenRef.current,
                edgeResistance: 0.82,
                inertia:        false,
                onPress()  { gsap.to(this.target, { scale: 1.14, zIndex: 50, duration: 0.12 }); },
                onRelease(){ gsap.to(this.target, { scale: 1, zIndex: 5, duration: 0.18, ease: 'back.out(2)' }); },
              });
            }
          },
        }
      );

      // Floating micro-animation per tile
      validBadges.forEach((b, i) => {
        gsap.to(b, {
          y: `+=${3 + Math.random() * 4}`,
          duration: 1.8 + Math.random() * 1.4,
          repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.09,
        });
      });

    } else {
      stopMatrix();
      draggablesRef.current.forEach(d => d.kill());
      draggablesRef.current = [];

      const validBadges = badgeRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.killTweensOf(validBadges);
      gsap.set(validBadges, { opacity: 0, scale: 0.35, x: 0, y: 0, clearProps: 'zIndex' });
      setBooting(false);
    }
  }, [isPoweredOn, startMatrix, stopMatrix]);

  const handleBoot = () => {
    if (booting) return;
    setIsPoweredOn(prev => !prev);
  };

  return (
    <section className="ts-section" id="technical-skills">

      {/* ── Section header ──────────────────────────────────── */}
      <div className="ts-header">
        <span className="ts-eyebrow">SKILLS</span>
        <h2 className="ts-title">
          Powering the&nbsp;<span className="ts-title-accent">Frontend</span>
        </h2>
      </div>

      {/* ── Animated hint — visible until user boots ─────────── */}
      <p className={`ts-hint ${isPoweredOn ? 'ts-hint--hidden' : ''}`}>
        <span className="ts-hint-icon">⬇</span>
        Click the power button on the trackpad to boot my stack
      </p>

      {/* ── Laptop + overlays ────────────────────────────────── */}
      <div className="ts-laptop-wrap">
        <img
          src={laptopImg}
          alt="Laptop graphic"
          className="ts-laptop-img"
          draggable={false}
        />

        {/* Screen overlay — sits inside the MacBook bezel */}
        <div
          ref={screenRef}
          className={`ts-screen ${isPoweredOn ? 'ts-screen--on' : 'ts-screen--off'}`}
        >
          <canvas ref={matrixRef} className="ts-matrix-canvas" />

          {!isPoweredOn && (
            <div className="ts-off-overlay">
              <span className="ts-off-blink" />
              <span className="ts-off-text">SYSTEM POWER: OFF</span>
            </div>
          )}

          {booting && <div className="ts-boot-flash" />}

          <div className="ts-icons-grid">
            {SKILLS.map((skill, i) => (
              <div
                key={skill.id}
                ref={el => { badgeRefs.current[i] = el; }}
                className="ts-icon-tile"
                style={{ '--tile-color': skill.color } as React.CSSProperties}
              >
                <skill.Icon size={18} color={skill.color} className="ts-icon-svg" />
                <span className="ts-icon-label">{skill.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Touchpad power button — icon only, on the trackpad ── */}
        <button
          type="button"
          id="ts-boot-toggle"
          className={`ts-touchpad-btn ${isPoweredOn ? 'ts-touchpad-btn--on' : ''}`}
          onClick={handleBoot}
          disabled={booting}
          aria-label={isPoweredOn ? 'Shutdown system' : 'Boot system'}
          title={isPoweredOn ? 'Click to shutdown' : 'Click to boot'}
        >
          <svg
            width="22" height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default TechnicalSkills;
