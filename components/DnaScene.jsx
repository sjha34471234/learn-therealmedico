// ============================================================
// FILE: components/DnaScene.jsx
// PURPOSE: Interactive 3D DNA double helix — hero scene
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Main visual centrepiece of Learn World landing page
// ⚠️ DO NOT CHANGE: onPointerDown toggles label — works on both touch and mouse
// ============================================================

'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';

const DNA_PARTS = [
  { label: 'Adenine (A)', description: 'Purine base — pairs with Thymine', color: '#f472b6' },
  { label: 'Thymine (T)', description: 'Pyrimidine — pairs with Adenine', color: '#facc15' },
  { label: 'Guanine (G)', description: 'Purine base — pairs with Cytosine', color: '#34d399' },
  { label: 'Cytosine (C)', description: 'Pyrimidine — pairs with Guanine', color: '#38bdf8' },
  { label: 'Phosphate Group', description: 'Forms the DNA backbone', color: '#c084fc' },
  { label: 'Deoxyribose Sugar', description: 'Sugar component of the backbone', color: '#fb923c' },
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
    }}>
      <div style={{ color, fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

function Nucleotide({ position, partIndex, side }) {
  const [active, setActive] = useState(false);
  const meshRef = useRef();
  const part = DNA_PARTS[partIndex % DNA_PARTS.length];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const breathe = 1 + Math.sin(clock.elapsedTime * 1.8 + partIndex * 0.6) * 0.05;
    meshRef.current.scale.setScalar(active ? 1.5 : breathe);
    meshRef.current.material.emissiveIntensity = active ? 2.0 : 0.8;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => { e.stopPropagation(); setActive(v => !v); }}
    >
      <sphereGeometry args={[0.24, 28, 28]} />
      <meshStandardMaterial
        color={part.color}
        emissive={part.color}
        emissiveIntensity={0.8}
        roughness={0.05}
        metalness={0.3}
      />
      {active && (
        <Html
          distanceFactor={7}
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

function DnaHelix({ scrollY }) {
  const groupRef = useRef();
  const RUNGS = 20;
  const RADIUS = 1.25;
  const V_SPACING = 0.55;
  const TWIST = (2 * Math.PI) / 10;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.005;
    groupRef.current.rotation.x = scrollY * 0.0015;
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
      {items.map(({ i, angle, y, x1, z1, x2, z2 }) => (
        <group key={i}>
          <Nucleotide position={[x1, y, z1]} partIndex={i} side="left" />
          <Nucleotide position={[x2, y, z2]} partIndex={i + 3} side="right" />

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

export default function DnaScene({ scrollY }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 6, 6]} intensity={4} color="#38bdf8" />
      <pointLight position={[-4, -6, -4]} intensity={2} color="#c084fc" />
      <pointLight position={[2, -4, 6]} intensity={1.5} color="#34d399" />
      <DnaHelix scrollY={scrollY} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
      />
    </Canvas>
  );
}
