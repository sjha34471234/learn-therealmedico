// ============================================================
// FILE: app/layout.js
// PURPOSE: Root layout — applies global styles and fonts
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Wraps every page on learn.therealmedico.store
// ⚠️ DO NOT CHANGE: style on html/body — removes white border and scroll
// ============================================================

import "./globals.css";

export const metadata = {
  title: 'The Real Medico - Learn',
  description: 'Interactive 3D medical education',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#020817' }}>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#020817' }}>
        {children}
      </body>
    </html>
  );
}
