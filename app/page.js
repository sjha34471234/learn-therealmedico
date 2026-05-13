// ============================================================
// FILE: app/page.js
// PURPOSE: Learn World landing page — DNA hero scene
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: First page visitors see at learn.therealmedico.store
// ⚠️ DO NOT CHANGE: DnaScene must stay dynamically imported (ssr:false)
// ============================================================

'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Load 3D scene only in browser — never on server
const DnaScene = dynamic(() => import('../components/DnaScene'), { ssr: false });

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#020817] overflow-x-hidden">

      {/* Subtle radial glow behind the DNA */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,202,255,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen">

        {/* 3D DNA canvas */}
        <div className="w-full h-screen absolute inset-0">
          <DnaScene scrollY={scrollY} />
        </div>

        {/* Text overlay */}
        <div className="relative z-10 text-center px-6 mt-auto mb-16 pointer-events-none">
          <p className="text-xs uppercase tracking-[0.3em] text-[#63caff] mb-3 font-sans font-medium">
            The Real Medico
          </p>
          <h1 className="font-serif font-black text-white text-4xl md:text-6xl leading-tight mb-4">
            {/* Replace this with your headline later */}
            Your headline here
          </h1>
          <p className="font-sans text-[#94a3b8] text-base md:text-lg max-w-md mx-auto">
            Hover over the DNA to explore its building blocks.
          </p>
        </div>

      </section>

    </main>
  );
}
