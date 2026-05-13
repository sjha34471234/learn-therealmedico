// ============================================================
// FILE: app/models/skeleton/page.js
// PURPOSE: Individual model page for the male skeleton
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Routed from /models catalogue — slug: skeleton
// ⚠️ DO NOT CHANGE: SkeletonScene must stay inside dynamic() with ssr:false
// ============================================================

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const SkeletonScene = dynamic(() => import('../../../components/SkeletonScene'), {
  ssr: false,
  loading: () => (
    <div style={{ color: '#fff', textAlign: 'center', paddingTop: '40vh', fontFamily: 'Inter, sans-serif' }}>
      Loading skeleton...
    </div>
  ),
});

export default function SkeletonPage() {
  return (
    <div style={{
      background: '#050510',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Link href="/models" style={{
          color: '#aaa',
          textDecoration: 'none',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Back to Models
        </Link>
        <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Musculoskeletal
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '24px 24px 0' }}>
        <h1 style={{
          fontFamily: 'Merriweather, serif',
          fontWeight: 900,
          fontSize: 'clamp(24px, 5vw, 42px)',
          margin: 0,
          lineHeight: 1.15,
        }}>
          Male Skeleton
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
          206 bones · Tap the glowing dots to explore
        </p>
      </div>

      {/* 3D Scene */}
      <div style={{ flex: 1, minHeight: '60vh', padding: '16px' }}>
        <SkeletonScene />
      </div>

      {/* Info panel */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
      }}>
        {[
          { label: 'Total Bones', value: '206' },
          { label: 'Heaviest Bone', value: 'Femur' },
          { label: 'Smallest Bone', value: 'Stapes (ear)' },
          { label: 'Function', value: 'Support & Protection' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '10px',
            padding: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ color: '#00ffcc', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {stat.label}
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
