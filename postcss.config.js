// ============================================================
// FILE: postcss.config.js
// PURPOSE: PostCSS config — required for Tailwind to process CSS
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Tailwind runs as a PostCSS plugin
// ⚠️ DO NOT CHANGE: Without this, Tailwind classes won't work
// ============================================================

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
