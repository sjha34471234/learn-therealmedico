// ============================================================
// FILE: components/SkeletonScene.jsx
// PURPOSE: Interactive 3D male skeleton with orbit controls and tap-to-label
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Model page for /models/skeleton
// ⚠️ DO NOT CHANGE: Must stay a client component. Never import at top level — always use next/dynamic with ssr:false
// ============================================================

'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, Center, Bounds } from '@react-three/drei';

const BONE_LABELS = [
  { id: 'skull',    position: [0, 1.65, 0.05],   name: 'Skull (Cranium)',  desc: '22 bones protect the brain and form the face.' },
  { id: 'clavicle', position: [0.22, 1.25, 0.05], name: 'Clavicle',        desc: 'The collarbone — connects shoulder to sternum.' },
  { id: 'sternum',  position: [0, 1.15, 0.1],    name: 'Sternum',          desc: 'Breastbone — anchors the ribs at the front.' },
  { id: 'humerus',  position: [0.42, 1.05, 0],   name: 'Humerus',          desc: 'Upper arm bone — joins shoulder to elbow.' },
  { id: 'spine',    position: [0, 1.0, -0.08],   name: 'Vertebral Column', desc: '33 vertebrae — supports the body and protects the spinal cord.' },
  { id: 'pelvis',   position: [0, 0.65, 0.05],   name: 'Pelvis',           desc: 'Hip bones — supports the trunk and connects to the legs.' },
  { id: 'femur',    position: [0.18, 0.35, 0],   name: 'Femur',            desc: 'Longest bone in the body — the thigh bone.' },
  { id: 'tibia',    position: [0.18, -0.1, 0.03], name: 'Tibia',           desc: 'Shin bone — main weight-bearing bone of the lower leg.' },
  { id: 'fibula',   position: [0.22, -0.1, 0],   name: 'Fibula',           desc: 'Slender bone running alongside the tibia.' },
  { id: 'radius',   position: [0.45, 0.72, 0.05], name: 'Radius',          desc: 'Lateral forearm bone — rotates to turn the palm.' },
];

function SkeletonModel({ activeLabel, setActiveLabel }) {
  const { scene } = useGLTF('/models/Human_male_skeleton.glb');
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} />

        {BONE_LABELS.map((bone) => (
          <mesh
            key={bone.id}
            position={bone.position}
            onPointerDown={(e) => {
              e.stopPropagation();
              setActiveLabel(activeLabel === bone.id ? null : bone.id);
            }}
          >
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial
              color={activeLabel === bone.id ? '#00ffcc' : '#ffffff'}
              emissive={activeLabel === bone.id ? '#00ffcc' : '#aaaaaa'}
              emissiveIntensity={activeLabel === bone.id ? 1.2 : 0.4}
              transparent
              opacity={0.85}
            />

            {activeLabel === bone.id && (
              <Html distanceFactor={4} center>
                <div style={{
                  background: 'rgba(0,0,0,0.82)',
                  border: '1px solid #00ffcc',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  maxWidth: '190px',
                  pointerEvents: 'none',
                  boxShadow: '0 0 18px rgba(0,255,204,0.3)',
                }}>
                  <div style={{ color: '#00ffcc', fontWeight: 700, marginBottom: 4 }}>
                    {bone.name}
                  </div>
                  <div style={{ color: '#ccc', lineHeight: 1.5 }}>
                    {bone.desc}
                  </div>
                </div>
              </Html>
            )}
          </mesh>
        ))}
      </group>
    </Center>
  );
}

export default function SkeletonScene() {
  const [activeLabel, setActiveLabel] = useState(null);

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        onPointerMissed={() => setActiveLabel(null)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} />
        <pointLight position={[-3, 2, -2]} intensity={0.5} color="#4444ff" />

        <Bounds fit clip observe margin={1.2}>
          <SkeletonModel activeLabel={activeLabel} setActiveLabel={setActiveLabel} />
        </Bounds>

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
        />
      </Canvas>
    </div>
  );
}
