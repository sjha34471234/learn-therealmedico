// ============================================================
// FILE: app/mcq/3d/page.js
// PURPOSE: 3D Interactive Quiz model picker — choose DNA, Skeleton, etc.
// LAST CHANGED: May 19, 2026
// WHY IT EXISTS: Routed from /mcq — lists all 3D models that have quiz support
// DEPENDENCIES: lib/scrollUtils.js, next/link
// DO NOT CHANGE:
//   - Must unlock scroll on mount
//   - To add a new 3D model quiz: add entry to MODELS array, set live: true, href: '/mcq/3d/[slug]'
// ============================================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { unlockScroll } from '../../../lib/scrollUtils';

const MODELS = [
  {
    id: 'skeleton',
    emoji: '🦴',
    title: 'Male Skeleton',
    subtitle: 'Musculoskeletal',
    description: 'Identify bones highlighted live in the 3D skeleton. 26 bones across 5 regions — from the skull to the foot.',
    href: '/mcq/3d/skeleton',
    live: true,
    color: '#4fc3f7',
    glow: 'rgba(79,195,247,0.14)',
    stats: ['26 bones', '5 regions', 'Type It + MCQ'],
  },
  {
    id: 'dna',
    emoji: '🧬',
    title: 'DNA Double Helix',
    subtitle: 'Molecular Biology',
    description: 'Name the DNA components highlighted in the 3D helix — bases, sugars, phosphate groups and more.',
    href: '/mcq/3d/dna',
    live: true,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.13)',
    stats: ['6 structures', 'Molecular', 'Type It + MCQ'],
  },
  {
    id: 'heart',
    emoji: '❤️',
    title: 'Heart',
    subtitle: 'Cardiovascular',
    description: 'Chambers, valves, vessels — explore cardiac anatomy with interactive labels and active recall quizzes.',
    href: null,
    live: false,
    color: '#f87171',
    glow: 'rgba(248,113,113,0.12)',
    stats: null,
  },
  {
    id: 'neuron',
    emoji: '⚡',
    title: 'Neuron',
    subtitle: 'Neurological',
    description: 'Axon, dendrites, myelin sheath — learn the structure of the nerve cell in 3D.',
    href: null,
    live: false,
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.12)',
    stats: null,
  },
];

export default function ThreeDModelPickerPage() {
  useEffect(() => {
    unlockScroll();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050510', paddingTop: '84px', paddingBottom: '64px' }}>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(79,195,247,0.05) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(52,211,153,0.04) 0%, transparent 55%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
          <Link href="/learn" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Learn</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
          <Link href="/mcq" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Quizzes & MCQs</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>3D Interactive Quiz</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '44px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4fc3f7', marginBottom: '12px' }}>
            3D Interactive Quiz
          </div>
          <h1 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: 'clamp(22px, 5vw, 32px)', color: '#ffffff', margin: '0 0 10px 0', lineHeight: 1.2 }}>
            Choose a model
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6 }}>
            A structure will highlight in the 3D viewer. Name it correctly to score. Rotate and zoom freely while you think.
          </p>
        </div>

        {/* Model cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {MODELS.map((model) => {
            const card = (
              <div
                key={model.id}
                style={{
                  background: model.live
                    ? 'radial-gradient(ellipse at top left, ' + model.glow + ', rgba(255,255,255,0.022))'
                    : 'rgba(255,255,255,0.016)',
                  border: '1px solid ' + (model.live ? model.color + '30' : 'rgba(255,255,255,0.06)'),
                  borderRadius: '14px',
                  padding: '26px 22px',
                  position: 'relative',
                  opacity: model.live ? 1 : 0.42,
                  cursor: model.live ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  if (!model.live) return;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 36px ' + model.glow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {!model.live && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Coming Soon
                  </div>
                )}

                <div style={{ fontSize: '30px', marginBottom: '10px' }}>{model.emoji}</div>

                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: model.live ? model.color : 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>
                  {model.subtitle}
                </div>

                <h2 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '17px', color: model.live ? '#ffffff' : 'rgba(255,255,255,0.4)', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                  {model.title}
                </h2>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '0 0 18px 0', lineHeight: 1.6 }}>
                  {model.description}
                </p>

                {model.live && model.stats && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {model.stats.map((s) => (
                      <span key={s} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', background: model.color + '18', border: '1px solid ' + model.color + '33', color: model.color, padding: '3px 9px', borderRadius: '20px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {model.live && (
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: model.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Start Quiz <span>→</span>
                  </div>
                )}
              </div>
            );

            return model.live ? (
              <Link key={model.id} href={model.href} style={{ textDecoration: 'none', display: 'block' }}>
                {card}
              </Link>
            ) : (
              <div key={model.id}>{card}</div>
            );
          })}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginTop: '44px' }}>
          New models added as they are built
        </p>
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 19, 2026] CREATED: 3D model picker for MCQ quiz section
// REASON: Routed from /mcq — Skeleton + DNA live, Heart + Neuron coming soon
// --- END CHANGE LOG ---
