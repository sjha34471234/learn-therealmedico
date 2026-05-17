// ============================================================
// FILE: app/layout.js
// PURPOSE: Root layout — wraps all pages with navbar, auth, metadata
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Next.js App Router requires a root layout.
//   All pages inherit navbar and auth state from here.
// DEPENDENCIES: components/LearnNavbar.jsx, components/AuthProvider.jsx, app/globals.css
// ⚠️ DO NOT CHANGE:
//   - margin:0 padding:0 on html and body prevents white border (browser default margin)
//   - AuthProvider must wrap everything — starts the Supabase listener
//   - LearnNavbar hides itself on / via usePathname — safe to include unconditionally
// ============================================================

import './globals.css';
import LearnNavbar from '../components/LearnNavbar';
import AuthProvider from '../components/AuthProvider';

export const metadata = {
  title: 'The Real Medico — Learn',
  description: 'Interactive 3D medical education for nursing and healthcare students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          <LearnNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CHANGED: Added AuthProvider and LearnNavbar
// REASON: Auth integration + first navbar for Learn World
// --- END CHANGE LOG ---
