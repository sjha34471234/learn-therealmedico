// ============================================================
// FILE: app/page.js
// PURPOSE: Learn World landing page — DNA hero
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: First page visitors see at learn.therealmedico.store
// ⚠️ DO NOT CHANGE: DnaScene must stay dynamically imported (ssr:false)
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DnaScene = dynamic(() => import('../components/DnaScene'), { ssr: false });

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main style={{ background: '#020817', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Space background glow */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,202,255,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 50% 30% at 20% 60%, rgba(6,214,160,0.05) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Stars */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 65% 35%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.2) 0%, transparent 100%),
          radial-gradient(1px 1px at 25% 75%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 10% 50%, rgba(255,255,255,0.2) 0%, transparent 100%),
          radial-gradient(1px 1px at 55% 85%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 100%),
          radial-gradient(1px 1px at 35% 45%, rgba(255,255,255,0.3) 0%, transparent 100%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Full screen DNA canvas */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
      }}>
        <DnaScene scrollY={scrollY} />
      </div>

      {/* Text overlay — bottom of screen */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        textAlign: 'center',
        padding: '0 24px 48px',
        background: 'linear-gradient(to top, rgba(2,8,23,0.9) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#63caff',
          marginBottom: '10px',
        }}>
          The Real Medico
        </p>
        <h1 style={{
          fontFamily: 'Merriweather, serif',
          fontWeight: 900,
          fontSize: 'clamp(28px, 6vw, 56px)',
          color: '#ffffff',
          lineHeight: 1.15,
          marginBottom: '12px',
        }}>
          Your headline here
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: '#94a3b8',
          maxWidth: '380px',
          margin: '0 auto',
        }}>
          Tap any part of the DNA to learn what it does.
        </p>
      </div>

    </main>
  );
}
