// ============================================================
// FILE: components/DnaQuiz.jsx
// PURPOSE: Quiz panel for the DNA model page — mode picker, game loop, gated results
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Follows 3D Model Template. Identical pattern to SkeletonQuiz.jsx.
// DEPENDENCIES: lib/dnaData.js (QUIZ_DNA), store/authStore.js (is_member), components/UpgradeGate.jsx
// DO NOT CHANGE: isMember check — detailed analysis must NEVER enter DOM for non-members
// DO NOT CHANGE: finalResults pattern in advance() — results state lags one render behind
// ============================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore';
import { QUIZ_DNA } from '../lib/dnaData';
import UpgradeGate from './UpgradeGate';

const TEAL = '#4fc3f7';
const GREEN = '#34d399';
const RED = '#f87171';
const GOLD = '#fbbf24';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getChoices(correct, all) {
  const others = shuffle(all.filter(q => q.key !== correct.key)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function DnaQuiz({ setActiveStructure, onClose, onStructureChange }) {
  const isMember = useAuthStore(state => state.profile?.is_member) === true;

  const [phase, setPhase] = useState('mode');
  const [mode, setMode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  // FIX: store final results in a ref so results phase always has the complete list
  const finalResultsRef = useRef([]);
  const [questionStart, setQuestionStart] = useState(null);
  const inputRef = useRef(null);

  const current = queue[currentIndex];

  function startGame(selectedMode) {
    const q = shuffle(QUIZ_DNA);
    setMode(selectedMode);
    setQueue(q);
    setCurrentIndex(0);
    setResults([]);
    finalResultsRef.current = [];
    setFeedback(null);
    setInput('');
    setQuestionStart(Date.now());
    setPhase('playing');
    if (q[0]) {
      setActiveStructure(q[0].key);
      onStructureChange(q[0].key);
      if (selectedMode === 'choice') {
        setChoices(getChoices(q[0], QUIZ_DNA));
      }
    }
  }

  function advance(resultEntry) {
    // FIX: build full results list here using ref — don't rely on state which lags
    const newResults = [...finalResultsRef.current, resultEntry];
    finalResultsRef.current = newResults;
    setResults(newResults);

    const next = currentIndex + 1;
    if (next >= queue.length) {
      setActiveStructure(null);
      onStructureChange(null);
      setPhase('results');
      return;
    }
    setCurrentIndex(next);
    setInput('');
    setFeedback(null);
    setQuestionStart(Date.now());
    setActiveStructure(queue[next].key);
    onStructureChange(queue[next].key);
    if (mode === 'choice') {
      setChoices(getChoices(queue[next], QUIZ_DNA));
    }
    if (inputRef.current) inputRef.current.focus();
  }

  function checkAnswer(answer) {
    if (feedback) return;
    const timeTaken = Math.round((Date.now() - questionStart) / 1000);
    const normalized = answer.trim().toLowerCase();
    const correct = current.accepted.some(a => a.toLowerCase() === normalized);
    const resultEntry = {
      key: current.key,
      name: current.name,
      region: current.region,
      result: correct ? 'correct' : 'wrong',
      userAnswer: answer.trim(),
      timeTaken,
    };
    setFeedback(correct ? 'correct' : { wrong: true, correctName: current.name });
    setTimeout(() => advance(resultEntry), 700);
  }

  function skip() {
    if (feedback) return;
    const timeTaken = Math.round((Date.now() - questionStart) / 1000);
    const resultEntry = {
      key: current.key,
      name: current.name,
      region: current.region,
      result: 'skipped',
      userAnswer: '',
      timeTaken,
    };
    setFeedback({ skipped: true, correctName: current.name });
    setTimeout(() => advance(resultEntry), 400);
  }

  useEffect(() => {
    if (phase === 'playing' && mode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentIndex, mode]);

  // Use finalResultsRef for results phase so we always have the complete list
  const displayResults = phase === 'results' ? finalResultsRef.current : results;

  const correctCount = displayResults.filter(r => r.result === 'correct').length;
  const wrongCount = displayResults.filter(r => r.result === 'wrong').length;
  const skippedCount = displayResults.filter(r => r.result === 'skipped').length;
  const pct = queue.length > 0 ? Math.round((correctCount / queue.length) * 100) : 0;
  const scoreColor = pct >= 80 ? GREEN : pct >= 50 ? GOLD : RED;

  const regionStats = {};
  displayResults.forEach(r => {
    if (!regionStats[r.region]) regionStats[r.region] = { correct: 0, total: 0 };
    regionStats[r.region].total++;
    if (r.result === 'correct') regionStats[r.region].correct++;
  });
  const weakRegions = Object.entries(regionStats).filter(([, s]) => s.correct / s.total < 0.6);

  // ── PHASE: MODE PICKER ──
  if (phase === 'mode') return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', gap: '20px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
        DNA Quiz
      </div>
      <div style={{ fontSize: '14px', color: '#94a3b8', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>
        The structure will highlight in the 3D viewer. Name it correctly to score.
      </div>
      <button onClick={() => startGame('type')} style={{
        width: '100%', maxWidth: '260px', padding: '14px',
        background: TEAL, color: '#020817', fontWeight: 700,
        fontSize: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer',
      }}>
        Type It
      </button>
      <button onClick={() => startGame('choice')} style={{
        width: '100%', maxWidth: '260px', padding: '14px',
        background: 'transparent', color: TEAL, fontWeight: 700,
        fontSize: '15px', borderRadius: '10px', border: `2px solid ${TEAL}`, cursor: 'pointer',
      }}>
        Multiple Choice
      </button>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: '#475569',
        fontSize: '13px', cursor: 'pointer', marginTop: '8px',
      }}>
        Exit Quiz
      </button>
    </div>
  );

  // ── PHASE: PLAYING ──
  if (phase === 'playing' && current) return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '20px 20px 16px', gap: '12px',
      fontFamily: 'Inter, sans-serif', overflowY: 'auto',
    }}>
      {/* Progress bar */}
      <div style={{ background: '#1e293b', borderRadius: '999px', height: '6px', width: '100%' }}>
        <div style={{
          height: '100%', borderRadius: '999px', background: TEAL,
          width: `${(currentIndex / queue.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
        <span>Structure {currentIndex + 1} of {queue.length}</span>
        <span style={{ color: GREEN }}>{correctCount} correct</span>
      </div>

      {/* Region */}
      <div style={{ fontSize: '11px', fontWeight: 700, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {current.region}
      </div>

      {/* Question */}
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
        What DNA component is highlighted in teal?
      </div>

      {/* Feedback flash */}
      {feedback && (
        <div style={{
          padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          background: feedback === 'correct' ? '#064e3b' : feedback.skipped ? '#0c4a6e' : '#450a0a',
          color: feedback === 'correct' ? GREEN : feedback.skipped ? TEAL : RED,
          border: `1px solid ${feedback === 'correct' ? GREEN : feedback.skipped ? TEAL : RED}44`,
        }}>
          {feedback === 'correct'
            ? 'Correct!'
            : feedback.skipped
              ? `Skipped — it was ${feedback.correctName}`
              : `It was ${feedback.correctName}`}
        </div>
      )}

      {/* Type mode */}
      {mode === 'type' && !feedback && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') checkAnswer(input); }}
            placeholder="Type the name..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '8px',
              background: '#0f172a', border: '1px solid #334155',
              color: '#fff', fontSize: '14px', outline: 'none',
            }}
          />
          <button onClick={() => checkAnswer(input)} style={{
            padding: '10px 16px', background: TEAL, color: '#020817',
            fontWeight: 700, fontSize: '13px', borderRadius: '8px',
            border: 'none', cursor: 'pointer',
          }}>Check</button>
        </div>
      )}

      {/* Choice mode */}
      {mode === 'choice' && !feedback && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {choices.map(c => (
            <button key={c.key} onClick={() => checkAnswer(c.name)} style={{
              padding: '11px 14px', borderRadius: '8px', textAlign: 'left',
              background: '#0f172a', border: '1px solid #334155',
              color: '#e2e8f0', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Skip */}
      {!feedback && (
        <button onClick={skip} style={{
          background: 'none', border: 'none', color: '#475569',
          fontSize: '12px', cursor: 'pointer', textAlign: 'left', marginTop: '4px',
        }}>
          Skip this one
        </button>
      )}
    </div>
  );

  // ── PHASE: RESULTS ──
  if (phase === 'results') return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '24px 20px', gap: '16px',
      fontFamily: 'Inter, sans-serif', overflowY: 'auto',
    }}>
      {/* Score hero */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', fontWeight: 800, color: scoreColor }}>
          {correctCount}/{queue.length}
        </div>
        <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
          {pct}% correct
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { label: 'Correct', value: correctCount, color: GREEN },
          { label: 'Wrong', value: wrongCount, color: RED },
          { label: 'Skipped', value: skippedCount, color: TEAL },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: '#0f172a', borderRadius: '8px',
            padding: '10px 8px', textAlign: 'center',
            border: `1px solid ${s.color}33`,
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Detailed analysis — MEMBERS ONLY — never in DOM for non-members */}
      {isMember && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Real Medico+ Analysis
          </div>

          {weakRegions.length > 0 && (
            <div style={{
              background: '#450a0a', borderRadius: '8px', padding: '10px 14px',
              border: '1px solid #f8717133',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: RED, marginBottom: '6px' }}>
                Weak Areas
              </div>
              {weakRegions.map(([region, s]) => (
                <div key={region} style={{ fontSize: '12px', color: '#fca5a5' }}>
                  {region} — {s.correct}/{s.total} correct
                </div>
              ))}
            </div>
          )}

          {displayResults.map((r, i) => (
            <div key={i} style={{
              background: '#0f172a', borderRadius: '8px', padding: '10px 14px',
              border: `1px solid ${r.result === 'correct' ? GREEN : r.result === 'skipped' ? TEAL : RED}33`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{r.name}</div>
                <div style={{
                  fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                  background: r.result === 'correct' ? '#064e3b' : r.result === 'skipped' ? '#0c4a6e' : '#450a0a',
                  color: r.result === 'correct' ? GREEN : r.result === 'skipped' ? TEAL : RED,
                }}>
                  {r.result}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                {r.userAnswer ? `Your answer: ${r.userAnswer}` : 'No answer given'} · {r.timeTaken}s
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Non-member gate — UpgradeGate component — never in DOM for members */}
      {!isMember && <UpgradeGate />}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button onClick={() => startGame(mode)} style={{
          flex: 1, padding: '12px', background: TEAL, color: '#020817',
          fontWeight: 700, fontSize: '14px', borderRadius: '8px',
          border: 'none', cursor: 'pointer',
        }}>
          Play Again
        </button>
        <button onClick={() => setPhase('mode')} style={{
          flex: 1, padding: '12px', background: 'transparent', color: TEAL,
          fontWeight: 700, fontSize: '14px', borderRadius: '8px',
          border: `2px solid ${TEAL}`, cursor: 'pointer',
        }}>
          Change Mode
        </button>
      </div>
    </div>
  );

  return null;
}

// — CHANGE LOG —
// [May 18, 2026] CREATED: Full quiz panel for DNA model
// REASON: Follows 3D Model Template from brain dump.
// [May 18, 2026] FIXED: Added UpgradeGate import — was missing from previous version
// [May 18, 2026] FIXED: finalResultsRef pattern — results state lags one render behind on last entry
// REASON: In type mode, last answer was missing from detailed analysis because setResults
//         is async — phase switched to results before state updated. Ref is synchronous.
// — END CHANGE LOG —
