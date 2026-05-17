// ============================================================
// FILE: lib/supabase.js
// PURPOSE: Single shared Supabase browser client for Learn World
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Auth needs a Supabase client. One instance shared across
//   the entire app prevents session conflicts and duplicate initialisation.
// DEPENDENCIES: @supabase/supabase-js (must be in package.json)
// ⚠️ DO NOT CHANGE:
//   - Never add storage: window.localStorage — crashes SSR
//   - Never add a custom storageKey — breaks sessions
//   - Never call createClient() inside a component or useEffect — always import this instance
//   - The NEXT_PUBLIC_ env vars must match the main store's Supabase project exactly
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
export { createClient };

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Learn World auth integration
// REASON: Shared auth across therealmedico.store ecosystem requires
//   all subdomains to use the same Supabase project
// --- END CHANGE LOG ---
