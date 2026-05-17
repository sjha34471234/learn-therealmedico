// ============================================================
// FILE: components/AuthProvider.jsx
// PURPOSE: Starts the Supabase auth listener once at app root level
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: onAuthStateChange must run once globally.
//   Individual components reading auth state use useAuthStore — never start their own listener.
// DEPENDENCIES: store/authStore.js
// ⚠️ DO NOT CHANGE:
//   - Must be 'use client' — Supabase auth is browser-only
//   - Returns children directly — renders nothing of its own
//   - Must wrap all content in layout.js
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
// [May 17, 2026] CREATED: Root auth initialisation
// REASON: One listener, no conflicts across components
// --- END CHANGE LOG ---
