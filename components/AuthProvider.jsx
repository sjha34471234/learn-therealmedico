// ============================================================
// FILE: components/AuthProvider.jsx
// PURPOSE: Initialises Supabase auth listener once for the entire app
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: onAuthStateChange must be started once at root level.
//   Putting it in individual components causes multiple listeners and conflicts.
// DEPENDENCIES: store/authStore.js
// ⚠️ DO NOT CHANGE:
//   - Must be 'use client' — Supabase auth is browser-only
//   - Must wrap all page content in layout.js
//   - Returns null — renders nothing, just runs the side effect
// ============================================================

'use client';

import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function AuthProvider({ children }) {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, []);

  return <>{children}</>;
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Wraps app in layout.js
// REASON: Central auth initialisation — one listener, no conflicts
// --- END CHANGE LOG ---
