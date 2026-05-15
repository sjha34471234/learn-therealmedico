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
  // SKULL - midline X=0, slight Z forward
  { id: 'frontal',    position: [ 0.0,  7.60,  0.5], name: 'Frontal Bone',              desc: 'Forms the forehead and roof of the eye sockets. Contains the frontal sinuses.' },
  { id: 'parietal',   position: [ 0.0,  7.50,  0.0], name: 'Parietal Bones',            desc: 'Two bones forming the top and sides of the skull. Meet at the sagittal suture.' },
  { id: 'temporal',   position: [ 1.20,  7.20,  0.2], name: 'Temporal Bone',            desc: 'Houses the middle and inner ear. Contains the mastoid process.' },
  { id: 'occipital',  position: [ 0.0,  7.00, -0.6], name: 'Occipital Bone',            desc: 'Back and base of skull. Has the foramen magnum where the spinal cord exits.' },
  { id: 'zygomatic',  position: [ 1.30,  6.95,  0.5], name: 'Zygomatic (Cheekbone)',    desc: 'Forms the cheek prominence and part of the eye socket floor.' },
  { id: 'nasal',      position: [ 0.30,  7.15,  0.7], name: 'Nasal Bones',              desc: 'Two small bones forming the bridge of the nose.' },
  { id: 'mandible',   position: [ 0.20,  6.65,  0.6], name: 'Mandible (Lower Jaw)',     desc: 'Only movable skull bone. Contains lower teeth. Site of the TMJ joint.' },
  // SPINE - strictly midline X=0
  { id: 'atlas',      position: [ 0.0,  6.30,  0.1], name: 'C1 - Atlas',                desc: 'Supports the skull. Allows the yes nodding movement.' },
  { id: 'axis',       position: [ 0.0,  6.05,  0.1], name: 'C2 - Axis',                 desc: 'Has the odontoid peg (dens). Allows the no rotation movement.' },
  { id: 'c7',         position: [ 0.0,  5.80,  0.0], name: 'C7 - Vertebra Prominens',   desc: 'Easily felt spinous process at the base of the neck.' },
  { id: 'thoracic',   position: [ 0.0,  4.80, -0.2], name: 'Thoracic Spine (T1-T12)',   desc: '12 vertebrae of mid-back. Each articulates with a pair of ribs.' },
  { id: 'lumbar',     position: [ 0.0,  3.40, -0.2], name: 'Lumbar Spine (L1-L5)',      desc: '5 large vertebrae of lower back. Common site of disc herniation.' },
  { id: 'sacrum',     position: [ 0.0,  2.50, -0.2], name: 'Sacrum',                    desc: '5 fused vertebrae. Connects spine to pelvis via SI joints.' },
  { id: 'coccyx',     position: [ 0.0,  2.10, -0.2], name: 'Coccyx (Tailbone)',         desc: '3-5 fused vertebrae. Attachment for pelvic floor muscles.' },
  // STERNUM - midline
  { id: 'manubrium',  position: [ 0.0,  5.55,  0.7], name: 'Manubrium',                 desc: 'Upper sternum. Articulates with clavicles and first two ribs.' },
  { id: 'sternum',    position: [ 0.0,  5.00,  0.7], name: 'Sternum Body',              desc: 'Middle breastbone. Attaches ribs 2-7 via costal cartilages.' },
  { id: 'xiphoid',    position: [ 0.0,  4.55,  0.6], name: 'Xiphoid Process',           desc: 'Lowest sternum. CPR hand placement landmark.' },
  // RIBS - right side, X ~2.0
  { id: 'rib_true',   position: [ 1.90,  5.15,  0.3], name: 'True Ribs (1-7)',          desc: 'Directly attached to sternum via costal cartilage.' },
  { id: 'rib_false',  position: [ 2.00,  4.60,  0.1], name: 'False Ribs (8-10)',        desc: 'Attach to rib 7 cartilage, not directly to sternum.' },
  { id: 'rib_float',  position: [ 1.80,  4.10,  0.0], name: 'Floating Ribs (11-12)',    desc: 'No anterior attachment. Only connect to thoracic vertebrae.' },
  // SHOULDER RIGHT - X ~3.0
  { id: 'clavicle',   position: [ 1.60,  5.75,  0.4], name: 'Clavicle',                 desc: 'Collarbone. Only bony link between arm and axial skeleton. Most fractured bone.' },
  { id: 'acromion',   position: [ 2.80,  5.65,  0.0], name: 'Acromion',                 desc: 'Tip of the shoulder. Forms the AC joint with the clavicle.' },
  { id: 'scapula',    position: [ 2.40,  5.30, -0.5], name: 'Scapula (Shoulder Blade)', desc: 'Connects humerus to clavicle. Glenoid cavity forms the shoulder socket.' },
  // ARM RIGHT
  { id: 'humerus_h',  position: [ 3.00,  5.55,  0.0], name: 'Humeral Head',             desc: 'Ball of the shoulder joint. Sits in the glenoid cavity of scapula.' },
  { id: 'humerus',    position: [ 2.80,  4.30,  0.0], name: 'Humerus',                  desc: 'Upper arm bone. Greater tubercle attaches rotator cuff muscles.' },
  { id: 'olecranon',  position: [ 2.60,  3.30, -0.3], name: 'Olecranon',                desc: 'The elbow point. Proximal end of the ulna.' },
  { id: 'radius',     position: [ 2.70,  2.55,  0.2], name: 'Radius',                   desc: 'Lateral forearm bone. Rotates to pronate and supinate the hand.' },
  { id: 'ulna',       position: [ 2.50,  2.45,  0.0], name: 'Ulna',                     desc: 'Medial forearm bone. Forms the stable hinge of the elbow.' },
  { id: 'carpals',    position: [ 2.60,  1.55,  0.2], name: 'Carpal Bones (Wrist)',      desc: '8 small wrist bones. Scaphoid is most commonly fractured in falls.' },
  { id: 'hand',       position: [ 2.50,  0.90,  0.2], name: 'Metacarpals and Phalanges', desc: '5 metacarpals form the palm. 14 phalanges form the fingers.' },
  // PELVIS
  { id: 'iliac',      position: [ 1.60,  3.30,  0.2], name: 'Iliac Crest',              desc: 'Upper rim of ilium. Landmark for IM injections and bone marrow biopsy.' },
  { id: 'asis',       position: [ 1.50,  3.00,  0.5], name: 'ASIS',                     desc: 'Anterior Superior Iliac Spine. Key clinical landmark for measurements.' },
  { id: 'pubis',      position: [ 0.20,  2.35,  0.6], name: 'Pubic Symphysis',          desc: 'Joint between pubic bones. Widens slightly during childbirth.' },
  { id: 'ischium',    position: [ 1.00,  2.00,  0.0], name: 'Ischium',                  desc: 'Lower pelvis. Ischial tuberosities bear your weight when sitting.' },
  // LEG RIGHT
  { id: 'femur_h',    position: [ 1.30,  2.65,  0.2], name: 'Femoral Head',             desc: 'Ball of the hip joint. Common fracture site in elderly osteoporosis.' },
  { id: 'femur',      position: [ 0.90,  0.80,  0.1], name: 'Femur (Thigh Bone)',       desc: 'Longest strongest bone in the body. Greater trochanter palpable on outer thigh.' },
  { id: 'patella',    position: [ 0.80, -0.80,  0.7], name: 'Patella (Kneecap)',        desc: 'Largest sesamoid bone. Improves leverage of the quadriceps muscle.' },
  { id: 'fibula_h',   position: [ 1.00, -0.90,  0.2], name: 'Fibula Head',              desc: 'Proximal fibula at the knee. Common peroneal nerve wraps around here.' },
  { id: 'tibia',      position: [ 0.75, -2.40,  0.3], name: 'Tibia (Shin Bone)',        desc: 'Main weight-bearing bone of lower leg. Subcutaneous anterior border.' },
  { id: 'fibula',     position: [ 1.00, -2.55,  0.1], name: 'Fibula',                   desc: 'Lateral lower leg. Not weight-bearing. Forms the outer ankle bump.' },
  { id: 'med_mall',   position: [ 0.55, -4.40,  0.4], name: 'Medial Malleolus',         desc: 'Inner ankle bump. Distal end of tibia. Part of the ankle mortise.' },
  { id: 'lat_mall',   position: [ 0.95, -4.50,  0.1], name: 'Lateral Malleolus',        desc: 'Outer ankle bump. Distal fibula. Sits lower than medial malleolus.' },
  { id: 'calcaneus',  position: [ 0.60, -5.20, -0.2], name: 'Calcaneus (Heel Bone)',    desc: 'Largest tarsal bone. Achilles tendon attaches posteriorly.' },
  { id: 'tarsals',    position: [ 0.50, -5.90,  0.3], name: 'Tarsal Bones',             desc: '7 bones of ankle and back foot. Talus connects leg to foot.' },
  { id: 'metatarsal', position: [ 0.40, -6.50,  0.3], name: 'Metatarsals and Phalanges', desc: '5 metatarsals form mid-foot. 14 phalanges form the toes.' },
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
        height: '500px',
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

        <Bounds fit clip observe margin={0.75}>
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
