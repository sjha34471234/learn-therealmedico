// ============================================================
// FILE: app/layout.js
// PURPOSE: Root layout for the entire Learn World site
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Required by Next.js App Router as the root wrapper
// ⚠️ DO NOT CHANGE: Keep 'use client' out of this file
// ============================================================

export const metadata = {
  title: 'The Real Medico - Learn',
  description: 'Interactive 3D Medical Education Hub',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
