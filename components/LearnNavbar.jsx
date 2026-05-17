// ============================================================
// FILE: components/LearnNavbar.jsx
// PURPOSE: Top navigation bar for all Learn World pages
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Learn World had no navbar at all — no way to navigate
//   between pages or access auth.
// DEPENDENCIES: store/authStore.js, next/link, next/navigation
// ⚠️ DO NOT CHANGE:
//   - Returns null on pathname '/' — landing page is fullscreen immersive, no nav
//   - Sign In links to /auth — never a modal (modals crash iPad Chrome)
//   - Sign Out calls authStore.signOut() which does window.location.href = '/'
//   - Store link uses <a> not <Link> — cross-domain, Next.js Link is internal only
// ============================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '../store/authStore';

export default function LearnNavbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuthStore();

  if (pathname === '/') return null;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(5, 5, 16, 0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      boxSizing: 'border-box',
    }}>

      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
          The Real Medico
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: '#4fc3f7', letterSpacing: '0.04em' }}>
          LEARN
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        <Link href="/learn" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: pathname === '/learn' ? '#4fc3f7' : 'rgba(255,255,255,0.55)',
          textDecoration: 'none',
          fontWeight: pathname === '/learn' ? 600 : 400,
        }}>
          Explore
        </Link>

        <Link href="/models" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: pathname.startsWith('/models') ? '#4fc3f7' : 'rgba(255,255,255,0.55)',
          textDecoration: 'none',
          fontWeight: pathname.startsWith('/models') ? 600 : 400,
        }}>
          3D Models
        </Link>

        <a href="https://therealmedico.store" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.35)',
          textDecoration: 'none',
        }}>
          Store ↗
        </a>

        {!loading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                {user.email.split('@')[0]}
              </span>
              <button onClick={signOut} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.45)',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#050510',
              background: '#4fc3f7',
              borderRadius: '6px',
              padding: '6px 14px',
              textDecoration: 'none',
            }}>
              Sign In
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: First navbar for Learn World
// REASON: No navigation existed on any page
// --- END CHANGE LOG ---
