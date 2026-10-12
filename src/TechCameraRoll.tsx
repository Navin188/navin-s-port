import { useState, useRef } from 'react';
import {
  IcoHTML5,
  IcoCSS3,
  IcoBootstrap,
  IcoJavaScript,
  IcoReact,
  IcoAngular,
  IcoFigma,
  IcoMaterialUI,
  IcoSQL,
  IcoTailwind,
} from './SkillIcons';
import './TechCameraRoll.css';

interface TechPolaroid {
  id: string;
  name: string;
  category: string;
  caption: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  stamp: string;
  year: string;
}

const TECH_ITEMS: TechPolaroid[] = [
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend Framework',
    caption: 'React · Dynamic State & Components',
    color: '#61DAFB',
    Icon: IcoReact,
    stamp: 'CORE STACK',
    year: '2022-26',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Core Language',
    caption: 'JavaScript · ES6+, Async & DOM Logic',
    color: '#F7DF1E',
    Icon: IcoJavaScript,
    stamp: 'MODERN JS',
    year: '2021-26',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Styling Engine',
    caption: 'Tailwind CSS · Utility-First Styling',
    color: '#06B6D4',
    Icon: IcoTailwind,
    stamp: 'RESPONSIVE',
    year: '2022-26',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'UI/UX Design',
    caption: 'Figma · Design Systems & Wireframes',
    color: '#F24E1E',
    Icon: IcoFigma,
    stamp: 'PIXEL PERFECT',
    year: '2021-26',
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Frontend Framework',
    caption: 'Angular · Enterprise Architecture',
    color: '#DD0031',
    Icon: IcoAngular,
    stamp: 'ENTERPRISE',
    year: '2022-24',
  },
  {
    id: 'materialui',
    name: 'Material UI',
    category: 'Component Library',
    caption: 'Material UI · Component Libraries',
    color: '#007FFF',
    Icon: IcoMaterialUI,
    stamp: 'CLEAN UI',
    year: '2022-25',
  },
  {
    id: 'html',
    name: 'HTML 5',
    category: 'Markup Standard',
    caption: 'HTML5 · Semantic Web Structure',
    color: '#E34F26',
    Icon: IcoHTML5,
    stamp: 'SEMANTIC',
    year: '2021-26',
  },
  {
    id: 'css',
    name: 'CSS 3',
    category: 'Styling & Layouts',
    caption: 'CSS3 · Flex, Grid & Keyframes',
    color: '#1572B6',
    Icon: IcoCSS3,
    stamp: 'ANIMATIONS',
    year: '2021-26',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'CSS Framework',
    caption: 'Bootstrap · Rapid Responsive Grids',
    color: '#7952B3',
    Icon: IcoBootstrap,
    stamp: 'GRID SYSTEM',
    year: '2021-24',
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Database & Queries',
    caption: 'SQL · Relational Data & Queries',
    color: '#336791',
    Icon: IcoSQL,
    stamp: 'DATABASES',
    year: '2022-25',
  },
];

export const TechCameraRoll = () => {
  const [isPrinted, setIsPrinted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [activePolaroid, setActivePolaroid] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePrintToggle = () => {
    if (isPrinting) return;

    if (!isPrinted) {
      setIsPrinting(true);
      setTimeout(() => {
        setIsPrinted(true);
        setIsPrinting(false);
      }, 700);
    } else {
      // Re-print animation cycle
      setIsPrinting(true);
      setIsPrinted(false);
      setTimeout(() => {
        setIsPrinted(true);
        setIsPrinting(false);
      }, 700);
    }
  };

  return (
    <section className="tech-camera-section" id="technologies-section">
      <div className="tech-camera-header">
        <span className="tech-camera-eyebrow">
          <span>📷</span> CAMERA ROLL
        </span>
        <h2 className="tech-camera-title">
          Technologies I <span>Aware About</span>
        </h2>
        <p className="tech-camera-subtitle">
          An authentic photographic print roll of the 10 core technologies and UI tools I work with daily.
        </p>
      </div>

      {/* Skeuomorphic Film Cartridge & Trigger Button */}
      <div className="camera-cartridge-panel">
        <div className="camera-printer-top">
          <div className="camera-lens-indicator">
            <span className="camera-lens-dot" />
            <span className="camera-lens-text">35mm DEV FILM · 10 EXPOSURES</span>
          </div>

          <button
            onClick={handlePrintToggle}
            className={`camera-print-btn ${isPrinting ? 'is-printing' : ''}`}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <>
                <span className="print-spinner" /> Printing technologies...
              </>
            ) : isPrinted ? (
              <>
                <span>🔄</span> Print them again
              </>
            ) : (
              <>
                <span>📸</span> Print Tech Roll
              </>
            )}
          </button>
        </div>

        {/* Ejection Film Slot with laser scan effect */}
        <div className="camera-film-slot">
          <div className={`camera-laser-bar ${isPrinting ? 'active' : ''}`} />
          <div className="camera-slot-lip" />
        </div>
      </div>

      {/* Fanned Out Polaroid Cards Gallery */}
      <div
        className={`polaroid-gallery-wrapper ${isPrinted ? 'is-visible' : ''}`}
        ref={trackRef}
      >
        <div className="polaroid-cards-track">
          {TECH_ITEMS.map((tech, index) => {
            const rotations = [-6, 4, -4, 5, -5, 3, -4, 6, -3, 4];
            const rotation = rotations[index % rotations.length];
            const isHovered = activePolaroid === tech.id;

            return (
              <div
                key={tech.id}
                className={`tech-polaroid-card ${isHovered ? 'is-active' : ''}`}
                style={
                  {
                    '--rot': `${rotation}deg`,
                    '--delay': `${index * 80}ms`,
                    '--tech-color': tech.color,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setActivePolaroid(tech.id)}
                onMouseLeave={() => setActivePolaroid(null)}
                onClick={() =>
                  setActivePolaroid(activePolaroid === tech.id ? null : tech.id)
                }
              >
                {/* Vintage Circular Film Stamp */}
                <div className="polaroid-stamp">
                  <span>{tech.stamp}</span>
                </div>

                {/* Photo Compartment with Icon at Center */}
                <div className="polaroid-photo-frame">
                  {/* Subtle Studio Backdrop with Ambient Color Glow */}
                  <div
                    className="polaroid-ambient-glow"
                    style={{ background: tech.color }}
                  />

                  {/* Glass Sheen */}
                  <div className="polaroid-glass-sheen" />

                  {/* Centered Large Technology Icon */}
                  <div className="polaroid-icon-center">
                    <tech.Icon size={76} color={tech.color} />
                  </div>

                  <span className="polaroid-category-badge">{tech.category}</span>
                </div>

                {/* Bottom Paper Border with Handwritten Style Caption */}
                <div className="polaroid-bottom-paper">
                  <div className="polaroid-tech-name">{tech.name}</div>
                  <div className="polaroid-caption-text">{tech.caption}</div>
                  <div className="polaroid-year-stamp">{tech.year}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isPrinted && (
        <p className="polaroid-hint-text">
          💡 <em>Hover or tap any polaroid to inspect the technology</em>
        </p>
      )}
    </section>
  );
};

export default TechCameraRoll;
