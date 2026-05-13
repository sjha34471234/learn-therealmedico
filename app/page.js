// ============================================================
// FILE: app/page.js
// PURPOSE: Homepage of Learn World
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: The main landing page at learn.therealmedico.store
// ⚠️ DO NOT CHANGE: Keep this a server component (no 'use client')
// ============================================================

export default function Home() {
  return (
    <main style={{ 
      background: '#0a0a0a', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>The Real Medico — Learn</h1>
        <p>3D Educational Hub — Coming Soon</p>
        <a 
          href="https://therealmedico.store" 
          style={{ color: '#60a5fa' }}
        >
          ← Back to Store
        </a>
      </div>
    </main>
  )
}
