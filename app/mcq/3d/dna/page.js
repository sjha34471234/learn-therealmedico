// ============================================================
// FILE: app/mcq/3d/dna/page.js
// PURPOSE: Quiz-only page for the DNA double helix — canvas + DnaQuiz panel only
// LAST CHANGED: May 19, 2026
// WHY IT EXISTS: Routed from /mcq/3d — dedicated quiz flow, no study content here
// DEPENDENCIES: DnaScene.jsx, DnaQuiz.jsx, lib/scrollUtils.js
// DO NOT CHANGE:
//   - DnaScene and DnaQuiz must stay inside dynamic() with ssr:false
//   - activeStructure state lives HERE — passed as props to DnaScene
//   - Quiz starts immediately — user came here specifically to quiz
//   - "Study Full Page" button links to /models/dna for full study content
//   - Split-screen: canvas left (desktop), canvas top (mobile)
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { unlockScroll } from '../../../../lib/scrollUtils';

const DnaScene = dynamic(() => import('../../../../components/DnaScene'), { ssr: false });
const DnaQuiz = dynamic(() => import('../../../../components/DnaQuiz'), { ssr: false });

const TEAL = '#4fc3f7';

export default function DnaMcqPage() {
  const [activeStructure, setActiveStructure] = useState(null);
  const [focusStructure, setFocusStructure] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    unlockScroll();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const canvasHeight = isMobile ? '42vh' : 'calc(100vh - 84px)';

  function handleClose() {
    window.location.href = '/mcq/3d';
  }

  return (
    <div style={{
      background: '#020817',
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
        borderRight: isMobile ? 'none' : '1px solid #1e293b',
        borderBottom: isMobile ? '1px solid #1e293b' : 'none',
      }}>

        {/* QUIZ MODE badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
          background: TEAL + '22', border: '1px solid ' + TEAL + '66',
          color: TEAL, fontSize: '11px', fontWeight: 700,
          padding: '4px 10px', borderRadius: '999px',
          letterSpacing: '0.08em', pointerEvents: 'none',
          fontFamily: 'Inter, sans-serif',
        }}>
          QUIZ MODE
        </div>

        {/* Study Full Page button — top right of canvas */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 10,
        }}>
          <Link href="/models/dna" style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(2,8,23,0.8)',
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

        <DnaScene
          scrollY={0}
          quizMode={true}
          activeStructure={activeStructure}
          setActiveStructure={setActiveStructure}
          focusStructure={focusStructure}
          height={canvasHeight}
        />
      </div>

      {/* ── Quiz panel side ── */}
      <div style={{
        flex: isMobile ? 'none' : '0 0 360px',
        height: isMobile ? '58vh' : 'calc(100vh - 84px)',
        background: '#0a1628',
        borderLeft: isMobile ? 'none' : '1px solid #1e293b',
        borderTop: isMobile ? '1px solid #1e293b' : 'none',
        overflowY: 'auto',
      }}>
        <DnaQuiz
          setActiveStructure={setActiveStructure}
          onClose={handleClose}
          onStructureChange={(key) => {
            setActiveStructure(key);
            setFocusStructure(key);
          }}
        />
      </div>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 19, 2026] CREATED: Quiz-only DNA page routed from /mcq/3d
// REASON: Dedicated quiz flow — no study content, just canvas + quiz panel.
//         "Study Full Page" button links to /models/dna for full content.
//         Exit button navigates back to /mcq/3d model picker.
// --- END CHANGE LOG ---
