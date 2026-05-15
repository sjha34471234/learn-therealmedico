// ============================================================
// FILE: components/SkeletonScene.jsx
// PURPOSE: Interactive 3D skeleton - click actual bones to label them
// LAST CHANGED: May 16, 2026
// WHY IT EXISTS: Model page for /models/skeleton
// DO NOT CHANGE: Must stay a client component. Never import at top level.
//                Always use next/dynamic with ssr:false
//                useGLTF MUST stay inside SkeletonModel (inside Canvas). Never move it up.
// ============================================================

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';

const BONE_INFO = {
  'Cranium_beige_0':           { name: 'Cranium', desc: '8 fused bones protecting the brain. Includes frontal, parietal, temporal, occipital, sphenoid, and ethmoid bones.' },
  'Mandible_beige_0':          { name: 'Mandible', desc: 'The lower jaw. Only movable bone of the skull. Contains the lower teeth and forms the TMJ joint.' },
  'hyoid_beige_0':             { name: 'Hyoid Bone', desc: 'U-shaped bone in the neck. Only bone not articulating with any other. Supports the tongue and aids swallowing.' },
  'c1_beige_0':                { name: 'C1 - Atlas', desc: 'First cervical vertebra. Supports the skull. Allows the nodding yes movement. Has no vertebral body.' },
  'c2_beige_0':                { name: 'C2 - Axis', desc: 'Second cervical vertebra. Has the odontoid process (dens). Allows the no rotation movement.' },
  'c3_beige_0':                { name: 'C3 Vertebra', desc: 'Third cervical vertebra. Nerve root C3 supplies sensation to the neck.' },
  'c4_beige_0':                { name: 'C4 Vertebra', desc: 'Fourth cervical vertebra. C4 nerve root innervates the diaphragm via the phrenic nerve.' },
  'c5_beige_0':                { name: 'C5 Vertebra', desc: 'Fifth cervical vertebra. C5 nerve root supplies the deltoid and biceps muscles.' },
  'c6_beige_0':                { name: 'C6 Vertebra', desc: 'Sixth cervical vertebra. C6 nerve root supplies the wrist extensors.' },
  'c7_beige_0':                { name: 'C7 - Vertebra Prominens', desc: 'Seventh cervical vertebra. Its long spinous process is easily felt at the base of the neck.' },
  't1_beige_0':                { name: 'T1 Vertebra', desc: 'First thoracic vertebra. Articulates with the first rib.' },
  't2_beige_0':                { name: 'T2 Vertebra', desc: 'Second thoracic vertebra.' },
  't3_beige_0':                { name: 'T3 Vertebra', desc: 'Third thoracic vertebra.' },
  't4_beige_0':                { name: 'T4 Vertebra', desc: 'Fourth thoracic vertebra. At the level of the sternal angle (angle of Louis).' },
  't5_beige_0':                { name: 'T5 Vertebra', desc: 'Fifth thoracic vertebra.' },
  't6_beige_0':                { name: 'T6 Vertebra', desc: 'Sixth thoracic vertebra.' },
  't7_beige_0':                { name: 'T7 Vertebra', desc: 'Seventh thoracic vertebra.' },
  't8_beige_0':                { name: 'T8 Vertebra', desc: 'Eighth thoracic vertebra. At level of inferior angle of the scapula.' },
  't9_beige_0':                { name: 'T9 Vertebra', desc: 'Ninth thoracic vertebra.' },
  't10_beige_0':               { name: 'T10 Vertebra', desc: 'Tenth thoracic vertebra.' },
  't11_beige_0':               { name: 'T11 Vertebra', desc: 'Eleventh thoracic vertebra. Articulates with floating rib 11.' },
  't12_beige_0':               { name: 'T12 Vertebra', desc: 'Twelfth thoracic vertebra. Articulates with floating rib 12.' },
  'l1_beige_0':                { name: 'L1 Vertebra', desc: 'First lumbar vertebra. The spinal cord ends here as the conus medullaris.' },
  'l2_beige_0':                { name: 'L2 Vertebra', desc: 'Second lumbar vertebra.' },
  'l3_beige_0':                { name: 'L3 Vertebra', desc: 'Third lumbar vertebra. Lumbar puncture commonly performed at L3-L4.' },
  'l4_beige_0':                { name: 'L4 Vertebra', desc: 'Fourth lumbar vertebra. At the level of the iliac crests (Tuffier line).' },
  'l5_beige_0':                { name: 'L5 Vertebra', desc: 'Fifth lumbar vertebra. Most commonly affected in disc herniation.' },
  'Sacrum_beige_0':            { name: 'Sacrum', desc: '5 fused vertebrae forming a triangular bone. Connects the spine to the pelvis via the sacroiliac joints.' },
  'Coccyx_beige_0':            { name: 'Coccyx', desc: 'The tailbone. 3-5 fused vertebrae. Attachment for pelvic floor muscles and gluteus maximus.' },
  'Sternum_beige_0':           { name: 'Sternum', desc: 'The breastbone. Three parts: manubrium, body, xiphoid process. Connects ribs 1-7 anteriorly.' },
  'Xiphoid process_beige_0':   { name: 'Xiphoid Process', desc: 'Inferior tip of sternum. Landmark for CPR hand placement. Ossifies in adulthood.' },
  'l_rib1_beige_0':            { name: 'Rib 1 (Left)', desc: 'First rib. Shortest and most curved. True rib - attaches directly to sternum.' },
  'r_rib1_beige_0':            { name: 'Rib 1 (Right)', desc: 'First rib. Shortest and most curved. True rib - attaches directly to sternum.' },
  'l_rib2_beige_0':            { name: 'Rib 2 (Left)', desc: 'Second rib. True rib. Attaches at the sternal angle.' },
  'r_rib2_beige_0':            { name: 'Rib 2 (Right)', desc: 'Second rib. True rib. Attaches at the sternal angle.' },
  'l_rib3_beige_0':            { name: 'Rib 3 (Left)', desc: 'Third rib. True rib.' },
  'r_rib3_beige_0':            { name: 'Rib 3 (Right)', desc: 'Third rib. True rib.' },
  'l_rib4_beige_0':            { name: 'Rib 4 (Left)', desc: 'Fourth rib. True rib.' },
  'r_rib4_beige_0':            { name: 'Rib 4 (Right)', desc: 'Fourth rib. True rib.' },
  'l_rib5_beige_0':            { name: 'Rib 5 (Left)', desc: 'Fifth rib. True rib.' },
  'r_rib5_beige_0':            { name: 'Rib 5 (Right)', desc: 'Fifth rib. True rib.' },
  'l_rib6_beige_0':            { name: 'Rib 6 (Left)', desc: 'Sixth rib. True rib.' },
  'r_rib6_beige_0':            { name: 'Rib 6 (Right)', desc: 'Sixth rib. True rib.' },
  'l_rib7_beige_0':            { name: 'Rib 7 (Left)', desc: 'Seventh rib. Last true rib. Attaches directly to sternum.' },
  'r_rib7_beige_0':            { name: 'Rib 7 (Right)', desc: 'Seventh rib. Last true rib. Attaches directly to sternum.' },
  'l_rib8_beige_0':            { name: 'Rib 8 (Left)', desc: 'Eighth rib. False rib - attaches to rib 7 cartilage, not sternum.' },
  'r_rib8_beige_0':            { name: 'Rib 8 (Right)', desc: 'Eighth rib. False rib - attaches to rib 7 cartilage, not sternum.' },
  'l_rib9_beige_0':            { name: 'Rib 9 (Left)', desc: 'Ninth rib. False rib.' },
  'r_rib9_beige_0':            { name: 'Rib 9 (Right)', desc: 'Ninth rib. False rib.' },
  'l_rib10_beige_0':           { name: 'Rib 10 (Left)', desc: 'Tenth rib. False rib.' },
  'r_rib10_beige_0':           { name: 'Rib 10 (Right)', desc: 'Tenth rib. False rib.' },
  'l_rib11_beige_0':           { name: 'Rib 11 (Left)', desc: 'Eleventh rib. Floating rib - no anterior attachment.' },
  'r_rib11_beige_0':           { name: 'Rib 11 (Right)', desc: 'Eleventh rib. Floating rib - no anterior attachment.' },
  'l_rib12_beige_0':           { name: 'Rib 12 (Left)', desc: 'Twelfth rib. Floating rib. Shortest rib.' },
  'r_rib12_beige_0':           { name: 'Rib 12 (Right)', desc: 'Twelfth rib. Floating rib. Shortest rib.' },
  'l_clavicle_beige_0':        { name: 'Clavicle (Left)', desc: 'The collarbone. Only bony connection between the arm and axial skeleton. Most commonly fractured bone.' },
  'r_clavicle_beige_0':        { name: 'Clavicle (Right)', desc: 'The collarbone. Only bony connection between the arm and axial skeleton. Most commonly fractured bone.' },
  'l_scapula_beige_0':         { name: 'Scapula (Left)', desc: 'The shoulder blade. Connects the humerus to the clavicle. The glenoid cavity forms the shoulder socket.' },
  'r_scapula_beige_0':         { name: 'Scapula (Right)', desc: 'The shoulder blade. Connects the humerus to the clavicle. The glenoid cavity forms the shoulder socket.' },
  'l_humerus_beige_0':         { name: 'Humerus (Left)', desc: 'Upper arm bone. Greater and lesser tubercles attach the rotator cuff muscles.' },
  'r_humerus_beige_0':         { name: 'Humerus (Right)', desc: 'Upper arm bone. Greater and lesser tubercles attach the rotator cuff muscles.' },
  'l_radius_beige_0':          { name: 'Radius (Left)', desc: 'Lateral forearm bone. Rotates to pronate and supinate the hand. Distal end is common fracture site (Colles fracture).' },
  'r_radius_beige_0':          { name: 'Radius (Right)', desc: 'Lateral forearm bone. Rotates to pronate and supinate the hand. Distal end is common fracture site (Colles fracture).' },
  'l_ulna_beige_0':            { name: 'Ulna (Left)', desc: 'Medial forearm bone. The olecranon process forms the elbow point. Forms the stable hinge of the elbow joint.' },
  'r_ulna_beige_0':            { name: 'Ulna (Right)', desc: 'Medial forearm bone. The olecranon process forms the elbow point. Forms the stable hinge of the elbow joint.' },
  'l_scaphoid_beige_0':        { name: 'Scaphoid (Left)', desc: 'Most commonly fractured carpal bone. Often missed on X-ray. Poor blood supply risks avascular necrosis.' },
  'r_scaphoid_beige_0':        { name: 'Scaphoid (Right)', desc: 'Most commonly fractured carpal bone. Often missed on X-ray. Poor blood supply risks avascular necrosis.' },
  'l_lunate_beige_0':          { name: 'Lunate (Left)', desc: 'Moon-shaped carpal. Most commonly dislocated carpal bone. Can compress the median nerve.' },
  'r_lunate_beige_0':          { name: 'Lunate (Right)', desc: 'Moon-shaped carpal. Most commonly dislocated carpal bone. Can compress the median nerve.' },
  'l_triquetral_beige_0':      { name: 'Triquetral (Left)', desc: 'Three-sided carpal bone on the ulnar side of the wrist.' },
  'r_triquetral_beige_0':      { name: 'Triquetral (Right)', desc: 'Three-sided carpal bone on the ulnar side of the wrist.' },
  'l_pisiform_beige_0':        { name: 'Pisiform (Left)', desc: 'Pea-shaped sesamoid bone. Smallest carpal bone. Sits on the triquetral.' },
  'r_pisiform_beige_0':        { name: 'Pisiform (Right)', desc: 'Pea-shaped sesamoid bone. Smallest carpal bone. Sits on the triquetral.' },
  'l_trapezium_beige_0':       { name: 'Trapezium (Left)', desc: 'Carpal bone at the base of the thumb. Forms the saddle joint of the thumb.' },
  'r_trapezium_beige_0':       { name: 'Trapezium (Right)', desc: 'Carpal bone at the base of the thumb. Forms the saddle joint of the thumb.' },
  'l_trapezoid_beige_0':       { name: 'Trapezoid (Left)', desc: 'Smallest bone in the distal carpal row.' },
  'r_trapezoid_beige_0':       { name: 'Trapezoid (Right)', desc: 'Smallest bone in the distal carpal row.' },
  'l_capitate_beige_0':        { name: 'Capitate (Left)', desc: 'Largest carpal bone. Central position in the wrist.' },
  'r_capitate_beige_0':        { name: 'Capitate (Right)', desc: 'Largest carpal bone. Central position in the wrist.' },
  'l_hamate_beige_0':          { name: 'Hamate (Left)', desc: 'Hook-shaped carpal bone. The hook of hamate can fracture in racquet sports.' },
  'r_hamate_beige_0':          { name: 'Hamate (Right)', desc: 'Hook-shaped carpal bone. The hook of hamate can fracture in racquet sports.' },
  'l_oscoxa_beige_0':          { name: 'Os Coxa (Left)', desc: 'The hip bone. Formed by fusion of ilium, ischium, and pubis. The acetabulum is where all three meet.' },
  'r_oscoxa_beige_0':          { name: 'Os Coxa (Right)', desc: 'The hip bone. Formed by fusion of ilium, ischium, and pubis. The acetabulum is where all three meet.' },
  'l_femur_beige_0':           { name: 'Femur (Left)', desc: 'Thigh bone. Longest and strongest bone in the body. Femoral neck is common fracture site in elderly.' },
  'r_femur_beige_0':           { name: 'Femur (Right)', desc: 'Thigh bone. Longest and strongest bone in the body. Femoral neck is common fracture site in elderly.' },
  'l_patella_beige_0':         { name: 'Patella (Left)', desc: 'Kneecap. Largest sesamoid bone. Improves mechanical leverage of the quadriceps muscle.' },
  'r_patella_beige_0':         { name: 'Patella (Right)', desc: 'Kneecap. Largest sesamoid bone. Improves mechanical leverage of the quadriceps muscle.' },
  'l_tibia_beige_0':           { name: 'Tibia (Left)', desc: 'Shin bone. Main weight-bearing bone of lower leg. Medial malleolus forms the inner ankle bump.' },
  'r_tibia_beige_0':           { name: 'Tibia (Right)', desc: 'Shin bone. Main weight-bearing bone of lower leg. Medial malleolus forms the inner ankle bump.' },
  'l_fibula_beige_0':          { name: 'Fibula (Left)', desc: 'Slender lateral lower leg bone. Not weight-bearing. Lateral malleolus forms the outer ankle bump.' },
  'r_fibula_beige_0':          { name: 'Fibula (Right)', desc: 'Slender lateral lower leg bone. Not weight-bearing. Lateral malleolus forms the outer ankle bump.' },
  'l talus_beige_0':           { name: 'Talus (Left)', desc: 'Ankle bone connecting the leg to the foot. Sits on the calcaneus.' },
  'r_talus_beige_0':           { name: 'Talus (Right)', desc: 'Ankle bone connecting the leg to the foot. Sits on the calcaneus.' },
  'l calcaneus_beige_0':       { name: 'Calcaneus (Left)', desc: 'Heel bone. Largest tarsal bone. The Achilles tendon attaches to its posterior surface.' },
  'r_calcaneus_beige_0':       { name: 'Calcaneus (Right)', desc: 'Heel bone. Largest tarsal bone. The Achilles tendon attaches to its posterior surface.' },
  'l navicular_beige_0':       { name: 'Navicular (Left)', desc: 'Boat-shaped tarsal bone on the medial side of the foot.' },
  'r_navicular_beige_0':       { name: 'Navicular (Right)', desc: 'Boat-shaped tarsal bone on the medial side of the foot.' },
  'l cuboid_beige_0':          { name: 'Cuboid (Left)', desc: 'Cube-shaped tarsal bone on the lateral side of the foot.' },
  'r_cuboid_beige_0':          { name: 'Cuboid (Right)', desc: 'Cube-shaped tarsal bone on the lateral side of the foot.' },
};

const HIGHLIGHT_COLOR = '#00ffcc';
const NORMAL_COLOR = '#c8b89a';
const HOVER_COLOR = '#e8d4b0';

// This component lives INSIDE Canvas — safe to call useGLTF here
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

// Separate component to apply highlight colors — reads scene after load
function BoneHighlighter({ activeBone, hoveredBone }) {
  const { scene } = useGLTF('/models/scene.gltf');

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const name = obj.name;
      const isActive = activeBone === name;
      const isHovered = hoveredBone === name;
      if (obj.material) {
        obj.material = obj.material.clone();
        obj.material.color.set(isActive ? HIGHLIGHT_COLOR : isHovered ? HOVER_COLOR : NORMAL_COLOR);
        obj.material.emissive.set(isActive ? HIGHLIGHT_COLOR : isHovered ? HOVER_COLOR : '#000000');
        obj.material.emissiveIntensity = isActive ? 0.4 : isHovered ? 0.15 : 0;
        obj.material.roughness = 0.6;
        obj.material.metalness = 0.1;
      }
    });
  }, [activeBone, hoveredBone, scene]);

  return null;
}

// Label popup — shown as HTML overlay when a bone is active
function BoneLabel({ activeBone }) {
  const { scene } = useGLTF('/models/scene.gltf');

  if (!activeBone || !BONE_INFO[activeBone]) return null;

  let targetObj = null;
  scene.traverse((obj) => {
    if (obj.name === activeBone) targetObj = obj;
  });

  if (!targetObj) return null;

  return (
    <Html object={targetObj} center distanceFactor={180} style={{ pointerEvents: 'none' }}>
      <div style={{
        background: 'rgba(2, 8, 23, 0.95)',
        border: '1px solid #00ffcc',
        borderRadius: '12px',
        padding: '12px 16px',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        width: '220px',
        pointerEvents: 'none',
        boxShadow: '0 0 24px rgba(0,255,204,0.3)',
        userSelect: 'none',
      }}>
        <div style={{ color: '#00ffcc', fontWeight: 700, marginBottom: 6, fontSize: '14px' }}>
          {BONE_INFO[activeBone].name}
        </div>
        <div style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '12px' }}>
          {BONE_INFO[activeBone].desc}
        </div>
      </div>
    </Html>
  );
}

export default function SkeletonScene() {
  const [activeBone, setActiveBone] = useState(null);
  const [hoveredBone, setHoveredBone] = useState(null);
  const containerRef = useRef(null);

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
        camera={{ position: [0, 0, 300], fov: 45 }}
        onPointerMissed={handleMissed}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[100, 200, 100]} intensity={1.4} />
        <directionalLight position={[-100, 50, -100]} intensity={0.5} color="#aaccff" />
        <pointLight position={[0, 200, 100]} intensity={0.6} />

        <SkeletonModel
          activeBone={activeBone}
          setActiveBone={setActiveBone}
          hoveredBone={hoveredBone}
          setHoveredBone={setHoveredBone}
        />
        <BoneHighlighter activeBone={activeBone} hoveredBone={hoveredBone} />
        <BoneLabel activeBone={activeBone} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.06}
          zoomSpeed={0.8}
          rotateSpeed={0.6}
          zoomToCursor={true}
          minDistance={50}
          maxDistance={600}
        />
      </Canvas>
    </div>
  );
}
