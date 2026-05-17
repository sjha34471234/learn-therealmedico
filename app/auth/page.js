// ============================================================
// FILE: app/auth/page.js
// PURPOSE: Sign in / register page — email+password and Google OAuth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Shared Supabase auth across the Real Medico ecosystem
// DEPENDENCIES: lib/supabase.js
// ⚠️ DO NOT CHANGE:
//   - Must be 'use client' — Supabase auth is browser-only
//   - Google OAuth redirectTo must be hardcoded full URL — window.location.origin was not matching Supabase allow list
//   - After email sign in success, redirect via window.location.href not router.push
// ============================================================

'use client';

import { useState } from 'react';
import supabase from '../../lib/supabase';

export default function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (err) { setError(err.message); return; }
      window.location.href = '/learn';
    } else {
      const { error: err } = await supabase.auth.signUp({ email: email.trim(), password });
      setLoading(false);
      if (err) { setError(err.message); return; }
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setMode('signin');
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://learn.therealmedico.store/auth/callback',
      },
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
            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '3px', marginBottom: '20px' }}>
          {['signin', 'register'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} style={{ flex: 1, padding: '7px', border: 'none', borderRadius: '6px', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: mode === m ? 'rgba(79,195,247,0.15)' : 'transparent', color: mode === m ? '#4fc3f7' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
              {m === 'signin' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <button onClick={handleGoogleSignIn} style={{ width: '100%', padding: '11px', background: '#ffffff', color: '#111', border: 'none', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: '#4fc3f7', color: '#050510', border: 'none', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#f87171', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#34d399', marginTop: '10px', textAlign: 'center' }}>{success}</p>}

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '24px', marginBottom: 0 }}>
          One account across the entire Real Medico ecosystem
        </p>
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CHANGED: Replaced magic link with email+password sign in and register
// [May 17, 2026] FIXED: Google OAuth redirectTo hardcoded to full URL
// REASON: window.location.origin was not matching Supabase allowed redirect list exactly
// --- END CHANGE LOG ---
