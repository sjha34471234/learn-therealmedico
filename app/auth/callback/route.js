// ============================================================
// FILE: app/auth/callback/route.js
// PURPOSE: Handles OAuth redirect after Supabase auth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Google OAuth redirects here after authentication.
//   Exchanges the code for a session then sends user to /learn.
//   Uses @supabase/ssr createServerClient so PKCE verifier cookie
//   is accessible during code exchange — fixes the 307 loop.
// DEPENDENCIES: @supabase/ssr, next/server
// DO NOT CHANGE:
//   - On success redirects to /learn
//   - On error redirects to /auth?error=1
//   - Must use createServerClient (NOT createClient from supabase-js)
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(origin + '/auth?error=1');
  }

  const response = NextResponse.redirect(origin + '/learn');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('OAuth callback error:', error.message);
    return NextResponse.redirect(origin + '/auth?error=1');
  }

  return response;

}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Initial version using createClient — PKCE broken
// REASON: Browser client cannot read PKCE verifier cookie in server route
// [May 17, 2026] FIXED: Switched to createServerClient from @supabase/ssr
// REASON: Server client reads cookies from request, sets them on response
//   — this gives exchangeCodeForSession access to the PKCE verifier cookie
// --- END CHANGE LOG ---
