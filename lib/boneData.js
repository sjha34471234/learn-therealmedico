// ============================================================
// FILE: lib/boneData.js
// PURPOSE: Single source of truth for all skeleton bone data
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: BONE_INFO lived in SkeletonScene.jsx and BONE_CATALOG lived
//   in app/models/skeleton/page.js — duplicated keys, high risk of drift.
//   Both components need the same data so it lives here.
// DEPENDENCIES: None — pure data, no React imports
// ⚠️ DO NOT CHANGE:
//   - Keys in BONE_INFO must exactly match GLTF mesh node names
//   - Keys in BONE_CATALOG must exactly match BONE_INFO keys
//   - Bilateral bones use l_/r_ prefix: l_femur_beige_0
//   - Some left bones use space not underscore: 'l talus_beige_0' — do not fix, it matches the GLTF
// ============================================================

export const BONE_INFO = {
  Cranium_beige_0: { name: 'Cranium', description: 'The dome-shaped upper skull that houses and protects the brain. Formed by 8 fused bones in adults.' },
  mandible_beige_0: { name: 'Mandible', description: 'The lower jawbone — the only movable bone of the skull. Holds the lower teeth and forms the chin.' },
  Teeth_beige_0: { name: 'Teeth', description: 'Adults have 32 permanent teeth including incisors, canines, premolars, and molars for cutting and grinding food.' },
  Cervical_vertebrae_beige_0: { name: 'Cervical Vertebrae', description: 'The 7 neck vertebrae (C1–C7). C1 (Atlas) supports the skull, C2 (Axis) allows rotation of the head.' },
  Thoracic_vertebrae_beige_0: { name: 'Thoracic Vertebrae', description: '12 vertebrae of the mid-back (T1–T12). Each articulates with a pair of ribs, forming the posterior rib cage.' },
  Lumbar_vertebrae_beige_0: { name: 'Lumbar Vertebrae', description: '5 large vertebrae of the lower back (L1–L5). Bear most of the body\'s weight and allow flexion and extension.' },
  Sacrum_beige_0: { name: 'Sacrum', description: 'A triangular bone formed by 5 fused sacral vertebrae. Forms the posterior wall of the pelvis.' },
  Coccyx_beige_0: { name: 'Coccyx', description: 'The tailbone — 3 to 5 fused vertebrae at the base of the spine. Vestigial remnant of a tail.' },
  Sternum_beige_0: { name: 'Sternum', description: 'The breastbone — flat bone in the centre of the chest. Connects to ribs via costal cartilage.' },
  Ribs_beige_0: { name: 'Ribs', description: '12 pairs of curved bones forming the rib cage. Protect the heart and lungs and assist in breathing.' },
  l_clavicle_beige_0: { name: 'Left Clavicle', description: 'The collarbone — connects the sternum to the shoulder. Most commonly fractured bone in the upper body.' },
  r_clavicle_beige_0: { name: 'Right Clavicle', description: 'The collarbone — connects the sternum to the shoulder. Most commonly fractured bone in the upper body.' },
  l_scapula_beige_0: { name: 'Left Scapula', description: 'The shoulder blade — triangular flat bone at the back of the shoulder. Anchor for 17 muscles.' },
  r_scapula_beige_0: { name: 'Right Scapula', description: 'The shoulder blade — triangular flat bone at the back of the shoulder. Anchor for 17 muscles.' },
  l_humerus_beige_0: { name: 'Left Humerus', description: 'The upper arm bone. Articulates with the scapula at the shoulder and the radius and ulna at the elbow.' },
  r_humerus_beige_0: { name: 'Right Humerus', description: 'The upper arm bone. Articulates with the scapula at the shoulder and the radius and ulna at the elbow.' },
  l_radius_beige_0: { name: 'Left Radius', description: 'Lateral forearm bone (thumb side). Rotates around the ulna to pronate and supinate the hand.' },
  r_radius_beige_0: { name: 'Right Radius', description: 'Lateral forearm bone (thumb side). Rotates around the ulna to pronate and supinate the hand.' },
  l_ulna_beige_0: { name: 'Left Ulna', description: 'Medial forearm bone (little finger side). Forms the point of the elbow (olecranon process).' },
  r_ulna_beige_0: { name: 'Right Ulna', description: 'Medial forearm bone (little finger side). Forms the point of the elbow (olecranon process).' },
  l_hand_beige_0: { name: 'Left Hand', description: '27 bones including 8 carpals, 5 metacarpals, and 14 phalanges. The most dexterous structure in the body.' },
  r_hand_beige_0: { name: 'Right Hand', description: '27 bones including 8 carpals, 5 metacarpals, and 14 phalanges. The most dexterous structure in the body.' },
  Pelvis_beige_0: { name: 'Pelvis', description: 'Basin-shaped bony structure formed by the two hip bones, sacrum, and coccyx. Supports abdominal organs.' },
  l_femur_beige_0: { name: 'Left Femur', description: 'The thigh bone — longest and strongest bone in the body. Extends from the hip to the knee.' },
  r_femur_beige_0: { name: 'Right Femur', description: 'The thigh bone — longest and strongest bone in the body. Extends from the hip to the knee.' },
  l_patella_beige_0: { name: 'Left Patella', description: 'The kneecap — a sesamoid bone embedded in the quadriceps tendon. Protects the knee joint.' },
  r_patella_beige_0: { name: 'Right Patella', description: 'The kneecap — a sesamoid bone embedded in the quadriceps tendon. Protects the knee joint.' },
  l_tibia_beige_0: { name: 'Left Tibia', description: 'The shin bone — medial and larger of the two lower leg bones. Bears 90% of the body\'s weight.' },
  r_tibia_beige_0: { name: 'Right Tibia', description: 'The shin bone — medial and larger of the two lower leg bones. Bears 90% of the body\'s weight.' },
  l_fibula_beige_0: { name: 'Left Fibula', description: 'The slender lateral lower leg bone. Primarily a muscle attachment site — bears little weight.' },
  r_fibula_beige_0: { name: 'Right Fibula', description: 'The slender lateral lower leg bone. Primarily a muscle attachment site — bears little weight.' },
  'l talus_beige_0': { name: 'Left Talus', description: 'The ankle bone that connects the leg to the foot. Bears the entire weight of the body when standing.' },
  'r talus_beige_0': { name: 'Right Talus', description: 'The ankle bone that connects the leg to the foot. Bears the entire weight of the body when standing.' },
  'l calcaneus_beige_0': { name: 'Left Calcaneus', description: 'The heel bone — largest bone of the foot. Absorbs the impact of walking and running.' },
  'r calcaneus_beige_0': { name: 'Right Calcaneus', description: 'The heel bone — largest bone of the foot. Absorbs the impact of walking and running.' },
  l_foot_beige_0: { name: 'Left Foot', description: '26 bones including tarsals, metatarsals, and phalanges. Acts as a spring and lever during locomotion.' },
  r_foot_beige_0: { name: 'Right Foot', description: '26 bones including tarsals, metatarsals, and phalanges. Acts as a spring and lever during locomotion.' },
};

export const BONE_CATALOG = [
  {
    region: 'Skull',
    bones: [
      {
        key: 'Cranium_beige_0',
        name: 'Cranium',
        facts: [
          'The adult cranium is made of 8 bones fused together at joints called sutures.',
          'A newborn\'s skull has soft spots called fontanelles — gaps that allow the brain to grow rapidly in the first year of life.',
        ],
      },
      {
        key: 'mandible_beige_0',
        name: 'Mandible',
        facts: [
          'The mandible is the only bone in the skull that moves — it allows you to chew, speak, and yawn.',
          'It is the strongest and largest bone of the face, and the last bone of the skull to fully fuse, completing around age 16.',
        ],
      },
      {
        key: 'Teeth_beige_0',
        name: 'Teeth',
        facts: [
          'Teeth are not technically bones — they are made of enamel (the hardest substance in the human body) and dentine.',
          'Adults have 32 permanent teeth. Wisdom teeth are the last to erupt, usually between ages 17 and 25.',
        ],
      },
    ],
  },
  {
    region: 'Spine',
    bones: [
      {
        key: 'Cervical_vertebrae_beige_0',
        name: 'Cervical Vertebrae',
        facts: [
          'C1 is called the Atlas — named after the Greek Titan who held up the world, because it holds up your skull.',
          'C2 is called the Axis — it has a peg-like projection called the dens that the Atlas rotates around, allowing you to shake your head "no".',
        ],
      },
      {
        key: 'Thoracic_vertebrae_beige_0',
        name: 'Thoracic Vertebrae',
        facts: [
          'Each of the 12 thoracic vertebrae articulates with a pair of ribs, making this the only spinal region directly attached to the rib cage.',
          'Thoracic vertebrae have the least range of motion of any spinal region — the rib cage limits movement to protect the heart and lungs.',
        ],
      },
      {
        key: 'Lumbar_vertebrae_beige_0',
        name: 'Lumbar Vertebrae',
        facts: [
          'The lumbar vertebrae are the largest and strongest in the spine — they bear the full weight of the upper body.',
          'L4 and L5 are the most common sites for a herniated disc, often causing the pain known as sciatica.',
        ],
      },
      {
        key: 'Sacrum_beige_0',
        name: 'Sacrum',
        facts: [
          'The sacrum starts as 5 separate vertebrae and fuses completely by your mid-twenties.',
          'It forms the back wall of the pelvis and transmits the weight of the spine to the hip bones.',
        ],
      },
      {
        key: 'Coccyx_beige_0',
        name: 'Coccyx',
        facts: [
          'The coccyx is the remnant of a tail from our evolutionary ancestors — it serves as an attachment point for several pelvic floor muscles.',
          'Falling directly onto it (known as a coccyx fracture) is notoriously painful and takes months to heal because you sit on it constantly.',
        ],
      },
    ],
  },
  {
    region: 'Ribcage',
    bones: [
      {
        key: 'Sternum_beige_0',
        name: 'Sternum',
        facts: [
          'The sternum has three parts: the manubrium (top), body (middle), and xiphoid process (bottom tip).',
          'The angle where the manubrium meets the body — called the sternal angle or angle of Louis — is a key clinical landmark for counting ribs.',
        ],
      },
      {
        key: 'Ribs_beige_0',
        name: 'Ribs',
        facts: [
          'Ribs 1–7 are "true ribs" — they connect directly to the sternum. Ribs 8–10 connect via shared cartilage. Ribs 11–12 are "floating ribs" with no anterior attachment.',
          'The rib cage expands roughly 2–3 cm during each breath, accommodating the inflation of the lungs.',
        ],
      },
    ],
  },
  {
    region: 'Shoulder & Arms',
    bones: [
      {
        key: 'l_clavicle_beige_0',
        name: 'Clavicle',
        facts: [
          'The clavicle is the most commonly fractured bone in the body — it acts as a crumple zone to protect the shoulder joint.',
          'It is the first bone to begin ossifying in the fetus (around week 5) and the last to fully mature (around age 25).',
        ],
      },
      {
        key: 'l_scapula_beige_0',
        name: 'Scapula',
        facts: [
          'The scapula is a free-floating bone — it has no direct joint with the rib cage, held in place entirely by 17 muscles.',
          'The glenoid cavity of the scapula is the socket of the shoulder joint — it is notably shallow, which is why shoulders dislocate more than any other joint.',
        ],
      },
      {
        key: 'l_humerus_beige_0',
        name: 'Humerus',
        facts: [
          'The radial nerve wraps around the shaft of the humerus in the spiral groove — fractures here commonly cause wrist drop.',
          'The surgical neck of the humerus (just below the head) is a common fracture site in elderly patients after a fall.',
        ],
      },
      {
        key: 'l_radius_beige_0',
        name: 'Radius',
        facts: [
          'A Colles fracture — the most common wrist fracture — occurs at the distal end of the radius after a fall on an outstretched hand.',
          'The radius rotates around the ulna during pronation and supination — the movements that flip your palm face-down or face-up.',
        ],
      },
      {
        key: 'l_ulna_beige_0',
        name: 'Ulna',
        facts: [
          'The prominent bump at the back of your elbow — what you rest on a table — is the olecranon, the top of the ulna.',
          'The "funny bone" sensation is caused by the ulnar nerve passing through the cubital tunnel at the medial epicondyle of the humerus, right next to the ulna.',
        ],
      },
      {
        key: 'l_hand_beige_0',
        name: 'Hand',
        facts: [
          'The hand has 27 bones — 8 carpals in the wrist, 5 metacarpals in the palm, and 14 phalanges in the fingers.',
          'The thumb has 2 phalanges while each finger has 3 — the thumb\'s unique saddle joint is what gives humans the precision grip.',
        ],
      },
    ],
  },
  {
    region: 'Pelvis & Legs',
    bones: [
      {
        key: 'Pelvis_beige_0',
        name: 'Pelvis',
        facts: [
          'The female pelvis is wider and shallower than the male pelvis — an adaptation for childbirth that widens the birth canal.',
          'The pelvis transfers the entire weight of the upper body from the spine to the legs via the sacroiliac joints.',
        ],
      },
      {
        key: 'l_femur_beige_0',
        name: 'Femur',
        facts: [
          'The femur is the longest bone in the body and one of the strongest — it can withstand forces up to 30 times body weight.',
          'A hip fracture (typically at the femoral neck) is a life-threatening injury in the elderly — 20–30% of patients do not survive beyond a year.',
        ],
      },
      {
        key: 'l_patella_beige_0',
        name: 'Patella',
        facts: [
          'The patella is a sesamoid bone — a bone that develops inside a tendon (the quadriceps tendon) to improve mechanical advantage.',
          'It increases the leverage of the quadriceps muscle, allowing you to extend the knee with about 30% more force than without it.',
        ],
      },
      {
        key: 'l_tibia_beige_0',
        name: 'Tibia',
        facts: [
          'The tibia bears about 90% of the body\'s weight — the fibula beside it bears the remaining 10%.',
          'The shin — the anterior surface of the tibia — has almost no muscle covering, which is why a kick there hurts so much.',
        ],
      },
      {
        key: 'l_fibula_beige_0',
        name: 'Fibula',
        facts: [
          'The fibula bears almost no body weight — its main role is providing a surface for muscle attachment and stabilising the ankle.',
          'The lateral malleolus (the bony bump on the outside of your ankle) is the bottom of the fibula — the most commonly sprained ankle ligament attaches here.',
        ],
      },
      {
        key: 'l_foot_beige_0',
        name: 'Foot',
        facts: [
          'The foot has 26 bones — 7 tarsals, 5 metatarsals, and 14 phalanges — and contains over 100 muscles, tendons, and ligaments.',
          'The medial longitudinal arch of the foot acts like a spring, storing and releasing energy with each step — reducing the energy cost of walking by about 17%.',
        ],
      },
    ],
  },
];

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Extracted from components/SkeletonScene.jsx (BONE_INFO)
//   and app/models/skeleton/page.js (BONE_CATALOG)
// REASON: Both files needed the same data. Moving here prevents drift and
//   makes it easy to add new bones in one place.
// --- END CHANGE LOG ---
