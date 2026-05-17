// ============================================================
// FILE: lib/supabase.js
// PURPOSE: Single shared Supabase browser client for Learn World
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: All three subdomains (store, community, learn) share one
//   Supabase project. Same env vars = same session recognised across ecosystem.
// DEPENDENCIES: @supabase/supabase-js
// ⚠️ DO NOT CHANGE:
//   - Never add storage: window.localStorage — crashes SSR
//   - Never add a custom storageKey — breaks sessions
//   - Never call createClient() inside a component or useEffect
//   - NEXT_PUBLIC_ vars must match the main store Supabase project exactly
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
export { createClient };

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Shared auth across therealmedico.store ecosystem
// REASON: Same Supabase project = one login works on store, community, learn
// --- END CHANGE LOG ---
