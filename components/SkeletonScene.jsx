// ============================================================
// FILE: components/SkeletonScene.jsx
// PURPOSE: Interactive 3D male skeleton with orbit controls and tap-to-label
// LAST CHANGED: May 14, 2026 — Accurate bone positions from GLB bounding box analysis,
//               smooth scroll/zoom, no text selection, min/max zoom locked
// WHY IT EXISTS: Model page for /models/skeleton
// ⚠️ DO NOT CHANGE: Must stay a client component. Never import at top level
//                   always use next/dynamic with ssr:false
// ============================================================

'use client';


import { useRef, useState, useEffect } from ‘react’;
import { Canvas, useFrame } from ‘@react-three/fiber’;
import { useGLTF, OrbitControls, Html, Center, Bounds } from ‘@react-three/drei’;

// Positions calculated from actual GLB bounding box + rotation matrix
// Model total height: 15.89 units. Y=0 is the geometric center.
// Skull top ≈ Y+7.8, Feet ≈ Y-15.6 (model is not symmetric — legs are long)
const BONE_LABELS = [
{
id: ‘skull’,
position: [0, 7.15, 0.8],
name: ‘Skull (Cranium)’,
desc: ‘22 bones fused together. Protects the brain and forms the face. The only movable bone is the mandible (jaw).’,
},
{
id: ‘cervical’,
position: [0.8, 5.6, 0.2],
name: ‘Cervical Spine (C1–C7)’,
desc: ‘7 vertebrae forming the neck. C1 (atlas) and C2 (axis) allow head rotation and nodding.’,
},
{
id: ‘clavicle’,
position: [1.8, 5.1, 0.6],
name: ‘Clavicle’,
desc: ‘The collarbone. Connects the shoulder blade to the sternum. Most commonly fractured bone.’,
},
{
id: ‘sternum’,
position: [0, 4.5, 1.2],
name: ‘Sternum’,
desc: ‘The breastbone. Anchors the ribs at the front of the chest. Has 3 parts: manubrium, body, xiphoid.’,
},
{
id: ‘ribs’,
position: [2.2, 3.6, 0.5],
name: ‘Rib Cage’,
desc: ‘12 pairs of ribs. Protects the heart and lungs. Ribs 11–12 are “floating” — not attached to sternum.’,
},
{
id: ‘humerus’,
position: [3.0, 3.2, 0],
name: ‘Humerus’,
desc: ‘The upper arm bone. Ball-and-socket joint at shoulder, hinge joint at elbow.’,
},
{
id: ‘lumbar’,
position: [0.8, 1.3, -0.3],
name: ‘Lumbar Spine (L1–L5)’,
desc: ‘5 large vertebrae of the lower back. Bears most of the body weight. Common site of back pain.’,
},
{
id: ‘radius’,
position: [3.2, 0.5, 0.3],
name: ‘Radius & Ulna’,
desc: ‘Two forearm bones. The radius rotates to pronate/supinate the hand. The ulna forms the elbow point.’,
},
{
id: ‘pelvis’,
position: [0, -1.5, 0.8],
name: ‘Pelvis’,
desc: ‘Formed by ilium, ischium, and pubis. Transfers body weight to legs. Male pelvis is narrower than female.’,
},
{
id: ‘femur’,
position: [1.2, -4.4, 0.3],
name: ‘Femur’,
desc: ‘The thigh bone — longest and strongest bone in the body. Its neck is a common fracture site in elderly.’,
},
{
id: ‘patella’,
position: [1.4, -6.5, 1.0],
name: ‘Patella’,
desc: ‘The kneecap. A sesamoid bone embedded in the quadriceps tendon. Protects the knee joint.’,
},
{
id: ‘tibia’,
position: [0.8, -9.2, 0.5],
name: ‘Tibia’,
desc: ‘The shin bone — main weight-bearing bone of the lower leg. Medial malleolus forms the inner ankle bump.’,
},
{
id: ‘fibula’,
position: [1.8, -9.5, 0.2],
name: ‘Fibula’,
desc: ‘Slender bone alongside the tibia. Not weight-bearing. Lateral malleolus forms the outer ankle bump.’,
},
];

function SkeletonModel({ activeLabel, setActiveLabel }) {
const { scene } = useGLTF(’/models/Human_male_skeleton.glb’);
const groupRef = useRef();

useFrame((_, delta) => {
if (groupRef.current) {
groupRef.current.rotation.y += delta * 0.12;
}
});

return (
<Center>
<group ref={groupRef}>
<primitive object={scene} />

```
    {BONE_LABELS.map((bone) => (
      <mesh
        key={bone.id}
        position={bone.position}
        onPointerDown={(e) => {
          e.stopPropagation();
          setActiveLabel(activeLabel === bone.id ? null : bone.id);
        }}
      >
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial
          color={activeLabel === bone.id ? '#00ffcc' : '#ffffff'}
          emissive={activeLabel === bone.id ? '#00ffcc' : '#88aaff'}
          emissiveIntensity={activeLabel === bone.id ? 1.5 : 0.6}
          transparent
          opacity={activeLabel === bone.id ? 1.0 : 0.75}
        />

        {activeLabel === bone.id && (
          <Html distanceFactor={22} center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(2, 8, 23, 0.95)',
              border: '1px solid #00ffcc',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              width: '200px',
              pointerEvents: 'none',
              boxShadow: '0 0 24px rgba(0,255,204,0.25)',
              userSelect: 'none',
            }}>
              <div style={{ color: '#00ffcc', fontWeight: 700, marginBottom: 6, fontSize: '14px' }}>
                {bone.name}
              </div>
              <div style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '12px' }}>
                {bone.desc}
              </div>
            </div>
          </Html>
        )}
      </mesh>
    ))}
  </group>
</Center>
```

);
}

export default function SkeletonScene() {
const [activeLabel, setActiveLabel] = useState(null);
const containerRef = useRef(null);

// Prevent text selection on drag inside canvas
useEffect(() => {
const el = containerRef.current;
if (!el) return;
const prevent = (e) => e.preventDefault();
el.addEventListener(‘selectstart’, prevent);
return () => el.removeEventListener(‘selectstart’, prevent);
}, []);

return (
<div
ref={containerRef}
style={{
width: ‘100%’,
height: ‘78vh’,
borderRadius: ‘16px’,
overflow: ‘hidden’,
// touchAction none = gives full control to Three.js on touch
touchAction: ‘none’,
// Prevents blue highlight on tap (iOS)
WebkitTapHighlightColor: ‘transparent’,
userSelect: ‘none’,
cursor: ‘grab’,
}}
>
<Canvas
camera={{ position: [0, -2, 40], fov: 80 }}
onPointerMissed={() => setActiveLabel(null)}
gl={{ antialias: true, alpha: true }}
style={{ background: ‘transparent’ }}
>
<ambientLight intensity={0.9} />
<directionalLight position={[4, 6, 4]} intensity={1.3} castShadow />
<directionalLight position={[-4, 2, -2]} intensity={0.4} color=”#6688ff” />
<pointLight position={[0, 10, 5]} intensity={0.6} color=”#ffffff” />

```
    <Bounds fit clip observe margin={1.15}>
      <SkeletonModel activeLabel={activeLabel} setActiveLabel={setActiveLabel} />
    </Bounds>

    <OrbitControls
      enablePan={false}
      enableZoom={true}
      enableDamping={true}        // Smooth inertia on all movement
      dampingFactor={0.06}        // Lower = more feather-like glide
      zoomSpeed={0.8}             // Gentle zoom
      rotateSpeed={0.6}           // Smooth rotation
      zoomToCursor={true}         // Zoom follows cursor/pinch point
      minDistance={15}            // Can't zoom in too close
      maxDistance={60}            // Can't zoom out too far
      minPolarAngle={Math.PI * 0.05}
      maxPolarAngle={Math.PI * 0.95}
    />
  </Canvas>
</div>
```

);
}
