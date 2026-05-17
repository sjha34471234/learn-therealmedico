// ============================================================
// FILE: app/auth/callback/page.js
// PURPOSE: Client-side OAuth callback — reads hash tokens, redirects to /learn
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Supabase uses implicit flow — tokens arrive in URL hash (#access_token=...)
//   The browser client detects this automatically via onAuthStateChange.
//   A server route.js cannot read URL hashes (they never reach the server).
// DEPENDENCIES: lib/supabase.js
// DO NOT CHANGE:
//   - Must be 'use client' — hash is browser-only
//   - Must use onAuthStateChange to detect session, not manual token parsing
// ============================================================

'use client';

import { useEffect } from 'react';
import supabase from '../../../lib/supabase';

export default function AuthCallbackPage() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        window.location.href = '/learn';
      }
    });

    // Timeout fallback — if no session detected in 5 seconds, go to /auth
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      window.location.href = '/auth?error=1';
    }, 5000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Signing you in...
      </p>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] REPLACED route.js with page.js
// REASON: Supabase implicit flow sends tokens in URL hash — server routes
//   never see the hash. Client page lets browser client detect session automatically.
// --- END CHANGE LOG ---
