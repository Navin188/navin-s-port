import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { Move, MessageSquare, Send } from 'lucide-react';
import './Manifesto.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

export interface StickyNote {
  id: string;
  badge?: string;
  text?: string;
  isInput?: boolean;
  initialPos: { top: string; left: string; rotate: number };
}

const initialNotes: StickyNote[] = [
  {
    id: 'note-1',
    badge: 'MANIFESTO #01',
    text: '💡 Micro-animations sell the macro product vision.',
    initialPos: { top: '60px', left: '30px', rotate: -4 },
  },
  {
    id: 'note-2',
    badge: 'MANIFESTO #02',
    text: '⚡ API-driven, high-performance & pixel-perfect.',
    initialPos: { top: '80px', left: '260px', rotate: 3 },
  },
  {
    id: 'note-3',
    badge: 'MANIFESTO #03',
    text: '🚀 High Conversion = Aesthetic Excellence + Speed.',
    initialPos: { top: '230px', left: '60px', rotate: -2 },
  },
  {
    id: 'note-4',
    badge: 'INTERACTIVE',
    text: '🎯 Drag me anywhere inside the stickyboard!',
    initialPos: { top: '250px', left: '270px', rotate: 4 },
  },
  {
    id: 'note-5',
    badge: 'LEAVE A NOTE',
    isInput: true,
    initialPos: { top: '400px', left: '160px', rotate: -3 },
  },
];

export const Manifesto = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stickyboardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [userNote, setUserNote] = useState('');
  const [submittedNotes, setSubmittedNotes] = useState<string[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. ScrollTrigger fade-in animation for left heading
      if (headingRef.current && sectionRef.current) {
        gsap.from(headingRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 2. Initialize Draggable on all sticky cards
      const validCardElements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (validCardElements.length > 0 && stickyboardRef.current) {
        Draggable.create(validCardElements, {
          bounds: stickyboardRef.current,
          edgeResistance: 0.65,
          type: 'x,y',
          dragClickables: false,
          onPress: function () {
            gsap.set(this.target, { zIndex: 50 });
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [submittedNotes]);

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNote.trim()) return;
    setSubmittedNotes((prev) => [...prev, userNote.trim()]);
    setUserNote('');
  };

  return (
    <section className="manifesto-section" ref={sectionRef}>
      <div className="manifesto-grid">
        {/* Left Side: ScrollTrigger Animated Heading */}
        <div className="manifesto-left">
          <div className="manifesto-tag">
            <MessageSquare size={14} color="#00FF66" />
            <span>Core Philosophy</span>
          </div>

          <h2 className="manifesto-heading" ref={headingRef}>
            <span className="highlight-quote">"Jo dikhta hai, wo bikhta hai."</span>
            <span className="highlight-body">
              I turn wireframes into dynamic, API-driven reality.
            </span>
          </h2>

          <p className="manifesto-subtext">
            Every interaction is crafted to captivate users and convert visitors into loyal customers.
            Try dragging the sticky notes on the right to interact with the board!
          </p>
        </div>

        {/* Right Side: Draggable Stickyboard Container */}
        <div className="manifesto-right">
          <div className="stickyboard-container" ref={stickyboardRef}>
            <div className="stickyboard-header">
              <span>Interactive Stickyboard</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Move size={12} /> Drag cards around
              </span>
            </div>

            {/* Render 5 Glassmorphic Sticky Cards */}
            {initialNotes.map((note, index) => (
              <div
                key={note.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="sticky-card"
                style={{
                  top: note.initialPos.top,
                  left: note.initialPos.left,
                  transform: `rotate(${note.initialPos.rotate}deg)`,
                }}
              >
                {note.badge && <div className="sticky-card-badge">{note.badge}</div>}

                {!note.isInput ? (
                  <div className="sticky-card-text">{note.text}</div>
                ) : (
                  <div className="sticky-card-input-wrapper">
                    <div className="sticky-card-text" style={{ fontSize: '0.85rem' }}>
                      ✍️ Leave a note on the board:
                    </div>
                    <form onSubmit={handleNoteSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        className="sticky-card-input"
                        placeholder="Type your thought..."
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                      />
                      <button type="submit" className="sticky-card-btn" aria-label="Post note">
                        <Send size={12} />
                      </button>
                    </form>
                    {submittedNotes.length > 0 && (
                      <div
                        style={{
                          marginTop: '0.4rem',
                          fontSize: '0.75rem',
                          color: '#00FF66',
                          fontStyle: 'italic',
                        }}
                      >
                        Latest note: "{submittedNotes[submittedNotes.length - 1]}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
