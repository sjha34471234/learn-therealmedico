// ============================================================
// FILE: components/SkeletonScene.jsx
// PURPOSE: Interactive 3D skeleton — click actual bones to label them
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Model page for /models/skeleton
// DEPENDENCIES: lib/boneData.js (BONE_INFO), @react-three/fiber, @react-three/drei
// ⚠️ DO NOT CHANGE:
//   - Must stay 'use client'. Always use next/dynamic with ssr:false in page.js.
//   - useGLTF MUST stay inside SkeletonModel (inside Canvas). Never move it up.
//   - Bounds handles all camera fitting — do not manually set scale or camera z.
//   - Canvas height is responsive via useEffect — do not hardcode px height.
//   - BoneHighlighter clones materials once on load, then only updates changed bones.
//   - activeBone and setActiveBone come from page.js as props — state lives there.
// ============================================================

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, Bounds, useBounds } from '@react-three/drei';
import { BONE_INFO } from '../lib/boneData';

const HIGHLIGHT_COLOR = '#00ffcc';
const NORMAL_COLOR = '#c8b89a';
const HOVER_COLOR = '#e8d4b0';

function getCanvasHeight() {
  if (typeof window === 'undefined') return 420;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 480) return Math.round(h * 0.55);
  if (w < 768) return Math.round(h * 0.58);
  if (w < 1024) return Math.round(h * 0.60);
  return Math.round(h * 0.65);
}

function AutoFit() {
  const bounds = useBounds();
  useEffect(() => {
    bounds.refresh().fit();
  }, [bounds]);
  return null;
}

function SkeletonModel({ activeBone, setActiveBone, hoveredBone, setHoveredBone }) {
  const { scene } = useGLTF('/models/scene.gltf');
  return (
    <primitive
      object={scene}
      onPointerDown={(e) => {
        const name = e.object.name;
        if (!BONE_INFO[name]) return;
        e.stopPropagation();
        setActiveBone(activeBone === name ? null : name);
      }}
      onPointerEnter={(e) => {
        const name = e.object.name;
        if (!BONE_INFO[name]) return;
        e.stopPropagation();
        setHoveredBone(name);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHoveredBone(null);
        document.body.style.cursor = 'grab';
      }}
    />
  );
}

function BoneHighlighter({ activeBone, hoveredBone }) {
  const { scene } = useGLTF('/models/scene.gltf');

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      obj.material = obj.material.clone();
      obj.material.roughness = 0.6;
      obj.material.metalness = 0.1;
    });
  }, [scene]);

  const prevActive = useRef(null);
  const prevHovered = useRef(null);

  useEffect(() => {
    const toUpdate = new Set([activeBone, prevActive.current, hoveredBone, prevHovered.current]);
    scene.traverse((obj) => {
      if (!obj.isMesh || !obj.material || !toUpdate.has(obj.name)) return;
      const isActive = activeBone === obj.name;
      const isHovered = hoveredBone === obj.name;
      obj.material.color.set(isActive ? HIGHLIGHT_COLOR : isHovered ? HOVER_COLOR : NORMAL_COLOR);
      obj.material.emissive.set(isActive ? HIGHLIGHT_COLOR : isHovered ? HOVER_COLOR : '#000000');
      obj.material.emissiveIntensity = isActive ? 0.4 : isHovered ? 0.15 : 0;
    });
    prevActive.current = activeBone;
    prevHovered.current = hoveredBone;
  }, [activeBone, hoveredBone, scene]);

  return null;
}

function BoneLabel({ activeBone }) {
  const { scene } = useGLTF('/models/scene.gltf');
  if (!activeBone || !BONE_INFO[activeBone]) return null;
  let targetObj = null;
  scene.traverse((obj) => { if (obj.name === activeBone) targetObj = obj; });
  if (!targetObj) return null;
  return (
    <Html object={targetObj} center style={{ pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(2, 8, 23, 0.92)', border: '1px solid #00ffcc', borderRadius: '6px', padding: '5px 8px', color: '#fff', fontFamily: 'Inter, sans-serif', width: '130px', pointerEvents: 'none', boxShadow: '0 0 10px rgba(0,255,204,0.2)', userSelect: 'none', transform: 'scale(0.65)', transformOrigin: 'center center' }}>
        <div style={{ color: '#00ffcc', fontWeight: 700, marginBottom: 3, fontSize: '13px', letterSpacing: '0.02em' }}>
          {BONE_INFO[activeBone].name}
        </div>
        <div style={{ color: '#94a3b8', lineHeight: 1.4, fontSize: '11px' }}>
          {BONE_INFO[activeBone].desc}
        </div>
      </div>
    </Html>
  );
}

export default function SkeletonScene({ activeBone, setActiveBone }) {
  const [hoveredBone, setHoveredBone] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(420);
  const containerRef = useRef(null);

  useEffect(() => {
    function updateHeight() { setCanvasHeight(getCanvasHeight()); }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e) => e.preventDefault();
    el.addEventListener('selectstart', prevent);
    return () => {
      el.removeEventListener('selectstart', prevent);
      document.body.style.cursor = '';
    };
  }, []);

  const handleMissed = useCallback(() => setActiveBone(null), []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: canvasHeight + 'px', borderRadius: '16px', overflow: 'hidden', touchAction: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} onPointerMissed={handleMissed} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 20, 10]} intensity={1.4} />
        <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#aaccff" />
        <pointLight position={[0, 20, 10]} intensity={0.6} />
        <Bounds fit clip observe margin={1.2}>
          <SkeletonModel activeBone={activeBone} setActiveBone={setActiveBone} hoveredBone={hoveredBone} setHoveredBone={setHoveredBone} />
          <AutoFit />
        </Bounds>
        <BoneHighlighter activeBone={activeBone} hoveredBone={hoveredBone} />
        <BoneLabel activeBone={activeBone} />
        <OrbitControls enablePan={true} enableZoom={true} enableDamping={true} dampingFactor={0.06} zoomSpeed={0.8} rotateSpeed={0.6} zoomToCursor={true} />
      </Canvas>
    </div>
  );
}

// --- CHANGE LOG ---
// [May 17, 2026] CHANGED: Removed BONE_INFO constant, now imported from lib/boneData.js
// REASON: Single source of truth — boneData.js holds all bone data for both
//   SkeletonScene and skeleton/page.js
// --- END CHANGE LOG ---
