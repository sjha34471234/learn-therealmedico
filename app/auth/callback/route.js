// ============================================================
// FILE: app/auth/callback/route.js
// PURPOSE: Handles OAuth and magic link redirect after Supabase auth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Google OAuth and email magic links redirect here.
// DEPENDENCIES: @supabase/supabase-js, next/server
// ⚠️ DO NOT CHANGE:
//   - Uses basic createClient — @supabase/ssr cookies() was failing in Next.js 14
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
    console.error('exchangeCodeForSession error:', error.message);
  } catch (err) {
    console.error('callback route error:', err);
  }

  return NextResponse.redirect(origin + '/auth?error=1');
}

// --- CHANGE LOG ---
// [May 17, 2026] FIXED: Reverted to basic createClient
// REASON: @supabase/ssr cookies() was failing silently in Next.js 14 route handlers
//   causing exchangeCodeForSession to error and fall back to Supabase Site URL
// --- END CHANGE LOG ---
