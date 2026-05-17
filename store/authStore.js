// ============================================================
// FILE: store/authStore.js
// PURPOSE: Global auth state — user session, sign out
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Components need to know if a user is logged in without
//   each one independently calling Supabase (causes race conditions and flicker).
// DEPENDENCIES: lib/supabase.js, zustand
// ⚠️ DO NOT CHANGE:
//   - Always onAuthStateChange — never getUser() or getSession() on mount
//   - Single supabase instance from lib/supabase.js — never create a new one here
//   - signOut uses window.location.href not router.push — ensures full state clear
// ============================================================

import { create } from 'zustand';
import supabase from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  accessToken: null,

  initAuth: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          set({ user: session.user, accessToken: session.access_token, loading: false });
        } else {
          set({ user: null, accessToken: null, loading: false });
        }
      }
    );
    return () => subscription.unsubscribe();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, accessToken: null });
    window.location.href = '/';
  },
}));

export default useAuthStore;

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Auth state for Learn World
// REASON: Shared Supabase project — same credentials work across ecosystem
// --- END CHANGE LOG ---
