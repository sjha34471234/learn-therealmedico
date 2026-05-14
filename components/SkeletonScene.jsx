// ============================================================
// FILE: components/SkeletonScene.jsx
// PURPOSE: Interactive 3D male skeleton with orbit controls and tap-to-label
// LAST CHANGED: May 15, 2026
// WHY IT EXISTS: Model page for /models/skeleton
// DO NOT CHANGE: Must stay a client component. Never import at top level.
//                Always use next/dynamic with ssr:false
// ============================================================

'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, Center, Bounds } from '@react-three/drei';

const BONE_LABELS = [
  // SKULL
  { id: 'frontal',    position: [0.36, 7.47, 0.8],  name: 'Frontal Bone',         desc: 'Forms the forehead and roof of the eye sockets. Contains the frontal sinuses.' },
  { id: 'parietal',   position: [0.00, 7.39, 0.5],  name: 'Parietal Bones',       desc: 'Two bones forming the top and sides of the skull. Meet at the sagittal suture.' },
  { id: 'temporal',   position: [1.81, 7.23, 0.4],  name: 'Temporal Bone',        desc: 'Houses the middle and inner ear structures. Contains the mastoid process.' },
  { id: 'occipital',  position: [0.00, 7.07, -0.3], name: 'Occipital Bone',       desc: 'Forms the back and base of the skull. Has the foramen magnum where spinal cord exits.' },
  { id: 'zygomatic',  position: [1.99, 6.99, 0.6],  name: 'Zygomatic Bone',       desc: 'The cheekbone. Forms the prominence of the cheek and part of the eye socket.' },
  { id: 'nasal',      position: [0.54, 7.18, 0.9],  name: 'Nasal Bones',          desc: 'Two small bones forming the bridge of the nose.' },
  { id: 'mandible',   position: [0.36, 6.75, 0.8],  name: 'Mandible',             desc: 'The lower jaw — the only movable bone of the skull. Contains the lower teeth.' },
  // SPINE
  { id: 'atlas',      position: [0.00, 6.43, 0.3],  name: 'C1 - Atlas',           desc: 'First cervical vertebra. Supports the skull. Allows the nodding (yes) movement.' },
  { id: 'axis',       position: [0.00, 6.20, 0.3],  name: 'C2 - Axis',            desc: 'Second cervical vertebra. Has the odontoid peg (dens). Allows rotation (no movement).' },
  { id: 'c7',         position: [0.00, 5.96, 0.3],  name: 'C7 - Vertebra Prominens', desc: 'Last cervical vertebra. Its spinous process is easily felt at base of neck.' },
  { id: 'thoracic',   position: [0.00, 5.08, -0.2], name: 'Thoracic Spine (T1-T12)', desc: '12 vertebrae of the mid-back. Each articulates with a pair of ribs.' },
  { id: 'lumbar',     position: [0.00, 3.81, -0.2], name: 'Lumbar Spine (L1-L5)', desc: '5 large vertebrae of the lower back. Bear most body weight. Common site of disc herniation.' },
  { id: 'sacrum',     position: [0.00, 2.86, -0.2], name: 'Sacrum',               desc: '5 fused vertebrae forming a triangular bone. Connects spine to pelvis via SI joints.' },
  { id: 'coccyx',     position: [0.00, 2.46, -0.2], name: 'Coccyx',               desc: 'The tailbone. 3-5 fused vertebrae. Attachment point for pelvic floor muscles.' },
  // THORAX
  { id: 'manubrium',  position: [0.36, 5.72, 0.8],  name: 'Manubrium',            desc: 'Upper part of the sternum. Articulates with clavicles and first two ribs.' },
  { id: 'sternum',    position: [0.18, 5.24, 0.9],  name: 'Sternum Body',         desc: 'Middle part of the breastbone. Attaches ribs 2-7 via costal cartilages.' },
  { id: 'xiphoid',    position: [0.18, 4.77, 0.8],  name: 'Xiphoid Process',      desc: 'Lowest part of sternum. Landmark for CPR hand placement.' },
  { id: 'rib1',       position: [1.81, 5.64, 0.5],  name: 'Rib 1 (True Rib)',     desc: 'First rib — attached directly to sternum via costal cartilage.' },
  { id: 'rib6',       position: [2.35, 5.08, 0.4],  name: 'Ribs 2-7 (True Ribs)', desc: 'Directly attached to sternum. Form the main protective cage for heart and lungs.' },
  { id: 'rib12',      position: [1.99, 4.37, 0.2],  name: 'Ribs 11-12 (Floating)', desc: 'Have no anterior attachment. Only connected to thoracic vertebrae posteriorly.' },
  // SHOULDER GIRDLE
  { id: 'clavicle',   position: [2.53, 5.88, 0.6],  name: 'Clavicle',             desc: 'The collarbone. Only bony connection between arm and axial skeleton. Most fractured bone.' },
  { id: 'acromion',   position: [3.62, 5.80, 0.3],  name: 'Acromion',             desc: 'Bony projection of the scapula. Forms the tip of the shoulder. Site of AC joint.' },
  { id: 'scapula',    position: [3.08, 5.64, -0.2], name: 'Scapula',              desc: 'The shoulder blade. Connects humerus to clavicle. Has glenoid cavity for shoulder joint.' },
  // ARM
  { id: 'humerus_h',  position: [3.80, 5.64, 0.3],  name: 'Humeral Head',         desc: 'Ball of the shoulder joint. Articulates with glenoid cavity of scapula.' },
  { id: 'humerus',    position: [4.16, 4.61, 0.2],  name: 'Humerus',              desc: 'Upper arm bone. Greater and lesser tubercles attach rotator cuff muscles.' },
  { id: 'olecranon',  position: [3.80, 3.50, -0.2], name: 'Olecranon (Ulna)',     desc: 'The elbow point. Bony prominence felt when you bend your elbow.' },
  { id: 'radius',     position: [4.34, 2.70, 0.3],  name: 'Radius',               desc: 'Lateral forearm bone. Rotates around ulna to pronate and supinate the hand.' },
  { id: 'ulna',       position: [3.98, 2.70, 0.1],  name: 'Ulna',                 desc: 'Medial forearm bone. Forms the stable hinge of the elbow joint.' },
  { id: 'wrist',      position: [4.34, 1.75, 0.4],  name: 'Carpal Bones',         desc: '8 small bones forming the wrist. Scaphoid is most commonly fractured in wrist injuries.' },
  { id: 'metacarpal', position: [4.34, 1.19, 0.4],  name: 'Metacarpals and Phalanges', desc: '5 metacarpals form the palm. 14 phalanges form the fingers (3 per finger, 2 for thumb).' },
  // PELVIS
  { id: 'iliac',      position: [2.71, 3.50, 0.3],  name: 'Iliac Crest',          desc: 'Upper rim of the ilium. Landmark for bone marrow biopsy and intramuscular injections.' },
  { id: 'asis',       position: [2.53, 3.18, 0.7],  name: 'ASIS',                 desc: 'Anterior Superior Iliac Spine. Important bony landmark for clinical measurements.' },
  { id: 'pubis',      position: [0.36, 2.54, 0.8],  name: 'Pubic Symphysis',      desc: 'Cartilaginous joint joining the two pubic bones. Widens during childbirth.' },
  { id: 'ischium',    position: [1.99, 2.22, 0.2],  name: 'Ischium',              desc: 'Lower and back part of pelvis. The ischial tuberosities bear weight when sitting.' },
  // LEG
  { id: 'femur_h',    position: [1.99, 2.86, 0.4],  name: 'Femoral Head',         desc: 'Ball of hip joint. Common fracture site in elderly with osteoporosis.' },
  { id: 'femur',      position: [1.81, 0.95, 0.3],  name: 'Femur',                desc: 'Longest strongest bone in body. Greater trochanter is palpable on outer thigh.' },
  { id: 'patella',    position: [1.99, -0.95, 0.9], name: 'Patella',              desc: 'Kneecap. Largest sesamoid bone. Improves leverage of quadriceps muscle.' },
  { id: 'fibula_h',   position: [2.35, -0.98, 0.3], name: 'Fibula Head',          desc: 'Head of fibula at the knee. Common peroneal nerve wraps around it here.' },
  { id: 'tibia',      position: [1.81, -2.54, 0.5], name: 'Tibia',                desc: 'The shin bone. Main weight-bearing bone of lower leg. Anterior border is subcutaneous.' },
  { id: 'fibula',     position: [2.24, -2.70, 0.3], name: 'Fibula',               desc: 'Lateral lower leg bone. Not weight-bearing. Lateral malleolus is the outer ankle bump.' },
  { id: 'med_mall',   position: [1.63, -4.61, 0.6], name: 'Medial Malleolus',     desc: 'Inner ankle bump. Distal end of tibia. Part of the ankle mortise joint.' },
  { id: 'lat_mall',   position: [2.24, -4.69, 0.3], name: 'Lateral Malleolus',    desc: 'Outer ankle bump. Distal end of fibula. Extends lower than medial malleolus.' },
  { id: 'calcaneus',  position: [1.45, -5.40, 0.3], name: 'Calcaneus',            desc: 'The heel bone. Largest tarsal bone. Achilles tendon attaches to its posterior surface.' },
  { id: 'tarsals',    position: [1.27, -6.20, 0.5], name: 'Tarsal Bones',         desc: '7 tarsal bones forming the ankle and back of foot. Talus sits on calcaneus.' },
  { id: 'metatarsal', position: [1.27, -6.67, 0.6], name: 'Metatarsals and Phalanges', desc: '5 metatarsals form the mid-foot. 14 phalanges form the toes. Big toe has 2 phalanges.' },
];

function SkeletonModel({ activeLabel, setActiveLabel }) {
  const { scene } = useGLTF('/models/Human_male_skeleton.glb');
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

        {BONE_LABELS.map((bone) => (
          <mesh
            key={bone.id}
            position={bone.position}
            onPointerDown={(e) => {
              e.stopPropagation();
              setActiveLabel(activeLabel === bone.id ? null : bone.id);
            }}
          >
            <sphereGeometry args={[0.18, 14, 14]} />
            <meshStandardMaterial
              color={activeLabel === bone.id ? '#00ffcc' : '#ffffff'}
              emissive={activeLabel === bone.id ? '#00ffcc' : '#88aaff'}
              emissiveIntensity={activeLabel === bone.id ? 1.5 : 0.6}
              transparent
              opacity={activeLabel === bone.id ? 1.0 : 0.7}
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
                  width: '210px',
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
  );
}

export default function SkeletonScene() {
  const [activeLabel, setActiveLabel] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e) => e.preventDefault();
    el.addEventListener('selectstart', prevent);
    return () => el.removeEventListener('selectstart', prevent);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '78vh',
        borderRadius: '16px',
        overflow: 'hidden',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        cursor: 'grab',
      }}
    >
      <Canvas
        camera={{ position: [0, -2, 40], fov: 80 }}
        onPointerMissed={() => setActiveLabel(null)}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} />
        <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#6688ff" />
        <pointLight position={[0, 10, 5]} intensity={0.6} color="#ffffff" />

        <Bounds fit clip observe margin={1.15}>
          <SkeletonModel activeLabel={activeLabel} setActiveLabel={setActiveLabel} />
        </Bounds>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.06}
          zoomSpeed={0.8}
          rotateSpeed={0.6}
          zoomToCursor={true}
          minDistance={5}
          maxDistance={35}
          minPolarAngle={Math.PI * 0.05}
          maxPolarAngle={Math.PI * 0.95}
        />
      </Canvas>
    </div>
  );
}
