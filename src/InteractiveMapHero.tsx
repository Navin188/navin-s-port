import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from './assets/heroimage.png';
import myImage from './assets/myimage.jfif';
import './InteractiveMapHero.css';

gsap.registerPlugin(ScrollTrigger);

interface HotspotData {
  id: string;
  label: string;
  year?: string;
  topPct: number;
  leftPct: number;
  chapter: string;
  title: string;
  role: string;
  description: string;
  metrics: { val: string; label: string }[];
  gallery: string[];
  isAvatar?: boolean;
}

const HOTSPOTS: HotspotData[] = [
  {
    id: 'degree',
    label: 'BIGCE - Engineering',
    year: '2020',
    topPct: 45,
    leftPct: 18,
    chapter: 'CHAPTER 01 · 2016 - 2020',
    title: 'BIGCE (Engineering)',
    role: 'Bachelor of Engineering in Computer Science',
    description: 'Graduated with Computer Engineering degree. Built strong foundations in algorithm analysis, data structures, web application architecture, and software engineering.',
    metrics: [
      { val: '8.4 CGPA', label: 'Academic Score' },
      { val: '100%', label: 'CS Engineering' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'navin',
    label: 'Navin - UI Developer',
    year: 'LOCATION',
    topPct: 72,
    leftPct: 50,
    chapter: 'THE CREATOR',
    title: 'Navin Patil',
    role: 'UI Designer turned Frontend Developer',
    description: 'Obsessed with fluid micro-interactions, GSAP scroll animations, and building state-of-the-art web products that wow visitors and deliver flawless UX.',
    metrics: [
      { val: 'UI + FE', label: 'Full Spectrum' },
      { val: 'Awwwards', label: 'Design Quality' }
    ],
    gallery: [
      myImage,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80'
    ],
    isAvatar: true
  },
  {
    id: 'shaurya',
    label: 'Shaurya Technosoft',
    year: '2021-PRESENT',
    topPct: 45,
    leftPct: 82,
    chapter: 'CHAPTER 02 · FEB 2021 - PRESENT',
    title: 'Shaurya Technosoft',
    role: 'Frontend Developer (4+ Years Exp)',
    description: 'Spearheaded enterprise frontend architectures, transforming Figma wireframes into dynamic, high-performance, and API-driven web applications using React, TypeScript, Tailwind, and GSAP.',
    metrics: [
      { val: '4+ Years', label: 'Frontend Exp' },
      { val: '15+ Apps', label: 'Shipped to Prod' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80'
    ]
  }
];

export function InteractiveMapHero() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isPlaying, setIsPlaying] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const aspectContainerRef = useRef<HTMLDivElement>(null);

  // Audio control
  const audioCtxRef = useRef<AudioContext | null>(null);
  const toggleSound = () => {
    if (!isPlaying) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setIsPlaying(true);
      } catch {
        setIsPlaying(true);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setIsPlaying(false);
    }
  };

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // GSAP Fly-In Zoom & Fade Transition
  const handleScrollFlyIn = () => {
    if (!aspectContainerRef.current) return;
    gsap.to(aspectContainerRef.current, {
      scale: 3,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        const nextSection = document.getElementById('about-section') || document.getElementById('about');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }
        setTimeout(() => {
          gsap.set(aspectContainerRef.current, { scale: 1, opacity: 1 });
        }, 1500);
      }
    });
  };

  // Wheel Scroll Trigger connection
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 25) {
        handleScrollFlyIn();
      }
    };
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('wheel', handleWheel, { passive: true });
    }
    return () => {
      if (wrapper) wrapper.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="map-hero-wrapper" id="hero-section">
      {/* 1. Top Left Title Overlay */}
      <div className="map-overlay-header">
        <h1 className="map-overlay-title">
          Navin's <span>World</span>
        </h1>
        <p className="map-overlay-subtitle">
          Tech City Overworld • Click Hotspots to Inspect • Scroll to Fly In
        </p>
      </div>

      {/* 2. Top Right Controls */}
      <div className="map-controls-topright">
        <button onClick={toggleSound} className="map-control-btn">
          {isPlaying ? '🔊 AUDIO ON' : '🔇 AUDIO OFF'}
        </button>
        <button onClick={toggleTheme} className="map-control-btn">
          {theme === 'light' ? '☀️ LIGHT' : '🌙 DARK'}
        </button>
      </div>

      {/* 3. Perfect 16:9 Aspect Ratio Container holding uncropped image + locked hotspots */}
      <div ref={aspectContainerRef} className="map-aspect-container">
        <img
          src={heroImage}
          alt="Tech City Overworld Landscape"
          className="map-hero-img"
        />

        {/* Ambient Atmospheric Overlay for eye-comfort & high contrast */}
        <div className="map-hero-overlay" />

        {/* Hotspots locked inside 16:9 aspect-ratio container */}
        {HOTSPOTS.map(spot => (
          <div
            key={spot.id}
            className="hotspot-wrapper"
            style={{
              top: `${spot.topPct}%`,
              left: `${spot.leftPct}%`
            }}
            onClick={e => {
              e.stopPropagation();
              setActiveHotspot(spot);
            }}
          >
            <div className={`hotspot-label-pill ${spot.isAvatar ? 'navin-pill' : ''}`}>
              <span>{spot.isAvatar ? '👤' : '📍'}</span>
              <span>{spot.label}</span>
              {spot.year && <span className="hotspot-label-year">{spot.year}</span>}
            </div>

            {/* Custom Avatar for 'Navin' vs Dot for standard hotspots */}
            {spot.isAvatar ? (
              <div className="hotspot-avatar-container">
                <img src={myImage} alt="Navin Patil" className="hotspot-avatar-img" />
              </div>
            ) : (
              <div className="hotspot-dot-container">
                <div className="hotspot-pulse-ring" />
                <div className="hotspot-dot-inner" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. Modern Dark Glassmorphism Details Modal */}
      {activeHotspot && (
        <div className="map-modal-overlay">
          <div className="map-modal-header">
            <div className="map-modal-chapter">
              <span>●</span> {activeHotspot.chapter}
            </div>
            <button
              className="map-modal-close"
              onClick={() => setActiveHotspot(null)}
            >
              ✕
            </button>
          </div>

          <h2 className="map-modal-title">{activeHotspot.title}</h2>
          <div className="map-modal-role">{activeHotspot.role}</div>
          <p className="map-modal-desc">{activeHotspot.description}</p>

          {/* Gallery Thumbnails */}
          <div className="map-modal-gallery">
            {activeHotspot.gallery.map((img, idx) => (
              <div key={idx} className="map-modal-thumb">
                <img src={img} alt={`Gallery ${idx + 1}`} />
              </div>
            ))}
          </div>

          {/* Metrics Grid */}
          <div className="map-modal-metrics">
            {activeHotspot.metrics.map((m, idx) => (
              <div key={idx} className="map-metric-box">
                <div className="map-metric-val">{m.val}</div>
                <div className="map-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Bottom Center 'Scroll to Fly In' Pill */}
      <div className="map-flyin-pill" onClick={handleScrollFlyIn}>
        <span>🖱️</span> scroll to Fly In <span>↓</span>
      </div>
    </div>
  );
}

export default InteractiveMapHero;
