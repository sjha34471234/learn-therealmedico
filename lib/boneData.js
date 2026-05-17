// ============================================================
// FILE: lib/boneData.js
// PURPOSE: Single source of truth for all skeleton bone data
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: BONE_INFO lived in SkeletonScene.jsx and BONE_CATALOG lived
//   in app/models/skeleton/page.js. Two files, same data, high drift risk.
//   Both now import from here.
// DEPENDENCIES: None — pure data, no React
// ⚠️ DO NOT CHANGE:
//   - Keys must exactly match GLTF mesh node names — do not rename
//   - 'l talus_beige_0' and 'l calcaneus_beige_0' use a space, not underscore — matches GLTF
//   - 'l navicular_beige_0' and 'l cuboid_beige_0' also use space — same reason
//   - BONE_CATALOG keys must be a subset of BONE_INFO keys
// ============================================================

export const BONE_INFO = {
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

export const BONE_CATALOG = [
  {
    region: 'Skull',
    bones: [
      { key: 'Cranium_beige_0', name: 'Cranium', facts: ['Made of 8 fused bones that protect the brain', 'The skull of a newborn has soft spots called fontanelles that close by age 2'] },
      { key: 'Mandible_beige_0', name: 'Mandible', facts: ['The only movable bone in the entire skull', 'It is the strongest and largest bone of the face'] },
      { key: 'hyoid_beige_0', name: 'Hyoid Bone', facts: ['The only bone in the body that does not articulate with any other bone', 'It plays a key role in swallowing and speaking'] },
    ],
  },
  {
    region: 'Spine',
    bones: [
      { key: 'c1_beige_0', name: 'C1 — Atlas', facts: ['Named after the Greek titan who held up the world, as it holds the skull', 'It has no vertebral body — unique among all vertebrae'] },
      { key: 'c2_beige_0', name: 'C2 — Axis', facts: ['Has a peg-like projection called the dens (odontoid process)', 'Allows the head to rotate left and right — the "no" movement'] },
      { key: 'c7_beige_0', name: 'C7 — Vertebra Prominens', facts: ['Has the longest spinous process of all cervical vertebrae', 'You can feel it as the prominent bump at the base of your neck'] },
      { key: 'l3_beige_0', name: 'L3 Vertebra', facts: ['Lumbar punctures (spinal taps) are most commonly done at L3-L4', 'The lumbar vertebrae are the largest in the spine to bear body weight'] },
      { key: 'l4_beige_0', name: 'L4 Vertebra', facts: ['Sits at the level of the iliac crests — used as a landmark in clinical practice', 'The L4-L5 disc is one of the most common sites for disc herniation'] },
      { key: 'Sacrum_beige_0', name: 'Sacrum', facts: ['Formed by 5 vertebrae that fuse together between ages 16 and 26', 'The word sacrum comes from Latin meaning "sacred bone"'] },
      { key: 'Coccyx_beige_0', name: 'Coccyx', facts: ['The human tailbone is a remnant of our evolutionary ancestors tail', 'It serves as an attachment point for several pelvic floor muscles'] },
    ],
  },
  {
    region: 'Ribcage',
    bones: [
      { key: 'Sternum_beige_0', name: 'Sternum', facts: ['CPR compressions are applied to the lower half of the sternum', 'Bone marrow can be harvested from the sternum via sternal puncture'] },
      { key: 'l_rib1_beige_0', name: 'Rib 1', facts: ['The shortest and most curved of all the ribs', 'It is the most commonly fractured rib during difficult childbirth'] },
      { key: 'l_rib7_beige_0', name: 'Rib 7', facts: ['The last of the true ribs — it attaches directly to the sternum', 'Ribs 1 through 7 are called true ribs due to their direct sternal attachment'] },
      { key: 'l_rib11_beige_0', name: 'Rib 11', facts: ['A floating rib — it has no anterior attachment at all', 'Floating ribs protect the kidneys at the back of the body'] },
    ],
  },
  {
    region: 'Shoulder & Arms',
    bones: [
      { key: 'l_clavicle_beige_0', name: 'Clavicle', facts: ['The most commonly fractured bone in the human body', 'It is the only horizontal long bone in the body'] },
      { key: 'l_scapula_beige_0', name: 'Scapula', facts: ['Held in place entirely by muscles — it has no bony joint at the ribcage', 'The glenoid cavity of the scapula forms the socket of the shoulder joint'] },
      { key: 'l_humerus_beige_0', name: 'Humerus', facts: ['The surgical neck of the humerus is a common fracture site in elderly patients', 'The radial nerve runs in a groove along the shaft — fractures here can cause wrist drop'] },
      { key: 'l_radius_beige_0', name: 'Radius', facts: ['A Colles fracture of the distal radius is the most common fracture in patients over 50', 'It is the bone that rotates when you flip your palm up or down'] },
      { key: 'l_ulna_beige_0', name: 'Ulna', facts: ['The olecranon process of the ulna is what you feel as the point of your elbow', 'It forms the stable hinge part of the elbow joint'] },
      { key: 'l_scaphoid_beige_0', name: 'Scaphoid', facts: ['The most commonly fractured carpal bone — often from falling on an outstretched hand', 'It has a poor blood supply, making fractures prone to avascular necrosis if missed'] },
    ],
  },
  {
    region: 'Pelvis & Legs',
    bones: [
      { key: 'l_oscoxa_beige_0', name: 'Os Coxa (Hip Bone)', facts: ['Formed by the fusion of three bones: ilium, ischium, and pubis', 'The acetabulum, where all three meet, forms the socket for the femoral head'] },
      { key: 'l_femur_beige_0', name: 'Femur', facts: ['The longest and strongest bone in the entire human body', 'A fractured femoral neck in elderly patients carries a mortality rate of up to 30% within one year'] },
      { key: 'l_patella_beige_0', name: 'Patella', facts: ['The largest sesamoid bone in the body — embedded within the quadriceps tendon', 'It increases the mechanical advantage of the quadriceps by up to 50%'] },
      { key: 'l_tibia_beige_0', name: 'Tibia', facts: ['The second largest bone in the body after the femur', 'The tibial tuberosity is where the patellar tendon attaches — it can become inflamed in growing teenagers (Osgood-Schlatter disease)'] },
      { key: 'l_fibula_beige_0', name: 'Fibula', facts: ['Despite running alongside the tibia, it bears almost no body weight', 'The lateral malleolus of the fibula forms the outer bump of your ankle'] },
      { key: 'r_calcaneus_beige_0', name: 'Calcaneus (Heel)', facts: ['The largest tarsal bone in the foot', 'The Achilles tendon — the strongest tendon in the body — attaches here'] },
    ],
  },
];

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Extracted from components/SkeletonScene.jsx (BONE_INFO)
//   and app/models/skeleton/page.js (BONE_CATALOG)
// REASON: Single source of truth. Add/edit bones here, both files benefit.
// --- END CHANGE LOG ---
