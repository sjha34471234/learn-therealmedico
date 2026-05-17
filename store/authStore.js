// ============================================================
// FILE: store/authStore.js
// PURPOSE: Global auth state for Learn World — user, profile, loading
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Components need to know if a user is logged in without
//   each component independently calling Supabase (causes race conditions).
// DEPENDENCIES: lib/supabase.js, zustand
// ⚠️ DO NOT CHANGE:
//   - Always use onAuthStateChange — never getUser() or getSession() on mount
//   - fetchProfile calls /api/profile GET — never queries Supabase directly (RLS race condition)
//   - Single supabase instance from lib/supabase.js — never create a new one here
// ============================================================

import { create } from 'zustand';
import supabase from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  accessToken: null,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setAccessToken: (token) => set({ accessToken: token }),

  // [May 17, 2026] Initialise auth listener — call once in root layout
  initAuth: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          set({
            user: session.user,
            accessToken: session.access_token,
            loading: false,
          });
        } else {
          set({
            user: null,
            profile: null,
            accessToken: null,
            loading: false,
          });
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
// [May 17, 2026] CREATED: Auth integration for Learn World
// REASON: Shared Supabase project means same session works across
//   therealmedico.store ecosystem via .therealmedico.store cookie domain
// --- END CHANGE LOG ---
