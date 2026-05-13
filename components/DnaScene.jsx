// ============================================================
// FILE: components/DnaScene.jsx
// PURPOSE: Interactive 3D DNA double helix — hero scene
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Main visual centrepiece of Learn World landing page
// ⚠️ DO NOT CHANGE: Must stay a client component (Three.js is browser-only)
// ============================================================

'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// — Label shown on hover —
function HoverLabel({ label, description }) {
  return (
    <div className="pointer-events-none px-3 py-2 rounded-lg text-sm font-sans"
      style={{
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid rgba(99,202,255,0.4)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        minWidth: '140px',
        boxShadow: '0 0 12px rgba(99,202,255,0.3)',
      }}>
      <div style={{ color: '#63caff', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{description}</div>
    </div>
  );
}

// — DNA part definitions —
const DNA_PARTS = [
  { label: 'Adenine (A)', description: 'A purine base — pairs with Thymine', color: '#ff6b9d' },
  { label: 'Thymine (T)', description: 'A pyrimidine base — pairs with Adenine', color: '#ffd166' },
  { label: 'Guanine (G)', description: 'A purine base — pairs with Cytosine', color: '#06d6a0' },
  { label: 'Cytosine (C)', description: 'A pyrimidine base — pairs with Guanine', color: '#63caff' },
  { label: 'Phosphate Group', description: 'Forms the backbone of the DNA strand', color: '#a78bfa' },
  { label: 'Deoxyribose Sugar', description: 'The sugar component of the backbone', color: '#fb923c' },
];

// — A single base pair rung —
function BasePair({ position, rotation, partIndex, scrollY }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const part = DNA_PARTS[partIndex % DNA_PARTS.length];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.25 : 1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Left nucleotide */}
      <mesh
        ref={meshRef}
        position={[-0.6, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={part.color}
          emissive={part.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.1}
        />
        {hovered && (
          <Html distanceFactor={6} position={[-0.4, 0.4, 0]}>
            <HoverLabel label={part.label} description={part.description} />
          </Html>
        )}
      </mesh>

      {/* Connecting bridge */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Right nucleotide */}
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={part.color}
          emissive={part.color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// — Backbone strand sphere —
function BackboneSphere({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.3} />
    </mesh>
  );
}

// — Full DNA helix —
function DnaHelix({ scrollY }) {
  const groupRef = useRef();
  const RUNGS = 18;
  const HELIX_RADIUS = 1.0;
  const VERTICAL_SPACING = 0.55;
  const TWIST_PER_RUNG = (2 * Math.PI) / 10;

  useFrame((state) => {
    if (groupRef.current) {
      // Auto-rotate
      groupRef.current.rotation.y += 0.004;
      // Scroll reaction — tilt slightly
      groupRef.current.rotation.x = scrollY * 0.002;
    }
  });

  const rungs = useMemo(() => {
    return Array.from({ length: RUNGS }, (_, i) => {
      const angle = i * TWIST_PER_RUNG;
      const y = (i - RUNGS / 2) * VERTICAL_SPACING;
      return { i, angle, y };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {rungs.map(({ i, angle, y }) => {
        const x1 = Math.cos(angle) * HELIX_RADIUS;
        const z1 = Math.sin(angle) * HELIX_RADIUS;
        const x2 = Math.cos(angle + Math.PI) * HELIX_RADIUS;
        const z2 = Math.sin(angle + Math.PI) * HELIX_RADIUS;

        return (
          <group key={i}>
            <BasePair
              position={[0, y, 0]}
              rotation={[0, angle, 0]}
              partIndex={i}
            />
            {/* Strand 1 backbone */}
            <BackboneSphere position={[x1, y, z1]} color="#a78bfa" />
            {/* Strand 2 backbone */}
            <BackboneSphere position={[x2, y, z2]} color="#fb923c" />
          </group>
        );
      })}
    </group>
  );
}

// — Main exported canvas —
export default function DnaScene({ scrollY }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#63caff" />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#a78bfa" />
      <DnaHelix scrollY={scrollY} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </Canvas>
  );
}
