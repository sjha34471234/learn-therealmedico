// ============================================================
// FILE: components/SkeletonQuiz.jsx
// PURPOSE: Full skeleton quiz game — mode picker, game loop, score, and gated analysis
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Quiz Me feature on the skeleton page. Turns passive study into active recall.
// DEPENDENCIES: lib/quizData.js, store/authStore.js
// DO NOT CHANGE:
//   - Detailed analysis must NEVER render in the DOM for non-members — not even blurred.
//     Use {isMember && ...} only. CSS blur is NOT enough — inspect element reveals it.
//   - setActiveBone is called to highlight the bone in the 3D canvas during the game.
//   - Timer uses useRef not useState — avoids re-render on every tick.
//   - shuffle uses Fisher-Yates — do not replace with .sort(() => Math.random() - 0.5)
//   - isMember defaults to false — Learn World authStore has no profile field yet.
//     When profile fetch is added to authStore, update the isMember line here.
// ============================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QUIZ_BONES } from '../lib/quizData';
import useAuthStore from '../store/authStore';

// Fisher-Yates shuffle — unbiased
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate 4 multiple choice options — 1 correct + 3 random wrong
function generateOptions(correct, allBones) {
  const wrong = shuffle(allBones.filter(b => b.key !== correct.key)).slice(0, 3);
  return shuffle([correct, ...wrong]);
}

const TEAL = '#4fc3f7';
const GREEN = '#34d399';
const RED = '#f87171';
const GOLD = '#fbbf24';

export default function SkeletonQuiz({ setActiveBone, onClose }) {
  const user = useAuthStore(state => state.user);
  // isMember: always false until authStore gains a profile field with is_member.
  // When that is added, replace this line with: const isMember = useAuthStore(state => state.profile?.is_member) === true;
  const isMember = false;

  // Game phases: 'mode' | 'playing' | 'results'
  const [phase, setPhase] = useState('mode');
  const [mode, setMode] = useState(null); // 'type' | 'choice'

  // Game state
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong' | 'skipped'
  const [results, setResults] = useState([]); // { bone, answer, correct, skipped, timeMs }

  // Timing
  const boneStartTime = useRef(null);
  const gameStartTime = useRef(null);
  const [totalMs, setTotalMs] = useState(0);

  const inputRef = useRef(null);

  const currentBone = queue[currentIndex] || null;

  // Start game
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
    if (selectedMode === 'choice') {
      setOptions(generateOptions(shuffled[0], QUIZ_BONES));
    }
  }

  // Focus input when bone changes in type mode
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
      setPhase('results');
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextBone = queue[nextIndex];
    setResults(newResults);
    setCurrentIndex(nextIndex);
    setActiveBone(nextBone.key);
    setInput('');
    setFeedback(null);
    boneStartTime.current = Date.now();
    if (mode === 'choice') {
      setOptions(generateOptions(nextBone, QUIZ_BONES));
    }
  }, [results, currentIndex, queue, mode, setActiveBone]);

  function checkAnswer(answer) {
    const timeMs = Date.now() - boneStartTime.current;
    const clean = answer.toLowerCase().trim();
    const isCorrect = currentBone.accepted.includes(clean);
    const fb = isCorrect ? 'correct' : 'wrong';
    setFeedback(fb);

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

  // Derived results stats
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

  // ─── MODE PICKER ────────────────────────────────────────────
  if (phase === 'mode') {
    return (
      <div style={overlayStyle}>
        <div style={panelStyle}>
          <button onClick={onClose} style={closeBtnStyle}>X</button>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🦴</div>
          <h2 style={headingStyle}>Skeleton Quiz</h2>
          <p style={subStyle}>{QUIZ_BONES.length} bones · Choose your mode</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
            <button onClick={() => startGame('type')} style={modeBtnStyle}>
              <span style={{ fontSize: '22px' }}>⌨️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>Type It</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Harder — type the bone name from memory</div>
              </div>
            </button>
            <button onClick={() => startGame('choice')} style={modeBtnStyle}>
              <span style={{ fontSize: '22px' }}>🔘</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>Multiple Choice</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Easier — pick from 4 options</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ────────────────────────────────────────────────
  if (phase === 'playing') {
    const progress = ((currentIndex) / queue.length) * 100;
    const feedbackColor = feedback === 'correct' ? GREEN : feedback === 'wrong' ? RED : TEAL;

    return (
      <div style={overlayStyle}>
        <div style={{ ...panelStyle, maxWidth: '440px' }}>
          <button onClick={onClose} style={closeBtnStyle}>X</button>

          {/* Progress bar */}
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: TEAL, borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>

          {/* Score */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              Bone {currentIndex + 1} of {queue.length}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: GREEN }}>
              {correctCount} correct
            </span>
          </div>

          {/* Region label */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
            {currentBone?.region}
          </div>

          {/* Prompt */}
          <h3 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: 'clamp(16px, 4vw, 22px)', color: '#fff', margin: '0 0 24px 0', lineHeight: 1.3 }}>
            What bone is highlighted in teal?
          </h3>

          {/* Feedback flash */}
          {feedback && (
            <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, color: feedbackColor, marginBottom: '12px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>
              {feedback === 'correct' ? 'Correct!' : feedback === 'wrong' ? `It was ${currentBone?.name}` : 'Skipped'}
            </div>
          )}

          {/* TYPE MODE */}
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => { if (input.trim()) checkAnswer(input.trim()); }}
                  disabled={!input.trim()}
                  style={{ ...actionBtnStyle, background: TEAL, color: '#050510', flex: 1, opacity: input.trim() ? 1 : 0.4 }}
                >
                  Check
                </button>
                <button onClick={skip} style={{ ...actionBtnStyle, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', flex: 0 }}>
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* MULTIPLE CHOICE MODE */}
          {mode === 'choice' && !feedback && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────
  if (phase === 'results') {
    const scoreColor = pct >= 80 ? GREEN : pct >= 50 ? GOLD : RED;

    return (
      <div style={{ ...overlayStyle, overflowY: 'auto', alignItems: 'flex-start', paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ ...panelStyle, maxWidth: '480px', width: '100%' }}>
          <button onClick={onClose} style={closeBtnStyle}>X</button>

          {/* Score hero */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'Merriweather, serif', fontWeight: 900, fontSize: '56px', color: scoreColor, lineHeight: 1 }}>
              {correctCount}/{totalCount}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
              {pct}% correct · {formatTime(totalMs)} total
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '28px' }}>
            {[
              { label: 'Correct', value: correctCount, color: GREEN },
              { label: 'Wrong', value: wrongCount, color: RED },
              { label: 'Skipped', value: skippedCount, color: 'rgba(255,255,255,0.3)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Detailed analysis — MEMBERS ONLY — never rendered in DOM for non-members */}
          {isMember ? (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Real Medico+ Analysis
              </div>

              {weakRegions.length > 0 && (
                <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: GOLD, marginBottom: '8px' }}>Weak areas to review</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {weakRegions.map(r => (
                      <span key={r} style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', background: 'rgba(251,191,36,0.1)', color: GOLD, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.25)' }}>{r}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                {results.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 14px', border: `1px solid ${r.correct ? 'rgba(52,211,153,0.15)' : r.skipped ? 'rgba(255,255,255,0.06)' : 'rgba(248,113,113,0.15)'}` }}>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: r.correct ? GREEN : r.skipped ? 'rgba(255,255,255,0.35)' : RED }}>
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
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginLeft: '12px' }}>
                      {formatTime(r.timeMs)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>★</div>
              <div style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '8px' }}>
                Detailed Analysis
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '16px', lineHeight: 1.6 }}>
                See exactly which bones you got wrong, how long each took, your weak regions, and a full per-bone breakdown — with Real Medico+.
              </p>
              <a
                href="https://therealmedico.store/account"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', background: GOLD, color: '#111', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.03em' }}
              >
                Unlock with Real Medico+
              </a>
            </div>
          )}

          {/* Play again */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => startGame(mode)} style={{ ...actionBtnStyle, background: TEAL, color: '#050510', flex: 1, fontWeight: 700 }}>
              Play Again
            </button>
            <button onClick={() => setPhase('mode')} style={{ ...actionBtnStyle, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', flex: 0 }}>
              Change Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── SHARED STYLES ───────────────────────────────────────────

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(5,5,16,0.92)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const panelStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '18px',
  padding: '28px 24px',
  width: '100%',
  maxWidth: '400px',
  position: 'relative',
  fontFamily: 'Inter, sans-serif',
  color: '#fff',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '14px',
  right: '16px',
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.3)',
  fontSize: '18px',
  cursor: 'pointer',
  lineHeight: 1,
  padding: '4px',
};

const headingStyle = {
  fontFamily: 'Merriweather, serif',
  fontWeight: 700,
  fontSize: '22px',
  color: '#fff',
  margin: '0 0 6px 0',
};

const subStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  color: 'rgba(255,255,255,0.4)',
  margin: 0,
};

const modeBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '16px 18px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.2s, background 0.2s',
  width: '100%',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(79,195,247,0.3)',
  borderRadius: '10px',
  padding: '13px 16px',
  color: '#fff',
  fontSize: '15px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
};

const actionBtnStyle = {
  padding: '13px 18px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'opacity 0.2s',
};

const choiceBtnStyle = {
  width: '100%',
  padding: '13px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s, border-color 0.15s',
};

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Full skeleton quiz component — mode picker, game loop, gated results
// REASON: Quiz Me feature — active recall study tool with Real Medico+ analysis gate
// [May 17, 2026] FIXED: Changed named import to default import for useAuthStore
// REASON: authStore exports default not named. Also removed profile dependency —
//         Learn World authStore has no profile field. isMember defaults false until
//         authStore is updated with profile fetch.
// --- END CHANGE LOG ---
