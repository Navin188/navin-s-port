import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Move, User } from 'lucide-react';
import {
  fetchStickyNotesFromDB,
  createStickyNoteInDB,
} from './services/supabaseService';
import './NoteWall.css';

gsap.registerPlugin(Draggable, ScrollTrigger);

export interface StickyNoteItem {
  id: string;
  badge: string;
  text: string;
  top: string;
  left: string;
  rotate: number;
  colorClass: string;
}

const colorPaletteClasses = ['note-card-yellow', 'note-card-pink', 'note-card-blue', 'note-card-purple'];

// Calculates slot coordinates across the ENTIRE board width (5 columns x 3 rows = 15 distinct slots)
const getSlotCoordinates = (index: number) => {
  const COLS = 5;
  const ROWS = 3;
  const slot = index % (COLS * ROWS);
  const col = slot % COLS;
  const row = Math.floor(slot / COLS);

  // Spans full width from left (3%) through center (42%) to right (80.5%)
  const leftPercent = 3 + col * 19.5;
  const topPx = 35 + row * 145;

  // Natural organic jitter and tilt
  const jitterX = ((index * 13) % 16) - 8;
  const jitterY = ((index * 17) % 16) - 8;
  const rotate = ((index * 7) % 11) - 5;

  return {
    top: `${Math.max(25, Math.min(340, topPx + jitterY))}px`,
    left: `calc(${leftPercent}% + ${jitterX}px)`,
    rotate: rotate === 0 ? (index % 2 === 0 ? -3 : 3) : rotate,
  };
};

export const NoteWall = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [notes, setNotes] = useState<StickyNoteItem[]>([]);
  const [inputAuthor, setInputAuthor] = useState('');
  const [inputText, setInputText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Sticky Notes from Supabase
  useEffect(() => {
    const loadDBNotes = async () => {
      const { data, error } = await fetchStickyNotesFromDB();
      if (!error && data && data.length > 0) {
        const formatted: StickyNoteItem[] = data.map((item, i) => {
          const coords = getSlotCoordinates(i);
          // Show the person's real name on the note badge instead of "COMMUNITY NOTE"
          let authorName = 'Anonymous';
          if (item.author_name && item.author_name.trim() && item.author_name.trim().toLowerCase() !== 'visitor') {
            authorName = item.author_name.trim();
          } else if (item.badge && item.badge.trim() && item.badge.trim().toUpperCase() !== 'COMMUNITY NOTE') {
            authorName = item.badge.trim();
          }

          return {
            id: item.id || `db-note-${i}`,
            badge: authorName,
            text: item.message,
            top: coords.top,
            left: coords.left,
            rotate: coords.rotate,
            colorClass: item.color_class || colorPaletteClasses[i % colorPaletteClasses.length],
          };
        });
        setNotes(formatted);
      }
    };
    loadDBNotes();
  }, []);

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

  useEffect(() => {
    if (sectionRef.current) {
      const header = sectionRef.current.querySelector('.notewall-header');
      const board = sectionRef.current.querySelector('.notewall-board');
      if (header) {
        gsap.fromTo(
          header,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          }
        );
      }
      if (board) {
        gsap.fromTo(
          board,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        );
      }
    }
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || submittingNote) return;
    setErrorMsg(null);
    setSubmittingNote(true);

    const nextIndex = notes.length;
    const coords = getSlotCoordinates(nextIndex);
    const color = colorPaletteClasses[nextIndex % colorPaletteClasses.length];
    const textToInsert = inputText.trim();
    const authorNameClean = inputAuthor.trim();
    const authorToInsert = authorNameClean || 'Anonymous';
    const displayBadge = authorNameClean || 'Anonymous';

    const { data, error } = await createStickyNoteInDB({
      message: textToInsert,
      author_name: authorToInsert,
      badge: displayBadge,
      color_class: color,
      top: coords.top,
      left: coords.left,
      rotate: coords.rotate,
    });

    setSubmittingNote(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    const newNote: StickyNoteItem = {
      id: data?.id || `user-note-${Date.now()}`,
      badge: displayBadge,
      text: textToInsert,
      top: coords.top,
      left: coords.left,
      rotate: coords.rotate,
      colorClass: color,
    };

    setNotes((prev) => [...prev, newNote]);
    setInputText('');
    setInputAuthor('');

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
    <section className="notewall-section" ref={sectionRef} id="note-wall-section">
      {/* Top Bar */}
      <div className="notewall-header">
        <div className="notewall-title-box">
          <h2 className="notewall-heading">
            Interactive <span>Stickyboard</span>
          </h2>

        </div>

        <form onSubmit={handleAddNote} className="notewall-form">
          <input
            type="text"
            className="notewall-input notewall-author-input"
            placeholder="Your name"
            maxLength={30}
            value={inputAuthor}
            onChange={(e) => setInputAuthor(e.target.value)}
            required
          />
          <input
            type="text"
            className="notewall-input"
            placeholder="Write a custom note..."
            maxLength={280}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
          />
          <button type="submit" className="notewall-submit-btn" disabled={submittingNote}>
            <Plus size={16} />
            <span>{submittingNote ? 'Posting...' : 'Add Note'}</span>
          </button>
        </form>

        {/* Visible State Counter */}
        {/* <div className="notewall-count-badge">Total Notes: {notes.length}</div> */}
      </div>

      {errorMsg && (
        <div style={{ color: '#EF4444', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Stickyboard Container */}
      <div className="stickyboard-workspace" ref={boardRef}>
        <div className="stickyboard-bg-hint">
          <Move size={15} /> Drag &amp; Throw Sticky Notes
        </div>

        {notes.length === 0 && (
          <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, pointerEvents: 'none', textAlign: 'center' }}>
            ✨ No sticky notes posted yet. Write a note above and click "Add Note"!
          </div>
        )}

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
            <div className="note-card-badge">
              <User size={11} style={{ opacity: 0.75, flexShrink: 0 }} />
              <span>{note.badge}</span>
            </div>
            <div className="note-card-text">{note.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NoteWall;
