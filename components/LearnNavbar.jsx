// ============================================================
// FILE: components/LearnNavbar.jsx
// PURPOSE: Top navigation bar for all Learn World pages
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Learn World had no navbar at all — no way to navigate
//   between pages or access auth.
// DEPENDENCIES: store/authStore.js, next/link, next/navigation
// DO NOT CHANGE:
//   - Returns null on pathname '/' — landing page is fullscreen immersive, no nav
//   - Sign In links to /auth — never a modal
//   - Sign Out calls authStore.signOut() which does window.location.href = '/'
//   - Store link uses <a> not <Link> — cross-domain
//   - Two-row layout on mobile — single row on desktop (768px breakpoint)
// ============================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

export default function LearnNavbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (pathname === '/') return null;

  const linkStyle = (active) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: isMobile ? '12px' : '13px',
    color: active ? '#4fc3f7' : 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
    fontWeight: active ? 600 : 400,
    whiteSpace: 'nowrap',
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(5, 5, 16, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      boxSizing: 'border-box',
    }}>

      {/* ── Row 1: Logo + Auth ── */}
      <div style={{
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: isMobile ? '13px' : '14px', color: '#ffffff', whiteSpace: 'nowrap' }}>
            The Real Medico
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11px', color: '#4fc3f7', letterSpacing: '0.06em' }}>
            LEARN
          </span>
        </Link>

        {!loading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.6)', maxWidth: isMobile ? '80px' : '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email.split('@')[0]}
              </span>
              <button onClick={signOut} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.45)',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#050510',
              background: '#4fc3f7',
              borderRadius: '6px',
              padding: '5px 14px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Sign In
            </Link>
          )
        )}
      </div>

      {/* ── Row 2: Nav Links — always visible ── */}
      <div style={{
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '20px' : '28px',
        padding: '0 16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>

        <Link href="/learn" style={linkStyle(pathname === '/learn')}>
          Explore
        </Link>

        <Link href="/models" style={linkStyle(pathname.startsWith('/models'))}>
          3D Models
        </Link>

        <a href="https://therealmedico.store" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '12px' : '13px',
          color: 'rgba(255,255,255,0.35)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          Store ↗
        </a>

      </div>

    </nav>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: First navbar for Learn World
// REASON: No navigation existed on any page
// [May 17, 2026] RESTYLED: Two-row layout for mobile responsiveness
// REASON: Single row was cramping all items together on small screens —
//   logo and links were merging. Row 1 = logo + auth, Row 2 = nav links.
// --- END CHANGE LOG ---
