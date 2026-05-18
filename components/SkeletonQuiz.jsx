// ============================================================
// FILE: components/SkeletonQuiz.jsx
// PURPOSE: Skeleton quiz panel — mode picker, game loop, score, gated analysis
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Quiz Me feature on skeleton page — active recall study tool
// DEPENDENCIES: lib/quizData.js, store/authStore.js, components/UpgradeGate.jsx
// DO NOT CHANGE:
//   - Detailed analysis must NEVER render in DOM for non-members — not even blurred.
//   - setActiveBone highlights bones in the 3D canvas during the game.
//   - Timer uses useRef not useState — avoids re-render on every tick.
//   - shuffle uses Fisher-Yates — do not replace with sort + random.
//   - No overlay/backdrop here — positioning handled entirely by page.js split layout.
//   - onBoneChange callback fires when quiz advances to next bone (for camera focus).
// ============================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QUIZ_BONES } from '../lib/quizData';
import useAuthStore from '../store/authStore';
import UpgradeGate from './UpgradeGate';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateOptions(correct, allBones) {
  const wrong = shuffle(allBones.filter(b => b.key !== correct.key)).slice(0, 3);
  return shuffle([correct, ...wrong]);
}

const TEAL = '#4fc3f7';
const GREEN = '#34d399';
const RED = '#f87171';
const GOLD = '#fbbf24';

export default function SkeletonQuiz({ setActiveBone, onClose, onBoneChange }) {
  const isMember = useAuthStore(state => state.profile?.is_member) === true;

  const [phase, setPhase] = useState('mode');
  const [mode, setMode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);

  const boneStartTime = useRef(null);
  const gameStartTime = useRef(null);
  const [totalMs, setTotalMs] = useState(0);
  const inputRef = useRef(null);

  const currentBone = queue[currentIndex] || null;

  function startGame(selectedMode) {
    const shuffled = shuffle(QUIZ_BONES);
    setMode(selectedMode);
    setQueue(shuffled);
    setCurrentIndex(0);
    setResults([]);
    setFeedback(null);
    setInput('');
    gameStartTime.current = Date.now();
    boneStartTime.current = Date.now();
    setPhase('playing');
    setActiveBone(shuffled[0]?.key || null);
    onBoneChange && onBoneChange(shuffled[0]?.key || null);
    if (selectedMode === 'choice') {
      setOptions(generateOptions(shuffled[0], QUIZ_BONES));
    }
  }

  useEffect(() => {
    if (phase === 'playing' && mode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, phase, mode]);

  const advance = useCallback((result) => {
    const newResults = [...results, result];
    if (currentIndex + 1 >= queue.length) {
      setTotalMs(Date.now() - gameStartTime.current);
      setResults(newResults);
      setActiveBone(null);
      onBoneChange && onBoneChange(null);
      setPhase('results');
      return;
    }
    const nextIndex = currentIndex + 1;
    const nextBone = queue[nextIndex];
    setResults(newResults);
    setCurrentIndex(nextIndex);
    setActiveBone(nextBone.key);
    onBoneChange && onBoneChange(nextBone.key);
    setInput('');
    setFeedback(null);
    boneStartTime.current = Date.now();
    if (mode === 'choice') {
      setOptions(generateOptions(nextBone, QUIZ_BONES));
    }
  }, [results, currentIndex, queue, mode, setActiveBone, onBoneChange]);

  function checkAnswer(answer) {
    const timeMs = Date.now() - boneStartTime.current;
    const clean = answer.toLowerCase().trim();
    const isCorrect = currentBone.accepted.includes(clean);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      advance({ bone: currentBone, answer, correct: isCorrect, skipped: false, timeMs });
    }, 700);
  }

  function skip() {
    const timeMs = Date.now() - boneStartTime.current;
    setFeedback('skipped');
    setTimeout(() => {
      advance({ bone: currentBone, answer: '', correct: false, skipped: true, timeMs });
    }, 400);
  }

  const correctCount = results.filter(r => r.correct).length;
  const wrongCount = results.filter(r => !r.correct && !r.skipped).length;
  const skippedCount = results.filter(r => r.skipped).length;
  const totalCount = results.length;
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const weakRegions = isMember ? (() => {
    const regionStats = {};
    results.forEach(r => {
      const reg = r.bone.region;
      if (!regionStats[reg]) regionStats[reg] = { correct: 0, total: 0 };
      regionStats[reg].total++;
      if (r.correct) regionStats[reg].correct++;
    });
    return Object.entries(regionStats)
      .filter(([, s]) => s.correct / s.total < 0.6)
      .map(([reg]) => reg);
  })() : [];

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  }

  const feedbackColor = feedback === 'correct' ? GREEN : feedback === 'wrong' ? RED : TEAL;

  const panelWrap = {
    height: '100%',
    overflowY: 'auto',
    padding: '24px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };

  // ─── MODE PICKER ────────────────────────────────────────────
  if (phase === 'mode') {
    return (
      <div style={panelWrap}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>🦴</div>
            <h2 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '20px', color: '#fff', margin: 0 }}>Skeleton Quiz</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0' }}>{QUIZ_BONES.length} bones · Choose your mode</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Exit
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => startGame('type')} style={modeBtnStyle}>
            <span style={{ fontSize: '20px' }}>⌨️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Type It</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Harder — type the bone name from memory</div>
            </div>
          </button>
          <button onClick={() => startGame('choice')} style={modeBtnStyle}>
            <span style={{ fontSize: '20px' }}>🔘</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Multiple Choice</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Easier — pick from 4 options</div>
            </div>
          </button>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '24px', lineHeight: 1.6 }}>
          The bone will highlight teal in the 3D viewer. Rotate and zoom freely while you think.
        </p>
      </div>
    );
  }

  // ─── PLAYING ────────────────────────────────────────────────
  if (phase === 'playing') {
    const progress = (currentIndex / queue.length) * 100;

    return (
      <div style={panelWrap}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            {currentIndex + 1} / {queue.length}
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: GREEN }}>
            {correctCount} correct
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: '4px 8px' }}>
            Exit
          </button>
        </div>

        <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: TEAL, borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>

        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
          {currentBone?.region}
        </div>

        <h3 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: 'clamp(15px, 3vw, 20px)', color: '#fff', margin: '0 0 20px 0', lineHeight: 1.3 }}>
          What bone is highlighted in teal?
        </h3>

        {feedback && (
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: feedbackColor, marginBottom: '14px', textAlign: 'center' }}>
            {feedback === 'correct' ? 'Correct!' : feedback === 'wrong' ? `It was ${currentBone?.name}` : 'Skipped'}
          </div>
        )}

        {mode === 'type' && !feedback && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) checkAnswer(input.trim()); }}
              placeholder="Type the bone name..."
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { if (input.trim()) checkAnswer(input.trim()); }}
                disabled={!input.trim()}
                style={{ ...actionBtnStyle, background: TEAL, color: '#050510', flex: 1, opacity: input.trim() ? 1 : 0.4 }}
              >
                Check
              </button>
              <button onClick={skip} style={{ ...actionBtnStyle, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                Skip
              </button>
            </div>
          </div>
        )}

        {mode === 'choice' && !feedback && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(opt => (
              <button
                key={opt.key}
                onClick={() => checkAnswer(opt.name.toLowerCase())}
                style={choiceBtnStyle}
              >
                {opt.name}
              </button>
            ))}
            <button onClick={skip} style={{ ...actionBtnStyle, background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
              Skip this bone
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────
  if (phase === 'results') {
    const scoreColor = pct >= 80 ? GREEN : pct >= 50 ? GOLD : RED;

    return (
      <div style={panelWrap}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '18px', color: '#fff', margin: 0 }}>Results</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Exit
          </button>
        </div>

        {/* Score hero */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Merriweather, serif', fontWeight: 900, fontSize: '52px', color: scoreColor, lineHeight: 1 }}>
            {correctCount}/{totalCount}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
            {pct}% correct · {formatTime(totalMs)}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {[
            { label: 'Correct', value: correctCount, color: GREEN },
            { label: 'Wrong', value: wrongCount, color: RED },
            { label: 'Skipped', value: skippedCount, color: 'rgba(255,255,255,0.3)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '22px', color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Detailed analysis — MEMBERS ONLY — never in DOM for non-members */}
        {isMember ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>
              Real Medico+ Analysis
            </div>

            {weakRegions.length > 0 && (
              <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: GOLD, marginBottom: '6px' }}>Weak areas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {weakRegions.map(r => (
                    <span key={r} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', background: 'rgba(251,191,36,0.1)', color: GOLD, padding: '3px 9px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.25)' }}>{r}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '9px 12px', border: `1px solid ${r.correct ? 'rgba(52,211,153,0.15)' : r.skipped ? 'rgba(255,255,255,0.06)' : 'rgba(248,113,113,0.15)'}` }}>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: r.correct ? GREEN : r.skipped ? 'rgba(255,255,255,0.35)' : RED }}>
                      {r.correct ? 'Correct' : r.skipped ? 'Skipped' : 'Wrong'} — {r.bone.name}
                    </div>
                    {!r.correct && !r.skipped && r.answer && (
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                        You wrote: {r.answer}
                      </div>
                    )}
                    {r.skipped && (
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                        Answer: {r.bone.name}
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginLeft: '10px' }}>
                    {formatTime(r.timeMs)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Non-member gate — UpgradeGate component — never blurred, never in DOM when member */
          <div style={{ marginBottom: '20px' }}>
            <UpgradeGate />
          </div>
        )}

        {/* Play again */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => startGame(mode)} style={{ ...actionBtnStyle, background: TEAL, color: '#050510', flex: 1, fontWeight: 700 }}>
            Play Again
          </button>
          <button onClick={() => setPhase('mode')} style={{ ...actionBtnStyle, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
            Change Mode
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const modeBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '14px 16px',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(79,195,247,0.3)',
  borderRadius: '10px',
  padding: '12px 14px',
  color: '#fff',
  fontSize: '15px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
};

const actionBtnStyle = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
};

const choiceBtnStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  cursor: 'pointer',
  textAlign: 'left',
};

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Full skeleton quiz with overlay
// REASON: Quiz Me feature
// [May 18, 2026] REBUILT: Removed overlay — now a pure panel component
// REASON: Split-screen layout — page.js handles positioning.
// [May 18, 2026] UPDATED: Replaced inline upgrade card with UpgradeGate component
// REASON: Modular reusable upsell — same component used in DnaQuiz and future quizzes.
// --- END CHANGE LOG ---
