// ============================================================
// FILE: app/auth/callback/route.js
// PURPOSE: Handles OAuth and magic link redirect after Supabase auth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Google OAuth and email magic links redirect here.
//   Exchanges the code for a session then sends user to /learn.
// DEPENDENCIES: @supabase/supabase-js, next/server
// ⚠️ DO NOT CHANGE:
//   - On success redirects to /learn not / — landing page is immersive, not a destination
//   - On error redirects to /auth?error=1 so user can try again
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin + '/learn');
    }
  }

  return NextResponse.redirect(origin + '/auth?error=1');
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: OAuth + magic link callback
// REASON: Required for Google OAuth and email magic link auth flows
// --- END CHANGE LOG ---
