// ============================================================
// FILE: app/page.js
// PURPOSE: Learn World landing page — DNA hero
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: First page visitors see at learn.therealmedico.store
// ⚠️ DO NOT CHANGE: DnaScene must stay dynamically imported (ssr:false)
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const DnaScene = dynamic(() => import('../components/DnaScene'), { ssr: false });

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
  // Lock scroll on landing page only
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  const onScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    // Restore scroll when leaving this page
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.removeEventListener('scroll', onScroll);
  };
}, []);


  return (
    <main style={{ background: '#020817', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Space glows */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,202,255,0.13) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 30% at 20% 60%, rgba(6,214,160,0.07) 0%, transparent 60%)
        `,
      }} />

      {/* Stars */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(1.5px 1.5px at 15% 20%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(2px 2px at 65% 35%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1.5px 1.5px at 25% 75%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(2px 2px at 10% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 55% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1.5px 1.5px at 70% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 35% 45%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 50% 55%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(2px 2px at 5% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 95% 40%, rgba(255,255,255,0.4) 0%, transparent 100%)
        `,
      }} />

      {/* DNA Canvas — pointer events only on canvas itself */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
          <DnaScene scrollY={scrollY} />
        </div>
      </div>

      {/* Click anywhere overlay — sits above background, below DNA */}
      <div
        onClick={() => router.push('/models')}
        style={{
          position: 'fixed', inset: 0, zIndex: 2,
          cursor: 'pointer', pointerEvents: 'auto',
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '36px',
        }}
      >
        {/* Bottom text block */}
        <div style={{
          textAlign: 'center',
          padding: '0 24px 0',
          pointerEvents: 'none',
          width: '100%',
          background: 'linear-gradient(to top, rgba(2,8,23,0.95) 0%, rgba(2,8,23,0.6) 60%, transparent 100%)',
          paddingTop: '80px',
          paddingBottom: '40px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#63caff',
            marginBottom: '10px',
          }}>
            The Real Medico Interactive
          </p>

          <h1 style={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 900,
            fontSize: 'clamp(36px, 7vw, 64px)',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '28px',
            textShadow: '0 0 40px rgba(99,202,255,0.3)',
          }}>
            Learn
          </h1>

          {/* Pulsing CTA */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            borderRadius: '100px',
            border: '1px solid rgba(99,202,255,0.5)',
            background: 'rgba(99,202,255,0.08)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            boxShadow: '0 0 24px rgba(99,202,255,0.2), inset 0 0 20px rgba(99,202,255,0.05)',
            animation: 'pulse-glow 2.5s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '18px' }}>✦</span>
            Click anywhere to explore
            <span style={{ fontSize: '18px' }}>✦</span>
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(99,202,255,0.2), inset 0 0 20px rgba(99,202,255,0.05); opacity: 1; }
          50% { box-shadow: 0 0 40px rgba(99,202,255,0.45), inset 0 0 30px rgba(99,202,255,0.12); opacity: 0.85; }
        }
      `}</style>

    </main>
  );
}
