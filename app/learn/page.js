// ============================================================
// FILE: app/learn/page.js
// PURPOSE: Hub page — user chooses what to explore (3D Models, Lectures, etc.)
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Previously landing page went straight to /models.
//   /learn is a future-proof hub so new content types can be added
//   without restructuring routes.
// DEPENDENCIES: next/link
// ⚠️ DO NOT CHANGE:
//   - Scroll must be unlocked on mount — landing page locks it
//   - 'use client' required for useEffect scroll unlock
//   - Coming soon cards must NOT be links — they are not clickable
//   - Add new content types here as cards when they are built
// ============================================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { unlockScroll } from '../../lib/scrollUtils';

const CATEGORIES = [
  {
    id: 'models',
    emoji: '🦴',
    title: '3D Interactive Models',
    description: 'Explore the human body in 3D. Click any bone, organ, or structure to learn its anatomy and clinical significance.',
    href: '/models',
    live: true,
    color: '#4fc3f7',
    glow: 'rgba(79,195,247,0.15)',
  },
  {
    id: 'lectures',
    emoji: '🎓',
    title: 'Video Lectures',
    description: 'Structured lectures on anatomy, physiology, pharmacology, and nursing fundamentals — from basics to advanced.',
    href: null,
    live: false,
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.12)',
  },
  {
    id: 'quizzes',
    emoji: '📝',
    title: 'Quizzes & MCQs',
    description: 'Test your knowledge with topic-wise MCQs modelled on nursing entrance and board exam patterns.',
    href: null,
    live: false,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.12)',
  },
  {
    id: 'cases',
    emoji: '🩺',
    title: 'Clinical Case Studies',
    description: 'Work through real-world patient cases — history, examination, diagnosis, and nursing management.',
    href: null,
    live: false,
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.12)',
  },
];

export default function LearnHubPage() {
  // Unlock scroll — landing page locks it and it bleeds in on navigation
  useEffect(() => {
    unlockScroll();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080814',
      paddingTop: '80px',
      paddingBottom: '60px',
    }}>

      {/* Background glows */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(79,195,247,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(167,139,250,0.05) 0%, transparent 55%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 style={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 700,
            fontSize: 'clamp(24px, 5vw, 36px)',
            color: '#ffffff',
            margin: '0 0 12px 0',
            letterSpacing: '-0.01em',
          }}>
            What do you want to explore?
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.45)',
            margin: 0,
          }}>
            Interactive medical education built for nursing and healthcare students
          </p>
        </div>

        {/* Category grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {CATEGORIES.map((cat) => {
            const card = (
              <div
                key={cat.id}
                style={{
                  background: cat.live
                    ? `radial-gradient(ellipse at top left, ${cat.glow}, rgba(255,255,255,0.03))`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${cat.live ? cat.color + '30' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '16px',
                  padding: '28px 24px',
                  position: 'relative',
                  opacity: cat.live ? 1 : 0.55,
                  cursor: cat.live ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (cat.live) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${cat.glow}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Coming soon badge */}
                {!cat.live && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    Coming Soon
                  </div>
                )}

                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{cat.emoji}</div>

                <h2 style={{
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  fontSize: '17px',
                  color: cat.live ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  margin: '0 0 10px 0',
                  lineHeight: 1.3,
                }}>
                  {cat.title}
                </h2>

                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.4)',
                  margin: '0 0 20px 0',
                  lineHeight: 1.6,
                }}>
                  {cat.description}
                </p>

                {cat.live && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: cat.color,
                  }}>
                    Explore now
                    <span style={{ fontSize: '16px' }}>→</span>
                  </div>
                )}
              </div>
            );

            return cat.live ? (
              <Link key={cat.id} href={cat.href} style={{ textDecoration: 'none' }}>
                {card}
              </Link>
            ) : (
              <div key={cat.id}>{card}</div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          marginTop: '48px',
        }}>
          More content types coming as the ecosystem grows
        </p>
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Hub page replacing direct /models link from landing
// REASON: Need a future-proof entry point for all content types —
//   not just 3D models. New types (lectures, quizzes) slot in as cards.
// --- END CHANGE LOG ---
