import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CalculatedChaos.css';

gsap.registerPlugin(ScrollTrigger);

interface ChaosItem {
  id: string;
  type: 'polaroid' | 'note' | 'music' | 'postit';
  x: number;
  y: number;
  rotation: number;
  pinColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  imgUrl?: string;
  caption?: string;
  badge?: string;
  title?: string;
  content?: string[];
  track?: string;
  artist?: string;
}

const INITIAL_ITEMS: ChaosItem[] = [
  {
    id: 'item-1',
    type: 'polaroid',
    x: 40,
    y: 50,
    rotation: -5,
    pinColor: 'red',
    imgUrl: '/myimage.jfif',
    caption: 'me, probably mid-laugh'
  },
  {
    id: 'item-2',
    type: 'note',
    x: 250,
    y: 35,
    rotation: 2,
    pinColor: 'blue',
    badge: 'OFF THE CLOCK',
    title: "Hi, I'm Navin. Not the work version.",
    content: [
      "Things I can't stop doing:",
      "• Exploring creative UI animations",
      "• Long drives, music turned way up",
      "• Trying new tech stacks & frameworks",
      "When I'm not coding:",
      "• Spotify is on. Always.",
      "• Asking 'what if?' about everything"
    ]
  },
  {
    id: 'item-3',
    type: 'polaroid',
    x: 580,
    y: 45,
    rotation: -4,
    pinColor: 'red',
    imgUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    caption: 'Coldplay. Best night ever.'
  },
  {
    id: 'item-4',
    type: 'polaroid',
    x: 790,
    y: 40,
    rotation: 5,
    pinColor: 'purple',
    imgUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    caption: 'first gift from my friends'
  },
  {
    id: 'item-5',
    type: 'polaroid',
    x: 50,
    y: 370,
    rotation: 4,
    pinColor: 'yellow',
    imgUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80',
    caption: 'I stop for cars, always.'
  },
  {
    id: 'item-6',
    type: 'polaroid',
    x: 250,
    y: 380,
    rotation: -4,
    pinColor: 'red',
    imgUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
    caption: 'my buddy, Olive'
  },
  {
    id: 'item-7',
    type: 'music',
    x: 450,
    y: 375,
    rotation: 2,
    pinColor: 'red',
    track: 'On Repeat',
    artist: 'Apple Music / Spotify'
  },
  {
    id: 'item-8',
    type: 'polaroid',
    x: 650,
    y: 350,
    rotation: -3,
    pinColor: 'green',
    imgUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=80',
    caption: 'the happy noise'
  },
  {
    id: 'item-9',
    type: 'postit',
    x: 850,
    y: 460,
    rotation: 6,
    caption: 'My brain has 40 tabs open at all times.'
  }
];

export function CalculatedChaos() {
  const [items, setItems] = useState<ChaosItem[]>(INITIAL_ITEMS);
  const [activeZ, setActiveZ] = useState<Record<string, number>>({});
  const maxZRef = useRef<number>(10);
  const dragStartRef = useRef<{ id: string; startX: number; startY: number; itemX: number; itemY: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    maxZRef.current += 1;
    setActiveZ(prev => ({ ...prev, [id]: maxZRef.current }));

    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;

    dragStartRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      itemX: targetItem.x,
      itemY: targetItem.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const { id, startX, startY, itemX, itemY } = dragStartRef.current;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            x: itemX + deltaX,
            y: itemY + deltaY
          };
        }
        return item;
      })
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
      dragStartRef.current = null;
    }
  };

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const header = sectionRef.current.querySelector('.chaos-header');
      const board = sectionRef.current.querySelector('.chaos-board-container');
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

  return (
    <section className="chaos-section" id="chaos-section" ref={sectionRef}>
      <div className="chaos-header">
        <div className="chaos-tag">
          <span>⚡</span> OFF THE CLOCK
        </div>
        <h2 className="chaos-title">
          Calculated <span>chaos.</span>
        </h2>
        <p className="chaos-subtitle">
          24. Based in India. When I'm not building interfaces in React & GSAP, I'm usually exploring photography & music.
        </p>
      </div>

      <div className="chaos-board-container" onPointerMove={handlePointerMove}>
        <div className="chaos-board-bg" />

        {items.map(item => {
          const zIndex = activeZ[item.id] || 1;
          const isHovered = hoveredId === item.id;
          // Rotate slightly on hover (tilt back towards 0 or subtle wiggle)
          const currentRotation = isHovered ? item.rotation * 0.2 : item.rotation;
          const scale = isHovered ? 1.06 : 1;

          return (
            <div
              key={item.id}
              className="drag-card"
              style={{
                transform: `translate3d(${item.x}px, ${item.y}px, 0px) rotate(${currentRotation}deg) scale(${scale})`,
                zIndex: zIndex
              }}
              onPointerDown={e => handlePointerDown(e, item.id)}
              onPointerUp={handlePointerUp}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {item.type !== 'postit' && item.pinColor && (
                <div className={`push-pin ${item.pinColor}`} />
              )}

              {item.type === 'polaroid' && (
                <div className="polaroid-card">
                  <div className="polaroid-img-box">
                    <img src={item.imgUrl} alt={item.caption} draggable={false} />
                  </div>
                  <div className="polaroid-caption">{item.caption}</div>
                </div>
              )}

              {item.type === 'note' && (
                <div className="note-paper-card">
                  {item.badge && <div className="note-paper-badge">{item.badge}</div>}
                  {item.title && <div className="note-paper-title">{item.title}</div>}
                  {item.content && (
                    <ul className="note-paper-list">
                      {item.content.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {item.type === 'music' && (
                <div className="music-widget-card">
                  <div className="music-top">
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>MUSIC</span>
                    <span style={{ fontSize: '0.85rem' }}>🎵</span>
                  </div>
                  <div className="music-disc" />
                  <div className="music-info">
                    <p className="music-track">{item.track}</p>
                    <span className="music-artist">{item.artist}</span>
                  </div>
                </div>
              )}

              {item.type === 'postit' && (
                <div className="postit-note">
                  <div className="tape-strip" />
                  {item.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CalculatedChaos;
