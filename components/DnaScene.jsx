// ============================================================
// FILE: components/DnaScene.jsx
// PURPOSE: Interactive 3D DNA double helix — used on landing page AND /models/dna
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Main 3D scene for DNA. Landing page uses default props. DNA page passes quiz props.
// DEPENDENCIES: three, @react-three/fiber, @react-three/drei
// DO NOT CHANGE: onPointerDown toggles label — works on both touch and mouse
// DO NOT CHANGE: userData.partIndex set via ref in useEffect — NOT as JSX prop
// ============================================================

'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DNA_PARTS = [
  { key: 'adenine',     label: 'Adenine (A)',      description: 'Purine base — pairs with Thymine',    color: '#f472b6' },
  { key: 'thymine',     label: 'Thymine (T)',       description: 'Pyrimidine — pairs with Adenine',     color: '#facc15' },
  { key: 'guanine',     label: 'Guanine (G)',       description: 'Purine base — pairs with Cytosine',   color: '#34d399' },
  { key: 'cytosine',    label: 'Cytosine (C)',      description: 'Pyrimidine — pairs with Guanine',     color: '#38bdf8' },
  { key: 'phosphate',   label: 'Phosphate Group',   description: 'Forms the DNA backbone',              color: '#c084fc' },
  { key: 'deoxyribose', label: 'Deoxyribose Sugar', description: 'Sugar component of the backbone',     color: '#fb923c' },
];

function HoverLabel({ label, description, color }) {
  return (
    <div style={{
      background: 'rgba(2,8,23,0.95)',
      border: `1px solid ${color}88`,
      borderRadius: '10px',
      padding: '9px 14px',
      color: '#fff',
      minWidth: '165px',
      boxShadow: `0 0 24px ${color}66`,
      pointerEvents: 'none',
      fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap',
      transform: 'scale(0.85)',
      transformOrigin: 'top left',
    }}>
      <div style={{ color, fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

function Nucleotide({ position, partIndex, side, quizMode, activeStructure, setActiveStructure }) {
  const meshRef = useRef();
  const part = DNA_PARTS[partIndex % DNA_PARTS.length];
  const isActive = activeStructure === part.key;
  const [localActive, setLocalActive] = useState(false);
  const showLabel = quizMode ? false : localActive;

  // FIX: Set userData.partIndex directly on the Three.js object via ref
  // JSX props do NOT set userData on mesh — must use ref
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.partIndex = partIndex;
      meshRef.current.userData.partKey = part.key;
    }
  }, [partIndex, part.key]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const breathe = 1 + Math.sin(clock.elapsedTime * 1.8 + partIndex * 0.6) * 0.05;
    const targetScale = isActive ? 1.6 : (localActive ? 1.3 : breathe);
    meshRef.current.scale.setScalar(targetScale);
    meshRef.current.material.emissiveIntensity = isActive ? 2.2 : (localActive ? 1.4 : 0.8);
  });

  function handleClick(e) {
    e.stopPropagation();
    if (quizMode) return;
    setLocalActive(v => !v);
    if (setActiveStructure) {
      setActiveStructure(prev => prev === part.key ? null : part.key);
    }
  }

  const displayColor = isActive ? '#00ffcc' : part.color;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={handleClick}
    >
      <sphereGeometry args={[0.24, 28, 28]} />
      <meshStandardMaterial
        color={displayColor}
        emissive={displayColor}
        emissiveIntensity={0.8}
        roughness={0.05}
        metalness={0.3}
      />
      {showLabel && (
        <Html
          position={[side === 'left' ? -0.7 : 0.7, 0.6, 0]}
          center
          zIndexRange={[100, 0]}
        >
          <HoverLabel label={part.label} description={part.description} color={part.color} />
        </Html>
      )}
    </mesh>
  );
}

function CameraFocus({ focusStructure, groupRef }) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!focusStructure || !groupRef.current) return;

    let found = null;
    groupRef.current.traverse(obj => {
      if (found || !obj.isMesh) return;
      // FIX: userData.partKey is now reliably set via useEffect in Nucleotide
      if (obj.userData.partKey === focusStructure) found = obj;
    });

    if (found) {
      const worldPos = new THREE.Vector3();
      found.getWorldPosition(worldPos);
      targetLookAt.current.copy(worldPos);
    }
  }, [focusStructure, groupRef]);

  useFrame(() => {
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

function AutoRotate({ quizMode, groupRef }) {
  useFrame(() => {
    if (!quizMode || !groupRef.current) return;
    groupRef.current.rotation.y += 0.0015;
  });
  return null;
}

function DnaHelix({ scrollY, quizMode, activeStructure, setActiveStructure, focusStructure }) {
  const groupRef = useRef();
  const RUNGS = 20;
  const RADIUS = 1.25;
  const V_SPACING = 0.55;
  const TWIST = (2 * Math.PI) / 10;

  useFrame(() => {
    if (!groupRef.current) return;
    if (!quizMode) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = scrollY * 0.0015;
    }
  });

  const items = useMemo(() => Array.from({ length: RUNGS }, (_, i) => {
    const angle = i * TWIST;
    const y = (i - RUNGS / 2) * V_SPACING;
    const x1 = Math.cos(angle) * RADIUS;
    const z1 = Math.sin(angle) * RADIUS;
    const x2 = Math.cos(angle + Math.PI) * RADIUS;
    const z2 = Math.sin(angle + Math.PI) * RADIUS;
    return { i, angle, y, x1, z1, x2, z2 };
  }), []);

  return (
    <group ref={groupRef}>
      <AutoRotate quizMode={quizMode} groupRef={groupRef} />
      <CameraFocus focusStructure={focusStructure} groupRef={groupRef} />

      {items.map(({ i, angle, y, x1, z1, x2, z2 }) => (
        <group key={i}>
          <Nucleotide
            position={[x1, y, z1]}
            partIndex={i}
            side="left"
            quizMode={quizMode}
            activeStructure={activeStructure}
            setActiveStructure={setActiveStructure}
          />
          <Nucleotide
            position={[x2, y, z2]}
            partIndex={i + 3}
            side="right"
            quizMode={quizMode}
            activeStructure={activeStructure}
            setActiveStructure={setActiveStructure}
          />

          {/* Glowing bridge */}
          <mesh
            position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
            rotation={[0, -angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.03, 0.03, RADIUS * 2, 8]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* Backbone bead 1 */}
          <mesh position={[x1, y, z1]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1.0} />
          </mesh>

          {/* Backbone bead 2 */}
          <mesh position={[x2, y, z2]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={1.0} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function DnaScene({
  scrollY = 0,
  quizMode = false,
  activeStructure = null,
  setActiveStructure = null,
  focusStructure = null,
  height = '100%',
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      style={{ width: '100%', height, display: 'block' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 6, 6]} intensity={4} color="#38bdf8" />
      <pointLight position={[-4, -6, -4]} intensity={2} color="#c084fc" />
      <pointLight position={[2, -4, 6]} intensity={1.5} color="#34d399" />
      <DnaHelix
        scrollY={scrollY}
        quizMode={quizMode}
        activeStructure={activeStructure}
        setActiveStructure={setActiveStructure}
        focusStructure={focusStructure}
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        zoomSpeed={0.8}
        enableDamping
        dampingFactor={0.06}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
      />
    </Canvas>
  );
}

// — CHANGE LOG —
// [May 13, 2026] CREATED: DNA helix hero scene for landing page
// [May 18, 2026] UPDATED: Added quizMode, activeStructure, setActiveStructure, focusStructure props
// [May 18, 2026] FIXED: userData.partKey now set via useEffect ref — not JSX prop (JSX props dont set userData on meshes)
// [May 18, 2026] FIXED: enableZoom set to true with zoomSpeed + damping for normal page
// REASON: Quiz highlight wasnt working (traverse couldnt find meshes). Canvas too small and zoom disabled.
// — END CHANGE LOG —
