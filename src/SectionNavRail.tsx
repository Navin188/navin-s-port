import { useEffect, useState } from 'react';
import './SectionNavRail.css';

interface NavSection {
  id: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: 'hero-section',         label: 'Hero' },
  { id: 'about-section',        label: 'About' },
  { id: 'journey-section',      label: 'Journey' },
  { id: 'chaos-section',        label: 'Off The Clock' },
  { id: 'projects',             label: 'Projects' },
  { id: 'technical-skills',     label: 'Technical Stack' },
  { id: 'note-wall-section',    label: 'Note Wall' },
  { id: 'reels-section',        label: 'Reels' },
  { id: 'footer-section',       label: 'Footer' },
];

export const SectionNavRail = () => {
  const [activeId, setActiveId] = useState<string>('hero-section');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const secEl = document.getElementById(SECTIONS[i].id);
        if (secEl) {
          const top = secEl.offsetTop;
          if (scrollPos >= top) {
            setActiveId(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sn-rail" aria-label="Section Navigation">
      {SECTIONS.map((sec) => (
        <button
          key={sec.id}
          type="button"
          onClick={() => scrollToSection(sec.id)}
          className={`sn-item ${activeId === sec.id ? 'sn-active' : ''}`}
          aria-label={`Scroll to ${sec.label}`}
        >
          <span className="sn-tooltip">{sec.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SectionNavRail;
