// ============================================================
// FILE: lib/scrollUtils.js
// PURPOSE: Shared scroll lock and unlock used across all pages
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: All three pages (landing, /models, /models/skeleton) had
//   identical copy-pasted useEffect scroll logic. One change here fixes all.
// DEPENDENCIES: None — pure DOM utilities
// ⚠️ DO NOT CHANGE: Always unlock BOTH body AND documentElement.
//   Unlocking only body leaves scroll frozen on iOS Safari and on hard refresh.
// ============================================================

export function lockScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Extracted from app/page.js, app/models/page.js,
//   app/models/skeleton/page.js — all three had identical inline useEffect code
// REASON: Single source of truth. Fix scroll once, fixed everywhere.
// --- END CHANGE LOG ---
