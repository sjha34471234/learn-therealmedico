// ============================================================
// FILE: lib/dnaData.js
// PURPOSE: All structure data for the DNA model page — info map, catalog, quiz entries
// LAST CHANGED: May 18, 2026
// WHY IT EXISTS: Keeps all DNA educational content out of scene and page files
// DEPENDENCIES: Used by components/DnaQuiz.jsx and app/models/dna/page.js
// DO NOT CHANGE: Keys in DNA_INFO must match partIndex % 6 values used in DnaScene.jsx
// ============================================================

// — INDEX MAP —
// partIndex % 6 maps to these keys (matches DNA_PARTS order in DnaScene.jsx)
// 0 = adenine, 1 = thymine, 2 = guanine, 3 = cytosine, 4 = phosphate, 5 = deoxyribose

export const DNA_INFO = {
  adenine: {
    name: 'Adenine (A)',
    color: '#f472b6',
    desc: 'Purine base — pairs exclusively with Thymine via two hydrogen bonds.',
    facts: [
      'Purine — two-ring structure (pyrimidine + imidazole fused)',
      'Always pairs with Thymine (A=T) via 2 hydrogen bonds',
      'Also found in RNA, ATP, NAD+, and FAD',
      'Adenine + deoxyribose = deoxyadenosine',
    ],
  },
  thymine: {
    name: 'Thymine (T)',
    color: '#facc15',
    desc: 'Pyrimidine base — pairs exclusively with Adenine. DNA only (replaced by Uracil in RNA).',
    facts: [
      'Pyrimidine — single-ring structure',
      'Always pairs with Adenine (T=A) via 2 hydrogen bonds',
      'Unique to DNA — RNA uses Uracil instead',
      'Thymine + deoxyribose = thymidine',
    ],
  },
  guanine: {
    name: 'Guanine (G)',
    color: '#34d399',
    desc: 'Purine base — pairs exclusively with Cytosine via three hydrogen bonds.',
    facts: [
      'Purine — two-ring structure',
      'Always pairs with Cytosine (G≡C) via 3 hydrogen bonds',
      'G-C pairs make the double helix more thermally stable',
      'Guanine + deoxyribose = deoxyguanosine',
    ],
  },
  cytosine: {
    name: 'Cytosine (C)',
    color: '#38bdf8',
    desc: 'Pyrimidine base — pairs exclusively with Guanine via three hydrogen bonds.',
    facts: [
      'Pyrimidine — single-ring structure',
      'Always pairs with Guanine (C≡G) via 3 hydrogen bonds',
      'Can be methylated — epigenetic regulation',
      'Cytosine + deoxyribose = deoxycytidine',
    ],
  },
  phosphate: {
    name: 'Phosphate Group',
    color: '#c084fc',
    desc: 'Negatively charged backbone unit — links sugar molecules and gives DNA its acidity.',
    facts: [
      'PO4 group — one phosphorus, four oxygens',
      'Carries negative charge at physiological pH',
      'Links 3\' carbon of one sugar to 5\' carbon of next',
      'Responsible for DNA\'s overall negative charge',
    ],
  },
  deoxyribose: {
    name: 'Deoxyribose Sugar',
    color: '#fb923c',
    desc: '5-carbon sugar — forms the structural backbone with the phosphate group.',
    facts: [
      '5-carbon (pentose) sugar',
      'Missing OH at 2\' position — hence "deoxy"',
      'Base attaches at 1\' carbon',
      'Phosphate attaches at 3\' and 5\' carbons',
    ],
  },
};

// — CATALOG —
// Drives the Structure Reference section on the page
export const DNA_CATALOG = [
  {
    region: 'Nitrogenous Bases',
    structures: [
      {
        key: 'adenine',
        name: 'Adenine (A)',
        facts: DNA_INFO.adenine.facts,
      },
      {
        key: 'thymine',
        name: 'Thymine (T)',
        facts: DNA_INFO.thymine.facts,
      },
      {
        key: 'guanine',
        name: 'Guanine (G)',
        facts: DNA_INFO.guanine.facts,
      },
      {
        key: 'cytosine',
        name: 'Cytosine (C)',
        facts: DNA_INFO.cytosine.facts,
      },
    ],
  },
  {
    region: 'Backbone Components',
    structures: [
      {
        key: 'phosphate',
        name: 'Phosphate Group',
        facts: DNA_INFO.phosphate.facts,
      },
      {
        key: 'deoxyribose',
        name: 'Deoxyribose Sugar',
        facts: DNA_INFO.deoxyribose.facts,
      },
    ],
  },
];

// — QUIZ STRUCTURES —
// Drives the quiz in DnaQuiz.jsx
export const QUIZ_DNA = [
  {
    key: 'adenine',
    name: 'Adenine (A)',
    region: 'Nitrogenous Bases',
    accepted: ['adenine', 'adenine (a)', 'a'],
  },
  {
    key: 'thymine',
    name: 'Thymine (T)',
    region: 'Nitrogenous Bases',
    accepted: ['thymine', 'thymine (t)', 't'],
  },
  {
    key: 'guanine',
    name: 'Guanine (G)',
    region: 'Nitrogenous Bases',
    accepted: ['guanine', 'guanine (g)', 'g'],
  },
  {
    key: 'cytosine',
    name: 'Cytosine (C)',
    region: 'Nitrogenous Bases',
    accepted: ['cytosine', 'cytosine (c)', 'c'],
  },
  {
    key: 'phosphate',
    name: 'Phosphate Group',
    region: 'Backbone Components',
    accepted: ['phosphate', 'phosphate group', 'po4'],
  },
  {
    key: 'deoxyribose',
    name: 'Deoxyribose Sugar',
    region: 'Backbone Components',
    accepted: ['deoxyribose', 'deoxyribose sugar', 'sugar', 'pentose sugar'],
  },
];

// — CHANGE LOG —
// [May 18, 2026] CREATED: Initial DNA structure data — 6 parts, 2 catalog regions, 6 quiz entries
// REASON: Follows 3D Model Template from brain dump. Data separated from scene and page files.
// — END CHANGE LOG —
