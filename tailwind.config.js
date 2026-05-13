// ============================================================
// FILE: tailwind.config.js
// PURPOSE: Tailwind CSS configuration for Learn World
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Tells Tailwind which files to scan for class names
// ⚠️ DO NOT CHANGE: The `content` paths — removing them breaks purging
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
