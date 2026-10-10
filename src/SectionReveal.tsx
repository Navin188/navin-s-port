import React, { useEffect, useRef, useState } from 'react';
import './SectionReveal.css';

interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delayMs?: number;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  id,
  className = '',
  delayMs = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => setIsActive(true), delayMs);
          } else {
            setIsActive(true);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`section-reveal-container ${isActive ? 'sr-active' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionReveal;
