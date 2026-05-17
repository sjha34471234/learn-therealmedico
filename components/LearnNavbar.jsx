// ============================================================
// FILE: components/LearnNavbar.jsx
// PURPOSE: Top navigation bar for all Learn World pages
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Learn World had no navbar at all — no way to navigate
//   between pages or sign in.
// DEPENDENCIES: store/authStore.js, next/link
// ⚠️ DO NOT CHANGE:
//   - Must be 'use client' — reads auth state from Zustand
//   - Sign In links to /auth — never opens a modal (crashes iPad)
//   - Sign Out calls authStore.signOut() which does window.location.href = '/'
//   - Logo links to / (landing page) not /learn
// ============================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '../store/authStore';

export default function LearnNavbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuthStore();

  // Hide navbar on landing page — landing is fullscreen immersive
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
      background: 'rgba(8, 8, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* Logo */}
      <Link href="/" style={{
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '15px',
        color: '#ffffff',
        textDecoration: 'none',
        letterSpacing: '0.01em',
      }}>
        The Real Medico <span style={{ color: '#4fc3f7', fontWeight: 400, fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Learn</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/learn" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: pathname.startsWith('/learn') ? '#4fc3f7' : 'rgba(255,255,255,0.65)',
          textDecoration: 'none',
          fontWeight: pathname.startsWith('/learn') ? 600 : 400,
          transition: 'color 0.2s',
        }}>
          Explore
        </Link>

        <Link href="/models" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: pathname.startsWith('/models') ? '#4fc3f7' : 'rgba(255,255,255,0.65)',
          textDecoration: 'none',
          fontWeight: pathname.startsWith('/models') ? 600 : 400,
          transition: 'color 0.2s',
        }}>
          3D Models
        </Link>

        <a href="https://therealmedico.store" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.45)',
          textDecoration: 'none',
        }}>
          Store ↗
        </a>

        {/* Auth button */}
        {!loading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
              }}>
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: '#080814',
              background: '#4fc3f7',
              borderRadius: '6px',
              padding: '6px 14px',
              textDecoration: 'none',
              fontWeight: 600,
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
// REASON: No navigation existed — users had no way to move between pages
//   or sign in after landing
// --- END CHANGE LOG ---
