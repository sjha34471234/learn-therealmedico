// ============================================================
// FILE: lib/quizData.js
// PURPOSE: All quizzable bones for the skeleton quiz — display names + accepted answer variants
// LAST CHANGED: May 17, 2026
// WHY IT EXISTS: Single source of truth for quiz content. Separated from boneData.js
//   so quiz logic can evolve independently from the 3D viewer highlight data.
// DEPENDENCIES: None
// DO NOT CHANGE:
//   - mesh key values must exactly match GLTF node names in scene.gltf
//   - accepted array must always be lowercase — comparison is .toLowerCase().trim()
//   - region values must match the regions used in BONE_CATALOG in boneData.js
// ============================================================

export const QUIZ_BONES = [
  // --- SKULL ---
  { key: 'Cranium_beige_0', name: 'Cranium', region: 'Skull', accepted: ['cranium', 'skull', 'skullcap', 'neurocranium'] },
  { key: 'Mandible_beige_0', name: 'Mandible', region: 'Skull', accepted: ['mandible', 'lower jaw', 'jaw bone', 'jawbone'] },
  { key: 'hyoid_beige_0', name: 'Hyoid Bone', region: 'Skull', accepted: ['hyoid', 'hyoid bone'] },

  // --- SPINE ---
  { key: 'c1_beige_0', name: 'Atlas (C1)', region: 'Spine', accepted: ['atlas', 'c1', 'c 1', 'first cervical vertebra', 'cervical 1'] },
  { key: 'c2_beige_0', name: 'Axis (C2)', region: 'Spine', accepted: ['axis', 'c2', 'c 2', 'second cervical vertebra', 'cervical 2'] },
  { key: 'c7_beige_0', name: 'Vertebra Prominens (C7)', region: 'Spine', accepted: ['c7', 'c 7', 'vertebra prominens', 'seventh cervical vertebra', 'cervical 7'] },
  { key: 'l3_beige_0', name: 'L3 Vertebra', region: 'Spine', accepted: ['l3', 'l 3', 'third lumbar vertebra', 'lumbar 3'] },
  { key: 'l4_beige_0', name: 'L4 Vertebra', region: 'Spine', accepted: ['l4', 'l 4', 'fourth lumbar vertebra', 'lumbar 4'] },
  { key: 'Sacrum_beige_0', name: 'Sacrum', region: 'Spine', accepted: ['sacrum', 'sacral bone'] },
  { key: 'Coccyx_beige_0', name: 'Coccyx', region: 'Spine', accepted: ['coccyx', 'tailbone', 'tail bone'] },

  // --- RIBCAGE ---
  { key: 'Sternum_beige_0', name: 'Sternum', region: 'Ribcage', accepted: ['sternum', 'breastbone', 'breast bone'] },
  { key: 'l_rib1_beige_0', name: 'Rib 1', region: 'Ribcage', accepted: ['rib 1', 'rib1', 'first rib', '1st rib'] },
  { key: 'l_rib7_beige_0', name: 'Rib 7', region: 'Ribcage', accepted: ['rib 7', 'rib7', 'seventh rib', '7th rib'] },
  { key: 'l_rib11_beige_0', name: 'Rib 11', region: 'Ribcage', accepted: ['rib 11', 'rib11', 'eleventh rib', '11th rib', 'floating rib'] },

  // --- SHOULDER & ARMS ---
  { key: 'l_clavicle_beige_0', name: 'Clavicle', region: 'Shoulder & Arms', accepted: ['clavicle', 'collar bone', 'collarbone'] },
  { key: 'l_scapula_beige_0', name: 'Scapula', region: 'Shoulder & Arms', accepted: ['scapula', 'shoulder blade', 'shoulder-blade'] },
  { key: 'l_humerus_beige_0', name: 'Humerus', region: 'Shoulder & Arms', accepted: ['humerus', 'upper arm bone', 'upper arm'] },
  { key: 'l_radius_beige_0', name: 'Radius', region: 'Shoulder & Arms', accepted: ['radius'] },
  { key: 'l_ulna_beige_0', name: 'Ulna', region: 'Shoulder & Arms', accepted: ['ulna'] },
  { key: 'l_scaphoid_beige_0', name: 'Scaphoid', region: 'Shoulder & Arms', accepted: ['scaphoid', 'scaphoid bone', 'navicular'] },

  // --- PELVIS & LEGS ---
  { key: 'l_oscoxa_beige_0', name: 'Os Coxa', region: 'Pelvis & Legs', accepted: ['os coxa', 'oscoxa', 'hip bone', 'innominate bone', 'innominate', 'coxal bone'] },
  { key: 'l_femur_beige_0', name: 'Femur', region: 'Pelvis & Legs', accepted: ['femur', 'thigh bone', 'thighbone'] },
  { key: 'l_patella_beige_0', name: 'Patella', region: 'Pelvis & Legs', accepted: ['patella', 'kneecap', 'knee cap'] },
  { key: 'l_tibia_beige_0', name: 'Tibia', region: 'Pelvis & Legs', accepted: ['tibia', 'shin bone', 'shinbone'] },
  { key: 'l_fibula_beige_0', name: 'Fibula', region: 'Pelvis & Legs', accepted: ['fibula', 'calf bone'] },
  { key: 'r_calcaneus_beige_0', name: 'Calcaneus', region: 'Pelvis & Legs', accepted: ['calcaneus', 'heel bone', 'calcaneum'] },
];

// --- CHANGE LOG ---
// [May 17, 2026] CREATED: Quiz bone data for skeleton quiz feature
// REASON: Needed a separate source of truth for quiz content independent of boneData.js
// --- END CHANGE LOG ---
