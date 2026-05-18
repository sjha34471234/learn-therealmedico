// ============================================================
// FILE: app/models/dna/page.js
// PURPOSE: DNA model page — normal view + quiz split-screen layout
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Individual model page following 3D Model Template from brain dump
// DEPENDENCIES: DnaScene.jsx, DnaQuiz.jsx, lib/dnaData.js, lib/scrollUtils.js
// DO NOT CHANGE: paddingTop 84px — clears two-row navbar
// DO NOT CHANGE: quiz split-screen layout — canvas must always be visible during quiz
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { unlockScroll } from '../../../lib/scrollUtils';
import { DNA_INFO, DNA_CATALOG } from '../../../lib/dnaData';
const DnaScene = dynamic(() => import('../../../components/DnaScene'), { ssr: false });
const DnaQuiz = dynamic(() => import('../../../components/DnaQuiz'), { ssr: false });


const TEAL = '#4fc3f7';

export default function DnaPage() {
  const [activeStructure, setActiveStructure] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [focusStructure, setFocusStructure] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    unlockScroll();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function openQuiz() {
    setQuizMode(true);
    setActiveStructure(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeQuiz() {
    setQuizMode(false);
    setActiveStructure(null);
    setFocusStructure(null);
  }

  // Canvas height following template rules
  const canvasHeight = quizMode
    ? (isMobile ? '42vh' : 'calc(100vh - 84px)')
    : (isMobile ? '55vh' : '65vh');

  const activeInfo = activeStructure ? DNA_INFO[activeStructure] : null;

  // ── QUIZ SPLIT-SCREEN LAYOUT ──
  if (quizMode) return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      paddingTop: '84px',
      background: '#020817',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
    }}>
      {/* Canvas side */}
      <div style={{
        flex: isMobile ? 'none' : 1,
        height: isMobile ? '42vh' : 'calc(100vh - 84px)',
        position: 'relative',
      }}>
        {/* QUIZ MODE badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
          background: `${TEAL}22`, border: `1px solid ${TEAL}66`,
          color: TEAL, fontSize: '11px', fontWeight: 700,
          padding: '4px 10px', borderRadius: '999px',
          letterSpacing: '0.08em', pointerEvents: 'none',
          fontFamily: 'Inter, sans-serif',
        }}>
          QUIZ MODE
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

      {/* Quiz panel side */}
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
          onClose={closeQuiz}
          onStructureChange={(key) => {
            setActiveStructure(key);
            setFocusStructure(key);
          }}
        />
      </div>
    </div>
  );

  // ── NORMAL VIEW LAYOUT ──
  return (
    <div style={{
      minHeight: '100vh',
      background: '#020817',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      paddingTop: '84px',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #1e293b',
      }}>
        <Link href="/models" style={{
          color: '#64748b', fontSize: '13px', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Back to Models
        </Link>
        <div style={{
          fontSize: '11px', fontWeight: 700, color: TEAL,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Molecular Biology
        </div>
        <button onClick={openQuiz} style={{
          padding: '8px 18px', background: TEAL, color: '#020817',
          fontWeight: 700, fontSize: '13px', borderRadius: '8px',
          border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          Quiz Me
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '28px 24px 0' }}>
        <h1 style={{
          fontSize: isMobile ? '26px' : '34px',
          fontWeight: 800, color: '#fff', margin: 0,
          fontFamily: 'Merriweather, serif',
        }}>
          DNA Double Helix
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px' }}>
          Explore the structure of deoxyribonucleic acid — tap any component to learn more.
        </p>
      </div>

      {/* 3D Scene */}
      <div style={{ padding: '16px 0' }}>
        <DnaScene
          scrollY={0}
          quizMode={false}
          activeStructure={activeStructure}
          setActiveStructure={setActiveStructure}
          focusStructure={null}
          height={canvasHeight}
        />
      </div>

      {/* Active structure info card */}
      {activeInfo && (
        <div style={{
          margin: '0 24px 24px',
          background: '#0f172a',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${activeInfo.color}44`,
          boxShadow: `0 0 32px ${activeInfo.color}22`,
        }}>
          <div style={{
            fontSize: '18px', fontWeight: 700,
            color: activeInfo.color, marginBottom: '6px',
          }}>
            {activeInfo.name}
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.6 }}>
            {activeInfo.desc}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeInfo.facts.map((fact, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5,
              }}>
                <span style={{ color: activeInfo.color, marginTop: '2px' }}>•</span>
                {fact}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick facts grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px',
        padding: '0 24px 32px',
      }}>
        {[
          { label: 'Base Pairs', value: '~3 billion', sub: 'in human genome' },
          { label: 'Diameter', value: '2 nm', sub: 'double helix width' },
          { label: 'Base Pairs / Turn', value: '10', sub: 'B-form DNA' },
          { label: 'H-bonds (G≡C)', value: '3', sub: 'vs 2 for A=T' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#0f172a', borderRadius: '10px',
            padding: '16px', border: '1px solid #1e293b',
          }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: TEAL }}>{stat.value}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', marginTop: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Structure Reference */}
      <div style={{ padding: '0 24px 60px' }}>
        <h2 style={{
          fontSize: '20px', fontWeight: 700, color: '#fff',
          marginBottom: '20px', fontFamily: 'Merriweather, serif',
        }}>
          Structure Reference
        </h2>

        {DNA_CATALOG.map(region => (
          <div key={region.region} style={{ marginBottom: '32px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, color: TEAL,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              {region.region}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {region.structures.map(structure => {
                const info = DNA_INFO[structure.key];
                const isActive = activeStructure === structure.key;
                return (
                  <div
                    key={structure.key}
                    style={{
                      background: '#0f172a',
                      borderRadius: '10px',
                      padding: '16px',
                      border: isActive
                        ? `1px solid ${info.color}`
                        : '1px solid #1e293b',
                      boxShadow: isActive ? `0 0 20px ${info.color}33` : 'none',
                      transition: 'border 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '8px',
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: info.color }}>
                        {structure.name}
                      </div>
                      <button
                        onClick={() => setActiveStructure(prev => prev === structure.key ? null : structure.key)}
                        style={{
                          fontSize: '11px', padding: '4px 10px',
                          background: isActive ? `${info.color}22` : 'transparent',
                          border: `1px solid ${info.color}66`,
                          color: info.color, borderRadius: '6px',
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {isActive ? 'Highlighted' : 'View in Model'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {structure.facts.map((fact, idx) => (
                        <div key={idx} style={{
                          fontSize: '12px', color: '#94a3b8',
                          display: 'flex', gap: '6px', lineHeight: 1.5,
                        }}>
                          <span style={{ color: info.color }}>•</span>
                          {fact}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// — CHANGE LOG —
// [May 18, 2026] CREATED: DNA model page — normal view + quiz split-screen
// REASON: Follows 3D Model Template from brain dump. Second complete model page after skeleton.
// — END CHANGE LOG —
