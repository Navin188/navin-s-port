import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import './Hero.css';

export interface HeroProps {
  /** Optional custom title text */
  titleText?: string;
  /** Optional audio toggle callback */
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
  const [isHovered, setIsHovered] = useState(false);

  // GSAP animations and quickTo mouse trailing
  useEffect(() => {
    // 1. Text entrance animation on mount: slide up from y: 50, fade in from opacity: 0, duration 1.5s, power3.out
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 1.5,
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
      // Smooth trailing outer ring
      xFollowerTo = gsap.quickTo(followerRef.current, 'x', {
        duration: 0.5,
        ease: 'power3.out',
      });
      yFollowerTo = gsap.quickTo(followerRef.current, 'y', {
        duration: 0.5,
        ease: 'power3.out',
      });

      // Precise inner dot
      xDotTo = gsap.quickTo(dotRef.current, 'x', {
        duration: 0.1,
        ease: 'power3.out',
      });
      yDotTo = gsap.quickTo(dotRef.current, 'y', {
        duration: 0.1,
        ease: 'power3.out',
      });
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

  return (
    <div className="hero-container" ref={containerRef}>
      {/* Background aesthetics */}
      <div className="hero-bg-ambient" />
      <div className="hero-bg-grid" />

      {/* Custom GSAP QuickTo Cursor */}
      <div
        ref={followerRef}
        className={`custom-cursor-follower ${isHovered ? 'is-hovering' : ''}`}
      />
      <div ref={dotRef} className="custom-cursor-dot" />

      {/* Top Right Glassmorphic Audio Toggle */}
      <button
        type="button"
        className={`audio-toggle-btn ${isAudioPlaying ? 'is-active' : ''}`}
        onClick={toggleAudio}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isAudioPlaying ? 'Mute audio' : 'Play audio'}
      >
        {isAudioPlaying ? (
          <Volume2 size={16} color="#00FF66" />
        ) : (
          <VolumeX size={16} opacity={0.6} />
        )}
        <span>{isAudioPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
        <div className="eq-bars">
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
        </div>
      </button>

      {/* Absolute Centered Massive Title */}
      <h1
        ref={titleRef}
        className="hero-title"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {titleText}
      </h1>
    </div>
  );
};

export default Hero;
