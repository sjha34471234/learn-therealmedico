// ============================================================
// FILE: app/auth/callback/route.js
// PURPOSE: Handles OAuth and magic link redirect after Supabase auth
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Google OAuth and email magic links redirect here.
// DEPENDENCIES: @supabase/ssr, next/server
// ⚠️ DO NOT CHANGE:
//   - Must use createServerClient from @supabase/ssr — not the browser client
//   - On success redirects to /learn
//   - On error redirects to /auth?error=1
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) { return cookieStore.get(name)?.value; },
          set(name, value, options) { cookieStore.set({ name, value, ...options }); },
          remove(name, options) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin + '/learn');
    }
  }

  return NextResponse.redirect(origin + '/auth?error=1');
}

// --- CHANGE LOG ---
// [May 17, 2026] FIXED: Switched from browser createClient to createServerClient
// REASON: exchangeCodeForSession requires server-side cookie handling to persist
//   the session. Browser client cannot set cookies from a server route.
// --- END CHANGE LOG ---
