import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Briefcase,
  Heart,
  RotateCcw,
} from 'lucide-react';
import { fetchReelsByCategory, type PortfolioReelRecord } from './services/supabaseService';
import iPhoneFrame from './assets/iPhone-frame-transparent.png';
import './ReelsSection.css';

type ReelCategory = 'corporateand-fun' | 'poetryand-feeling';

interface CategoryConfig {
  id: ReelCategory;
  label: string;
  tagline: string;
  icon: typeof Briefcase;
  accentClass: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'corporateand-fun',
    label: 'Corporate & Fun',
    tagline: 'Life behind the standups, sprints & whiteboard sessions',
    icon: Briefcase,
    accentClass: 'theme-corporate',
  },
  {
    id: 'poetryand-feeling',
    label: 'Poetry & Feelings',
    tagline: 'Verses, late-night musings & heartfelt emotions',
    icon: Heart,
    accentClass: 'theme-poetry',
  },
];

export const ReelsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ReelCategory | null>(null);
  const [reels, setReels] = useState<PortfolioReelRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const categoryReqId = useRef(0);

  // Reset reels when user scrolls away from this section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.pause();
          }
          setActiveCategory(null);
          setCurrentIndex(0);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetch reels when category changes
  useEffect(() => {
    if (!activeCategory) {
      setReels([]);
      setLoading(false);
      return;
    }

    const currentReq = ++categoryReqId.current;
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setProgress(0);
    setVideoLoading(true);

    const loadReels = async () => {
      const { data, error: fetchErr } = await fetchReelsByCategory(activeCategory);

      // Prevent race conditions if user toggles quickly
      if (currentReq !== categoryReqId.current) return;

      if (fetchErr && (!data || data.length === 0)) {
        setError(fetchErr);
        setReels([]);
      } else {
        setReels(data);
      }
      setLoading(false);
    };

    loadReels();
  }, [activeCategory]);

  const activeReel = reels[currentIndex];
  const totalReels = reels.length;

  // Handle video element play/reset on index or category change
  useEffect(() => {
    if (!activeCategory) return;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      setVideoLoading(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with sound restricted, mute and retry
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, [currentIndex, activeCategory, activeReel?.video_path]);

  // Video progress tracker
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Cyclic Navigation
  const handleNext = () => {
    if (totalReels <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalReels);
  };

  const handlePrev = () => {
    if (totalReels <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalReels) % totalReels);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const currentTheme = CATEGORIES.find((c) => c.id === activeCategory)?.accentClass || 'theme-corporate';

  return (
    <section className={`reels-section ${currentTheme}`} id="reels-section" ref={sectionRef}>
      <div className="reels-glow-ambient" />

      <div className="reels-container">
        {/* Left Column: Context, Category Switcher & Reel Description */}
        <div className="reels-left-col">
          <h2 className="reels-heading">
            Corporate by Day, <span>Poet by Scroll</span>
          </h2>

          <div className="reels-copy">
            <p className="reels-lead">
              A little corporate, a little creative, and a lot of me.
            </p>
            <p className="reels-body">
              I hope you enjoyed exploring my portfolio and left a little note on my Note Wall.
              Now, let's switch gears.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="reels-tabs-wrapper">
            <span className="reels-tabs-label">CHOOSE A VIBE</span>
            <div className="reels-tabs">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`reels-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    type="button"
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: iPhone Mockup & Video Player */}
        <div className="reels-right-col">
          {/* Navigation Controls Beside Phone */}
          <div className="phone-nav-controls">
            <button
              className="nav-arrow-btn prev-btn"
              onClick={handlePrev}
              disabled={!activeCategory || totalReels <= 1 || loading}
              aria-label="Previous Reel"
            >
              <ChevronLeft size={22} />
            </button>

            {/* iPhone Frame Container */}
            <div className="iphone-mockup-wrapper">
              {/* iPhone Hardware Outer Frame Overlay */}
              <img
                src={iPhoneFrame}
                alt="iPhone Mockup"
                className="iphone-frame-overlay"
                draggable={false}
              />

              {/* Inner Screen Area */}
              <div className="iphone-screen">
                {!activeCategory ? (
                  <div className="screen-state-box welcome-state">
                    <div className="welcome-glow-dot" />
                    <div className="welcome-icon-bubble">
                      <Sparkles size={24} className="welcome-sparkle-icon" />
                    </div>
                    <h4 className="welcome-title">Select a Vibe</h4>
                    <p className="welcome-subtitle">
                      Choose a category on the left to start watching reels
                    </p>
                    <div className="welcome-quick-pills">
                      <button
                        type="button"
                        className="welcome-pill-btn corporate"
                        onClick={() => setActiveCategory('corporateand-fun')}
                      >
                        <Briefcase size={12} />
                        <span>Corporate &amp; Fun</span>
                      </button>
                      <button
                        type="button"
                        className="welcome-pill-btn poetry"
                        onClick={() => setActiveCategory('poetryand-feeling')}
                      >
                        <Heart size={12} />
                        <span>Poetry &amp; Feelings</span>
                      </button>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="screen-state-box">
                    <div className="reels-spinner" />
                    <span>Loading reels...</span>
                  </div>
                ) : error && reels.length === 0 ? (
                  <div className="screen-state-box error">
                    <span>Unable to load video</span>
                    <button
                      className="retry-btn"
                      onClick={() => setActiveCategory(activeCategory)}
                    >
                      <RotateCcw size={14} /> Retry
                    </button>
                  </div>
                ) : reels.length === 0 ? (
                  <div className="screen-state-box">
                    <span>No reels published yet</span>
                  </div>
                ) : (
                  <>
                    {/* Active Video Element */}
                    <video
                      ref={videoRef}
                      src={activeReel.video_path}
                      poster={activeReel.thumbnail_path}
                      className="iphone-video"
                      playsInline
                      loop
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onWaiting={() => setVideoLoading(true)}
                      onPlaying={() => setVideoLoading(false)}
                      onClick={togglePlay}
                    />

                    {/* Video Loading Spinner Overlay */}
                    {videoLoading && (
                      <div className="video-buffering-overlay">
                        <div className="reels-spinner small" />
                      </div>
                    )}

                    {/* Video Floating Controls Overlay */}
                    <div className="screen-controls-overlay">
                      {/* Top Bar inside Screen */}
                      <div className="screen-top-bar">
                        <button
                          className="screen-icon-btn"
                          onClick={toggleMute}
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                        <button
                          className="screen-icon-btn"
                          onClick={togglePlay}
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      </div>

                      {/* Bottom Progress Bar inside Screen */}
                      <div className="screen-progress-container">
                        <div
                          className="screen-progress-bar"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              className="nav-arrow-btn next-btn"
              onClick={handleNext}
              disabled={!activeCategory || totalReels <= 1 || loading}
              aria-label="Next Reel"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
