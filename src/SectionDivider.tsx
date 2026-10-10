import { useEffect, useRef, useState } from 'react';
import './SectionDivider.css';

interface SectionDividerProps {
  label?: string;
}

export const SectionDivider = ({ label = '◇' }: SectionDividerProps) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (dividerRef.current) {
      observer.observe(dividerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={dividerRef}
      className={`section-divider-wrap ${isVisible ? 'sd-visible' : ''}`}
      aria-hidden="true"
    >
      <div className="sd-glow-spot" />
      <div className="sd-beam-line">
        <div className="sd-pulse-light" />
      </div>
      <div className="sd-node">
        <span>{label}</span>
      </div>
    </div>
  );
};

export default SectionDivider;
