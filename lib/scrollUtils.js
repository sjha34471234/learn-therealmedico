// ============================================================
// FILE: lib/scrollUtils.js
// PURPOSE: Shared scroll lock and unlock utilities used across all pages
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: scroll lock/unlock logic was copy-pasted into every page.js
//   causing drift and bugs. Centralised here so one fix applies everywhere.
// DEPENDENCIES: None — pure DOM utilities, no React imports
// ⚠️ DO NOT CHANGE: Always unlock BOTH document.body AND document.documentElement
//   Unlocking only one leaves scroll frozen on refresh (tested and confirmed)
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
//   app/models/skeleton/page.js — all three had identical inline useEffect logic
// REASON: DRY principle — one source of truth for scroll behaviour
// --- END CHANGE LOG ---
