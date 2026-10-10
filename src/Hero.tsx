import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import './Hero.css';

export interface HeroProps {
  titleText?: string;
  onAudioToggle?: (isPlaying: boolean) => void;
}

export const Hero = ({
  titleText = 'I BUILD WHAT SELLS',
  onAudioToggle,
}: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Default theme light setting on HTML
    document.documentElement.setAttribute('data-theme', 'light');

    // 1. Text entrance animation on mount
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    // 2. Custom Cursor quickTo setup
    let xFollowerTo: ((val: number) => void) | null = null;
    let yFollowerTo: ((val: number) => void) | null = null;
    let xDotTo: ((val: number) => void) | null = null;
    let yDotTo: ((val: number) => void) | null = null;

    if (followerRef.current && dotRef.current) {
      xFollowerTo = gsap.quickTo(followerRef.current, 'x', { duration: 0.5, ease: 'power3.out' });
      yFollowerTo = gsap.quickTo(followerRef.current, 'y', { duration: 0.5, ease: 'power3.out' });
      xDotTo = gsap.quickTo(dotRef.current, 'x', { duration: 0.1, ease: 'power3.out' });
      yDotTo = gsap.quickTo(dotRef.current, 'y', { duration: 0.1, ease: 'power3.out' });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (xFollowerTo && yFollowerTo && xDotTo && yDotTo) {
        xFollowerTo(e.clientX);
        yFollowerTo(e.clientY);
        xDotTo(e.clientX);
        yDotTo(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleAudio = () => {
    const nextState = !isAudioPlaying;
    setIsAudioPlaying(nextState);
    if (onAudioToggle) {
      onAudioToggle(nextState);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <section className="hero-section" ref={containerRef}>
      <div className="hero-bg-ambient" />
      <div className="hero-bg-grid" />

      {/* GSAP QuickTo Cursor */}
      <div
        ref={followerRef}
        className={`custom-cursor-follower ${isHovered ? 'is-hovering' : ''}`}
      />
      <div ref={dotRef} className="custom-cursor-dot" />

      {/* Top Right Controls Group: Theme Toggle + Audio Toggle */}
      <div className="hero-controls-group">
        <button
          type="button"
          className="ctrl-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {theme === 'light' ? <Sun size={15} color="#D97706" /> : <Moon size={15} color="#38BDF8" />}
          <span>{theme.toUpperCase()}</span>
        </button>

        <button
          type="button"
          className={`ctrl-btn ${isAudioPlaying ? 'is-active' : ''}`}
          onClick={toggleAudio}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={isAudioPlaying ? 'Mute audio' : 'Play audio'}
        >
          {isAudioPlaying ? <Volume2 size={15} color="var(--accent-primary)" /> : <VolumeX size={15} opacity={0.6} />}
          <span>{isAudioPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
          <div className="eq-bars">
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
          </div>
        </button>
      </div>

      {/* Absolute Centered Title (40% Smaller Font Size, Inter Font) */}
      <h1
        ref={titleRef}
        className="hero-title"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {titleText}
      </h1>
    </section>
  );
};

export default Hero;
