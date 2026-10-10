import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Plus, Move, MessageSquare } from 'lucide-react';
import './NoteWall.css';

gsap.registerPlugin(Draggable);

export interface StickyNoteItem {
  id: string;
  badge: string;
  text: string;
  top: string;
  left: string;
  rotate: number;
  colorClass: string;
}

const initialMemes: StickyNoteItem[] = [
  {
    id: 'meme-1',
    badge: 'IT MEME #01',
    text: '💻 "It works on my machine"',
    top: '50px',
    left: '50px',
    rotate: -4,
    colorClass: 'note-card-yellow',
  },
  {
    id: 'meme-2',
    badge: 'IT MEME #02',
    text: '🔄 "Did you clear the cache?"',
    top: '70px',
    left: '360px',
    rotate: 3,
    colorClass: 'note-card-pink',
  },
  {
    id: 'meme-3',
    badge: 'IT MEME #03',
    text: '📧 "Meeting could have been an email"',
    top: '240px',
    left: '110px',
    rotate: -3,
    colorClass: 'note-card-blue',
  },
  {
    id: 'meme-4',
    badge: 'IT MEME #04',
    text: '🎨 "CSS is my passion"',
    top: '220px',
    left: '450px',
    rotate: 4,
    colorClass: 'note-card-purple',
  },
];

const colorPaletteClasses = ['note-card-yellow', 'note-card-pink', 'note-card-blue', 'note-card-purple'];

export const NoteWall = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [notes, setNotes] = useState<StickyNoteItem[]>(initialMemes);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length > 0 && boardRef.current) {
        Draggable.create(validCards, {
          bounds: boardRef.current,
          edgeResistance: 0.65,
          type: 'x,y',
          dragClickables: false,
          onPress: function () {
            gsap.set(this.target, { zIndex: 50 });
          },
        });
      }
    }, boardRef);

    return () => ctx.revert();
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const randomTop = `${Math.floor(Math.random() * 220 + 40)}px`;
    const randomLeft = `${Math.floor(Math.random() * 450 + 80)}px`;
    const randomRotate = Math.floor(Math.random() * 10 - 5);
    const randomColor = colorPaletteClasses[notes.length % colorPaletteClasses.length];

    const newNote: StickyNoteItem = {
      id: `user-note-${Date.now()}`,
      badge: 'COMMUNITY NOTE',
      text: inputText.trim(),
      top: randomTop,
      left: randomLeft,
      rotate: randomRotate,
      colorClass: randomColor,
    };

    setNotes((prev) => [...prev, newNote]);
    setInputText('');

    setTimeout(() => {
      const lastIndex = notes.length;
      const newCardEl = cardRefs.current[lastIndex];
      if (newCardEl) {
        gsap.from(newCardEl, {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        });
      }
    }, 50);
  };

  return (
    <section className="notewall-section" ref={sectionRef} id="notewall">
      {/* Top Bar */}
      <div className="notewall-header">
        <div className="notewall-title-box">
          <div className="notewall-tag">
            <MessageSquare size={14} color="var(--accent-primary)" />
            <span>Stickyboard</span>
          </div>
          <h2 className="notewall-heading">Stickyboard</h2>
        </div>

        <form onSubmit={handleAddNote} className="notewall-form">
          <input
            type="text"
            className="notewall-input"
            placeholder="Write a custom note..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="notewall-submit-btn">
            <Plus size={16} />
            <span>Add Note</span>
          </button>
        </form>

        {/* Visible State Counter */}
        <div className="notewall-count-badge">Total Notes: {notes.length}</div>
      </div>

      {/* Stickyboard Container */}
      <div className="stickyboard-workspace" ref={boardRef}>
        <div className="stickyboard-bg-hint">
          <Move size={15} /> Drag &amp; Throw Sticky Notes
        </div>

        {/* Render Draggable Sticky Notes */}
        {notes.map((note, index) => (
          <div
            key={note.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`note-card ${note.colorClass}`}
            style={{
              top: note.top,
              left: note.left,
              transform: `rotate(${note.rotate}deg)`,
            }}
          >
            <div className="note-card-badge">{note.badge}</div>
            <div className="note-card-text">{note.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NoteWall;
