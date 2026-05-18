// ============================================================
// FILE: app/layout.js
// PURPOSE: Root layout — wraps all pages with navbar, auth, metadata
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Next.js App Router requires a root layout.
//   All pages inherit navbar and auth state from here.
// DEPENDENCIES: components/LearnNavbar.jsx, components/AuthProvider.jsx, app/globals.css
// ⚠️ DO NOT CHANGE:
//   - body height:100dvh + overflow:hidden — prevents browser chrome sliding on scroll
//   - #page-scroll-container is the ONLY thing that scrolls — body never scrolls
//   - AuthProvider must wrap everything — starts the Supabase listener
//   - LearnNavbar hides itself on / via usePathname — safe to include unconditionally
//   - Landing page (/) overrides scroll container via lockScroll() — still works
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
    <html lang="en" style={{ margin: 0, padding: 0, height: '100%' }}>
      <body style={{ margin: 0, padding: 0, height: '100dvh', overflow: 'hidden' }}>
        <AuthProvider>
          <LearnNavbar />
          <div id="page-scroll-container">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CHANGED: Added AuthProvider and LearnNavbar
// REASON: Auth integration + first navbar for Learn World
// [May 18, 2026] CHANGED: Added #page-scroll-container, body height:100dvh + overflow:hidden
// REASON: Prevents Safari browser chrome (address bar) from sliding up/down on scroll.
//         Body never scrolls — only #page-scroll-container scrolls internally.
// --- END CHANGE LOG ---
