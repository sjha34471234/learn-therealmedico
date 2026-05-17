// ============================================================
// FILE: app/auth/callback/route.js
// PURPOSE: Handles OAuth redirect after Supabase auth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Google OAuth redirects here after authentication.
//   Exchanges the code for a session then sends user to /learn.
// DEPENDENCIES: @supabase/supabase-js, next/server
// ⚠️ DO NOT CHANGE:
//   - On success redirects to /learn
//   - On error redirects to /auth?error=1
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(origin + '/auth?error=1');
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin + '/learn');
    }
  } catch (err) {
    console.error('callback error:', err);
  }

  return NextResponse.redirect(origin + '/auth?error=1');
}

// --- CHANGE LOG ---
// [May 17, 2026] FIXED: Restored proper redirect after debug version
// REASON: Debug version was returning plain text instead of redirecting
// --- END CHANGE LOG ---
