// ============================================================
// FILE: components/DnaScene.jsx
// PURPOSE: Interactive 3D DNA double helix — hero scene
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Main visual centrepiece of Learn World landing page
// ⚠️ DO NOT CHANGE: Must stay client component. onPointerDown handles touch on iPad.
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
  { label: 'Phosphate Group', description: 'Forms the DNA backbone', color: '#c084fc' },
  { label: 'Deoxyribose Sugar', description: 'Sugar component of the backbone', color: '#fb923c' },
];

function HoverLabel({ label, description, color }) {
  return (
    <div style={{
      background: 'rgba(2,8,23,0.92)',
      border: `1px solid ${color}66`,
      borderRadius: '10px',
      padding: '9px 14px',
      color: '#fff',
      minWidth: '165px',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 0 20px ${color}55`,
      pointerEvents: 'none',
      fontFamily: 'Inter, sans-serif',
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
    if (meshRef.current) {
      const breathe = 1 + Math.sin(clock.elapsedTime * 1.5 + partIndex * 0.5) * 0.04;
      meshRef.current.scale.setScalar(active ? 1.45 : breathe);
      meshRef.current.material.emissiveIntensity = active ? 1.6 : 0.65;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setActive(true); }}
      onPointerOut={() => setActive(false)}
      onPointerDown={(e) => { e.stopPropagation(); setActive(v => !v); }}
    >
      <sphereGeometry args={[0.23, 24, 24]} />
      <meshStandardMaterial
        color={part.color}
        emissive={part.color}
        emissiveIntensity={0.65}
        roughness={0.1}
        metalness={0.25}
      />
      {active && (
        <Html
          distanceFactor={8}
          position={[side === 'left' ? -0.6 : 0.6, 0.55, 0]}
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

  useFrame(({ clock }) => {
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
      {/* Dark backdrop to separate DNA from background */}
      <mesh position={[0, 0, -0.5]}>
        <cylinderGeometry args={[2.2, 2.2, RUNGS * V_SPACING + 1, 32]} />
        <meshStandardMaterial color="#020817" transparent opacity={0.55} />
      </mesh>

      {items.map(({ i, angle, y, x1, z1, x2, z2 }) => (
        <group key={i}>
          <Nucleotide position={[x1, y, z1]} partIndex={i} side="left" />
          <Nucleotide position={[x2, y, z2]} partIndex={i + 3} side="right" />

          {/* Bridge */}
          <mesh
            position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
            rotation={[0, -angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.035, 0.035, RADIUS * 2, 8]} />
            <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.3} roughness={0.5} />
          </mesh>

          {/* Backbone strand 1 */}
          <mesh position={[x1, y, z1]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.6} />
          </mesh>
          {/* Backbone strand 2 */}
          <mesh position={[x2, y, z2]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.6} />
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
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 5, 5]} intensity={3} color="#63caff" />
      <pointLight position={[-3, -5, -5]} intensity={1.5} color="#c084fc" />
      <pointLight position={[0, 0, 7]} intensity={1} color="#ffffff" />
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
