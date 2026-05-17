// ============================================================
// FILE: store/authStore.js
// PURPOSE: Global auth state — user session, profile, is_member, sign out
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Components need to know if a user is logged in and whether they
//   are a Real Medico+ member without each one independently calling Supabase.
// DEPENDENCIES: lib/supabase.js, zustand
// DO NOT CHANGE:
//   - Always onAuthStateChange — never getUser() or getSession() on mount
//   - Single supabase instance from lib/supabase.js — never create a new one here
//   - signOut uses window.location.href not router.push — ensures full state clear
//   - is_member is read from the profiles table — same Supabase project as main store
// ============================================================

import { create } from 'zustand';
import supabase from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  accessToken: null,

  initAuth: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          set({ user: session.user, accessToken: session.access_token, loading: false });

          // Fetch profile to get is_member — same profiles table as main store
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, is_member')
            .eq('id', session.user.id)
            .single();

          set({ profile: profile || null });
        } else {
          set({ user: null, profile: null, accessToken: null, loading: false });
        }
      }
    );
    return () => subscription.unsubscribe();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, accessToken: null });
    window.location.href = '/';
  },
}));

export default useAuthStore;

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Auth state for Learn World
// REASON: Shared Supabase project — same credentials work across ecosystem
// [May 17, 2026] CHANGED: Added profile fetch + is_member to auth state
// REASON: Quiz and future features need is_member. Reads from shared profiles table.
// --- END CHANGE LOG ---
