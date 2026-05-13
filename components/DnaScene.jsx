// ============================================================
// FILE: components/DnaScene.jsx
// PURPOSE: Interactive 3D DNA double helix — hero scene
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Main visual centrepiece of Learn World landing page
// ⚠️ DO NOT CHANGE: Must stay client component. onPointerOver handles both mouse and touch via R3F.
// ============================================================

'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';

const DNA_PARTS = [
  { label: 'Adenine (A)', description: 'Purine base — pairs with Thymine', color: '#ff6b9d' },
  { label: 'Thymine (T)', description: 'Pyrimidine — pairs with Adenine', color: '#ffd166' },
  { label: 'Guanine (G)', description: 'Purine base — pairs with Cytosine', color: '#06d6a0' },
  { label: 'Cytosine (C)', description: 'Pyrimidine — pairs with Guanine', color: '#63caff' },
  { label: 'Phosphate Group', description: 'Forms the DNA backbone', color: '#a78bfa' },
  { label: 'Deoxyribose Sugar', description: 'Sugar of the backbone', color: '#fb923c' },
];

function HoverLabel({ label, description, color }) {
  return (
    <div style={{
      background: 'rgba(2,8,23,0.85)',
      border: `1px solid ${color}55`,
      borderRadius: '10px',
      padding: '8px 12px',
      color: '#fff',
      minWidth: '160px',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 0 16px ${color}44`,
      pointerEvents: 'none',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ color, fontWeight: 700, fontSize: '13px', marginBottom: '3px' }}>{label}</div>
      <div style={{ color: '#94a3b8', fontSize: '11px' }}>{description}</div>
    </div>
  );
}

function Nucleotide({ position, partIndex, side }) {
  const [active, setActive] = useState(false);
  const meshRef = useRef();
  const part = DNA_PARTS[partIndex % DNA_PARTS.length];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        active ? 1.4 : 1 + Math.sin(Date.now() * 0.002 + partIndex) * 0.03
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setActive(true); }}
      onPointerOut={() => setActive(false)}
      onPointerDown={(e) => { e.stopPropagation(); setActive(true); }}
      onPointerUp={() => setActive(false)}
    >
      <sphereGeometry args={[0.22, 20, 20]} />
      <meshStandardMaterial
        color={part.color}
        emissive={part.color}
        emissiveIntensity={active ? 1.2 : 0.4}
        roughness={0.15}
        metalness={0.2}
      />
      {active && (
        <Html
          distanceFactor={8}
          position={[side === 'left' ? -0.5 : 0.5, 0.5, 0]}
          center
        >
          <HoverLabel label={part.label} description={part.description} color={part.color} />
        </Html>
      )}
    </mesh>
  );
}

function DnaHelix({ scrollY }) {
  const groupRef = useRef();
  const RUNGS = 22;
  const RADIUS = 1.3;
  const V_SPACING = 0.52;
  const TWIST = (2 * Math.PI) / 10;

  useFrame(() => {
    if (groupRef.current) {
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
      {items.map(({ i, angle, y, x1, z1, x2, z2 }) => (
        <group key={i}>
          {/* Left nucleotide */}
          <Nucleotide position={[x1, y, z1]} partIndex={i} side="left" />
          {/* Right nucleotide */}
          <Nucleotide position={[x2, y, z2]} partIndex={i + 3} side="right" />

          {/* Bridge connecting them */}
          <mesh
            position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
            rotation={[0, -angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.03, 0.03, RADIUS * 2, 8]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.6} />
          </mesh>

          {/* Backbone spheres */}
          <mesh position={[x1, y, z1]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[x2, y, z2]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.3} />
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
      style={{ background: 'transparent' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 6, 4]} intensity={2} color="#63caff" />
      <pointLight position={[-4, -6, -4]} intensity={1} color="#a78bfa" />
      <pointLight position={[0, 0, 6]} intensity={0.5} color="#ffffff" />
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
