// ============================================================
// FILE: components/UpgradeGate.jsx
// PURPOSE: Reusable membership upgrade card — shown in quiz results for non-members
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Replaces plain store link in SkeletonQuiz + DnaQuiz with a proper upsell card
// DEPENDENCIES: store/authStore.js (user display name)
// DO NOT CHANGE: Never render this conditionally with blur — parent must use {!isMember && <UpgradeGate />}
// ============================================================

'use client';

import useAuthStore from '../store/authStore';

const TEAL = '#4fc3f7';
const GOLD = '#fbbf24';

const BENEFITS = [
  {
    icon: '📊',
    title: 'Per-structure breakdown',
    desc: 'See exactly which structures you got right, wrong, or skipped — every quiz.',
  },
  {
    icon: '🎯',
    title: 'Weak area detection',
    desc: 'Automatically flags regions where your score drops below 60%.',
  },
  {
    icon: '⏱️',
    title: 'Time tracking',
    desc: 'See how long you spent on each structure — spot hesitation patterns.',
  },
  {
    icon: '🔓',
    title: 'All future premium content',
    desc: 'Lectures, clinical cases, and advanced quizzes as they launch.',
  },
];

export default function UpgradeGate() {
  const user = useAuthStore(state => state.user);

  return (
    <div style={{
      background: '#0a1628',
      borderRadius: '14px',
      border: `1px solid ${GOLD}44`,
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0f2040 0%, #1a1a2e 100%)`,
        padding: '20px 20px 16px',
        borderBottom: `1px solid ${GOLD}33`,
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 700, color: GOLD,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Real Medico+
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
          Unlock your full analysis
        </div>
        {user && (
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
            You are signed in — one tap to upgrade.
          </div>
        )}
        {!user && (
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
            Sign in first, then upgrade to see your detailed results.
          </div>
        )}
      </div>

      {/* Benefits list */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {BENEFITS.map(b => (
          <div key={b.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{b.icon}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{b.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a
          href="https://therealmedico.store/account"
          style={{
            display: 'block', textAlign: 'center',
            padding: '13px', borderRadius: '10px',
            background: GOLD, color: '#020817',
            fontWeight: 700, fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Upgrade to Real Medico+
        </a>
        {!user && (
          <a
            href="/auth"
            style={{
              display: 'block', textAlign: 'center',
              padding: '11px', borderRadius: '10px',
              background: 'transparent', color: TEAL,
              fontWeight: 600, fontSize: '13px',
              textDecoration: 'none',
              border: `1px solid ${TEAL}66`,
            }}
          >
            Sign in first
          </a>
        )}
      </div>
    </div>
  );
}

// — CHANGE LOG —
// [May 18, 2026] CREATED: Reusable upgrade gate card for quiz results
// REASON: Replaces plain store link in SkeletonQuiz + DnaQuiz.
//         Shows benefits, detects sign-in state, gold styling for Real Medico+.
// — END CHANGE LOG —
