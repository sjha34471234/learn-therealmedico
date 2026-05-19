// ============================================================
// FILE: app/learn/page.js
// PURPOSE: Hub page — user chooses what type of content to explore
// LAST CHANGED: May 19, 2026
// WHY IT EXISTS: Future-proof entry point — new content types slot in as CATEGORIES entries
// DEPENDENCIES: lib/scrollUtils.js, next/link
// DO NOT CHANGE:
//   - Must unlock scroll on mount — landing page locks it
//   - Coming soon cards must NOT be wrapped in Link
//   - To add a new content type: add object to CATEGORIES, set live: true when ready
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
    glow: 'rgba(79,195,247,0.14)',
  },
  {
    id: 'quizzes',
    emoji: '📝',
    title: 'Quizzes & MCQs',
    description: 'Test your knowledge with topic-wise MCQs. Choose a model, pick your mode, and get instant feedback with detailed analysis.',
    href: '/mcq',
    live: true,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.12)',
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
    id: 'cases',
    emoji: '🩺',
    title: 'Clinical Case Studies',
    description: 'Work through real patient cases — history, examination, diagnosis, and nursing management.',
    href: null,
    live: false,
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.12)',
  },
];

export default function LearnHubPage() {
  useEffect(() => {
    unlockScroll();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050510', paddingTop: '84px', paddingBottom: '64px' }}>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(79,195,247,0.05) 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(167,139,250,0.04) 0%, transparent 55%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h1 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: 'clamp(22px, 5vw, 34px)', color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
            What do you want to explore?
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Interactive medical education for nursing and healthcare students
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
          {CATEGORIES.map((cat) => {
            const card = (
              <div
                key={cat.id}
                style={{
                  background: cat.live ? 'radial-gradient(ellipse at top left, ' + cat.glow + ', rgba(255,255,255,0.025))' : 'rgba(255,255,255,0.018)',
                  border: '1px solid ' + (cat.live ? cat.color + '28' : 'rgba(255,255,255,0.06)'),
                  borderRadius: '14px',
                  padding: '26px 22px',
                  position: 'relative',
                  opacity: cat.live ? 1 : 0.5,
                  cursor: cat.live ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  if (!cat.live) return;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 36px ' + cat.glow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {!cat.live && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Coming Soon
                  </div>
                )}

                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{cat.emoji}</div>

                <h2 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '16px', color: cat.live ? '#ffffff' : 'rgba(255,255,255,0.5)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {cat.title}
                </h2>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.38)', margin: '0 0 18px 0', lineHeight: 1.6 }}>
                  {cat.description}
                </p>

                {cat.live && (
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: cat.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Explore now <span>→</span>
                  </div>
                )}
              </div>
            );

            return cat.live ? (
              <Link key={cat.id} href={cat.href} style={{ textDecoration: 'none', display: 'block' }}>
                {card}
              </Link>
            ) : (
              <div key={cat.id}>{card}</div>
            );
          })}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: '44px' }}>
          More content types coming as the ecosystem grows
        </p>
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Hub page replacing direct /models link from landing
// REASON: Future-proof entry point — new content types slot in as CATEGORIES entries
// [May 17, 2026] CHANGED: paddingTop 80px -> 84px
// REASON: Navbar rebuilt as two-row layout — total height is now 84px
// [May 19, 2026] CHANGED: Quizzes & MCQs card set to live: true, href: '/mcq'
// REASON: MCQ quiz hub now exists at /mcq
// --- END CHANGE LOG ---
