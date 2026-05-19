// ============================================================
// FILE: app/mcq/3d/skeleton/page.js
// PURPOSE: Quiz-only page for the male skeleton — canvas + SkeletonQuiz panel only
// LAST CHANGED: May 19, 2026
// WHY IT EXISTS: Routed from /mcq/3d — dedicated quiz flow, no study content here
// DEPENDENCIES: SkeletonScene.jsx, SkeletonQuiz.jsx, lib/scrollUtils.js
// DO NOT CHANGE:
//   - SkeletonScene must stay inside dynamic() with ssr:false
//   - activeBone state lives HERE — passed as props to SkeletonScene
//   - Quiz starts immediately (no openQuiz button) — user came here specifically to quiz
//   - "Study Full Page" button links to /models/skeleton for full study content
//   - Split-screen: canvas left (desktop), canvas top (mobile)
// ============================================================

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { unlockScroll } from '../../../../lib/scrollUtils';
import SkeletonQuiz from '../../../../components/SkeletonQuiz';

const SkeletonScene = dynamic(() => import('../../../../components/SkeletonScene'), {
  ssr: false,
  loading: () => (
    <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: '120px', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
      Loading skeleton...
    </div>
  ),
});

const TEAL = '#4fc3f7';

export default function SkeletonMcqPage() {
  const [activeBone, setActiveBone] = useState(null);
  const [focusBone, setFocusBone] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    unlockScroll();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function handleClose() {
    // On this page, "Exit" goes back to the model picker
    window.location.href = '/mcq/3d';
  }

  return (
    <div style={{
      background: '#050510',
      height: '100vh',
      overflow: 'hidden',
      paddingTop: '84px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Canvas side ── */}
      <div style={{
        flex: isMobile ? 'none' : '1',
        height: isMobile ? '42vh' : 'calc(100vh - 84px)',
        position: 'relative',
        borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
        borderBottom: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}>

        {/* QUIZ MODE badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
          background: 'rgba(5,5,16,0.75)',
          border: '1px solid rgba(79,195,247,0.3)',
          borderRadius: '20px', padding: '4px 12px',
          fontFamily: 'Inter, sans-serif', fontSize: '11px',
          color: TEAL, fontWeight: 600, letterSpacing: '0.05em',
          pointerEvents: 'none',
        }}>
          QUIZ MODE
        </div>

        {/* Study Full Page button — top right of canvas */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 10,
        }}>
          <Link href="/models/skeleton" style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(5,5,16,0.75)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px', padding: '4px 12px',
            fontFamily: 'Inter, sans-serif', fontSize: '11px',
            color: 'rgba(255,255,255,0.5)', fontWeight: 500,
            textDecoration: 'none',
            transition: 'color 0.2s, border-color 0.2s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            📖 Study Full Page
          </Link>
        </div>

        <SkeletonScene
          activeBone={activeBone}
          setActiveBone={setActiveBone}
          quizMode={true}
          focusBone={focusBone}
        />
      </div>

      {/* ── Quiz panel side ── */}
      <div style={{
        flex: isMobile ? 'none' : '0 0 360px',
        height: isMobile ? '58vh' : 'calc(100vh - 84px)',
        background: 'rgba(255,255,255,0.02)',
        overflowY: 'auto',
      }}>
        <SkeletonQuiz
          setActiveBone={setActiveBone}
          onClose={handleClose}
          onBoneChange={(boneKey) => {
            setActiveBone(boneKey);
            setFocusBone(boneKey);
          }}
        />
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 19, 2026] CREATED: Quiz-only skeleton page routed from /mcq/3d
// REASON: Dedicated quiz flow — no study content, just canvas + quiz panel.
//         "Study Full Page" button links to /models/skeleton for full content.
//         Exit button navigates back to /mcq/3d model picker.
// --- END CHANGE LOG ---
