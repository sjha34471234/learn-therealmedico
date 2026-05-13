// ============================================================
// FILE: tailwind.config.js
// PURPOSE: Tailwind config — includes custom font families
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Tells Tailwind which files to scan + custom fonts
// ⚠️ DO NOT CHANGE: content paths or fontFamily keys
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};
