// ============================================================
// FILE: app/models/skeleton/page.js
// PURPOSE: Individual model page for the male skeleton
// LAST CHANGED: May 16, 2026
// WHY IT EXISTS: Routed from /models catalogue - slug: skeleton
// DO NOT CHANGE: SkeletonScene must stay inside dynamic() with ssr:false
//                Do NOT put a fixed height on the 3D scene wrapper div.
//                activeBone state lives HERE and is passed to SkeletonScene as prop.
//                This allows bone cards below to trigger highlights in the 3D viewer.
// ============================================================

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const SkeletonScene = dynamic(() => import('../../../components/SkeletonScene'), {
  ssr: false,
  loading: () => (
    <div style={{ color: '#fff', textAlign: 'center', paddingTop: '160px', fontFamily: 'Inter, sans-serif' }}>
      Loading skeleton...
    </div>
  ),
});

const BONE_CATALOG = [
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

export default function SkeletonPage() {
  const [activeBone, setActiveBone] = useState(null);
  const sceneRef = useRef(null);

    useEffect(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  function showBone(key) {
    setActiveBone(key);
    sceneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div style={{
      background: '#050510',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Link href="/models" style={{
          color: '#aaa',
          textDecoration: 'none',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          Back to Models
        </Link>
        <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Musculoskeletal
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '24px 24px 0' }}>
        <h1 style={{
          fontFamily: 'Merriweather, serif',
          fontWeight: 900,
          fontSize: 'clamp(24px, 5vw, 42px)',
          margin: 0,
          lineHeight: 1.15,
        }}>
          Male Skeleton
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px', marginBottom: 0 }}>
          206 bones · Tap any bone to explore
        </p>
      </div>

      {/* 3D Scene */}
      <div ref={sceneRef} style={{ padding: '16px 16px 0' }}>
        <SkeletonScene activeBone={activeBone} setActiveBone={setActiveBone} />
      </div>

      {/* Quick facts */}
      <div style={{
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
      }}>
        {[
          { label: 'Total Bones', value: '206' },
          { label: 'Heaviest Bone', value: 'Femur' },
          { label: 'Smallest Bone', value: 'Stapes (ear)' },
          { label: 'Function', value: 'Support & Protection' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '10px',
            padding: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ color: '#00ffcc', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {stat.label}
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Bone catalog by region */}
      <div style={{ padding: '0 24px 60px' }}>
        <h2 style={{
          fontFamily: 'Merriweather, serif',
          fontWeight: 700,
          fontSize: 'clamp(18px, 3vw, 26px)',
          marginBottom: '6px',
          marginTop: '8px',
        }}>
          Bone Reference
        </h2>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px', marginTop: 0 }}>
          Tap View in Model to highlight any bone in the 3D viewer above
        </p>

        {BONE_CATALOG.map((section) => (
          <div key={section.region} style={{ marginBottom: '40px' }}>
            {/* Region header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                color: '#00ffcc',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                {section.region}
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,204,0.15)' }} />
            </div>

            {/* Bone cards grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px',
            }}>
              {section.bones.map((bone) => {
                const isActive = activeBone === bone.key;
                return (
                  <div key={bone.key} style={{
                    background: isActive ? 'rgba(0,255,204,0.06)' : 'rgba(255,255,255,0.03)',
                    border: isActive ? '1px solid rgba(0,255,204,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'border 0.2s, background 0.2s',
                  }}>
                    {/* Bone name */}
                    <div style={{
                      fontWeight: 700,
                      fontSize: '15px',
                      color: isActive ? '#00ffcc' : '#fff',
                      marginBottom: '10px',
                      transition: 'color 0.2s',
                    }}>
                      {bone.name}
                    </div>

                    {/* Fun facts */}
                    <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'disc' }}>
                      {bone.facts.map((fact, i) => (
                        <li key={i} style={{
                          color: '#94a3b8',
                          fontSize: '13px',
                          lineHeight: 1.6,
                          marginBottom: i < bone.facts.length - 1 ? '6px' : 0,
                        }}>
                          {fact}
                        </li>
                      ))}
                    </ul>

                    {/* Show in model button */}
                    <button
                      onClick={() => showBone(isActive ? null : bone.key)}
                      style={{
                        marginTop: '14px',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: isActive ? '1px solid #00ffcc' : '1px solid rgba(0,255,204,0.35)',
                        background: isActive ? 'rgba(0,255,204,0.15)' : 'transparent',
                        color: isActive ? '#00ffcc' : '#5eead4',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isActive ? 'Shown in Model' : 'View in Model'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
