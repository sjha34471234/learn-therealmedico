// ============================================================
// FILE: app/mcq/page.js
// PURPOSE: MCQ hub — choose quiz category (3D Interactive, etc.)
// LAST CHANGED: May 19, 2026
// WHY IT EXISTS: Entry point for all quiz types — routed from /learn Quizzes card
// DEPENDENCIES: lib/scrollUtils.js, next/link
// DO NOT CHANGE:
//   - Must unlock scroll on mount
//   - Coming soon cards must NOT be wrapped in Link
//   - Add new quiz categories here as MCQ_CATEGORIES entries with live: true
// ============================================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { unlockScroll } from '../../lib/scrollUtils';

const MCQ_CATEGORIES = [
  {
    id: '3d',
    emoji: '🧬',
    title: '3D Interactive Quiz',
    description: 'Identify anatomical structures highlighted live in the 3D viewer. Bones, DNA, and more — with instant feedback.',
    href: '/mcq/3d',
    live: true,
    color: '#4fc3f7',
    glow: 'rgba(79,195,247,0.14)',
    count: '2 models available',
  },
  {
    id: 'clinical',
    emoji: '🩺',
    title: 'Clinical MCQs',
    description: 'Exam-style multiple choice questions on nursing theory, pharmacology, and clinical practice.',
    href: null,
    live: false,
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.12)',
    count: null,
  },
  {
    id: 'physiology',
    emoji: '⚡',
    title: 'Physiology MCQs',
    description: 'Systems-based questions on cardiovascular, respiratory, renal, and neurological physiology.',
    href: null,
    live: false,
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.12)',
    count: null,
  },
];

export default function McqHubPage() {
  useEffect(() => {
    unlockScroll();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050510', paddingTop: '84px', paddingBottom: '64px' }}>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(52,211,153,0.05) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(79,195,247,0.04) 0%, transparent 55%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/learn" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            ← Back to Learn
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#34d399', marginBottom: '12px' }}>
            Quizzes & MCQs
          </div>
          <h1 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: 'clamp(22px, 5vw, 32px)', color: '#ffffff', margin: '0 0 10px 0', lineHeight: 1.2 }}>
            Choose a quiz type
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6 }}>
            Active recall is the most effective study method. Pick a category and start testing yourself.
          </p>
        </div>

        {/* Category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {MCQ_CATEGORIES.map((cat) => {
            const card = (
              <div
                key={cat.id}
                style={{
                  background: cat.live
                    ? 'radial-gradient(ellipse at top left, ' + cat.glow + ', rgba(255,255,255,0.022))'
                    : 'rgba(255,255,255,0.016)',
                  border: '1px solid ' + (cat.live ? cat.color + '30' : 'rgba(255,255,255,0.06)'),
                  borderRadius: '14px',
                  padding: '26px 22px',
                  position: 'relative',
                  opacity: cat.live ? 1 : 0.45,
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
                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Coming Soon
                  </div>
                )}

                <div style={{ fontSize: '30px', marginBottom: '14px' }}>{cat.emoji}</div>

                <h2 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '16px', color: cat.live ? '#ffffff' : 'rgba(255,255,255,0.4)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {cat.title}
                </h2>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '0 0 18px 0', lineHeight: 1.6 }}>
                  {cat.description}
                </p>

                {cat.live && cat.count && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
                      {cat.count}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: cat.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Start <span>→</span>
                    </div>
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

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginTop: '44px' }}>
          New quiz types added as the ecosystem grows
        </p>
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 19, 2026] CREATED: MCQ hub page — routed from /learn Quizzes card
// REASON: New quiz section — 3D Interactive Quiz live, others coming soon
// --- END CHANGE LOG ---
