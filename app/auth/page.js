// ============================================================
// FILE: app/auth/page.js
// PURPOSE: Sign in page for Learn World — email magic link + Google OAuth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Shared Supabase project — one account works across
//   therealmedico.store, community.therealmedico.store, learn.therealmedico.store
// DEPENDENCIES: lib/supabase.js
// ⚠️ DO NOT CHANGE:
//   - Must be 'use client' — Supabase auth is browser-only
//   - redirectTo must point to /auth/callback on this domain
//   - Magic link: show confirmation, do not redirect — user clicks the link in email
//   - Google OAuth: Supabase handles the redirect automatically via callback route
// ============================================================

'use client';

import { useState } from 'react';
import supabase from '../../lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailSignIn(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + '/auth/callback' },
    });
    setLoading(false);
    if (err) { setError(err.message); } else { setSent(true); }
  }

  async function handleGoogleSignIn() {
    setError('');
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    if (err) setError(err.message);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 30%, rgba(79,195,247,0.07) 0%, transparent 60%)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '40px 28px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '18px', color: '#ffffff', marginBottom: '6px' }}>
            The Real Medico <span style={{ color: '#4fc3f7' }}>Learn</span>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Sign in to track your progress
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>📬</div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>Check your inbox</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>We sent a sign-in link to {email}</p>
          </div>
        ) : (
          <>
            <button onClick={handleGoogleSignIn} style={{ width: '100%', padding: '11px', background: '#ffffff', color: '#111', border: 'none', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg width="16" height="16" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <form onSubmit={handleEmailSignIn}>
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }} />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: '#4fc3f7', color: '#050510', border: 'none', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : 'Send Sign-in Link'}
              </button>
            </form>

            {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#f87171', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
          </>
        )}

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '24px', marginBottom: 0 }}>
          One account across the entire Real Medico ecosystem
        </p>
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Auth page for Learn World
// REASON: Shared Supabase project — same login works on store, community, learn
// --- END CHANGE LOG ---
