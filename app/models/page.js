// ============================================================
// FILE: app/models/page.js
// PURPOSE: 3D model catalogue — browse, search and filter all models
// LAST CHANGED: May 13, 2026
// WHY IT EXISTS: Hub for all interactive 3D anatomy/medical models
// ⚠️ DO NOT CHANGE: Model slugs must match their individual page routes
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';


const MODELS = [
  { slug: 'dna', name: 'DNA Double Helix', category: 'Cell Biology', tags: ['genetics', 'molecular', 'nucleus'], description: 'Explore the structure of DNA — bases, backbone, and the double helix.' },
  { slug: 'heart', name: 'Human Heart', category: 'Anatomy', tags: ['cardiovascular', 'organ', 'circulation'], description: 'Interactive model of the heart with chambers, valves, and vessels.' },
  { slug: 'neuron', name: 'Neuron', category: 'Neuroanatomy', tags: ['nervous system', 'brain', 'cell'], description: 'Explore axons, dendrites, myelin sheaths, and synaptic terminals.' },
  { slug: 'lung', name: 'Lungs & Bronchi', category: 'Anatomy', tags: ['respiratory', 'organ', 'pulmonary'], description: 'Trace the airway from trachea to alveoli in 3D.' },
  { slug: 'cell', name: 'Human Cell', category: 'Cell Biology', tags: ['organelles', 'molecular', 'nucleus'], description: 'Navigate the organelles — mitochondria, ER, Golgi, and more.' },
  { slug: 'spine', name: 'Vertebral Column', category: 'Musculoskeletal', tags: ['bones', 'orthopedics', 'spine'], description: 'Identify each vertebra, disc, and spinal nerve root.' },
  { slug: 'skeleton', name: 'Male Skeleton', category: 'Musculoskeletal', tags: ['skeleton', 'bones', 'anatomy', 'osteology', 'musculoskeletal'], description: 'Full human male skeleton with 206 bones. Tap any hotspot to explore bone names and functions.' },
];

const CATEGORIES = ['All', 'Anatomy', 'Cell Biology', 'Neuroanatomy', 'Musculoskeletal'];

export default function ModelsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return MODELS.filter(m => {
      const matchCategory = activeCategory === 'All' || m.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some(t => t.includes(q)) ||
        m.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <main style={{ background: '#020817', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,202,255,0.08) 0%, transparent 60%)',
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 80px', position: 'relative' }}>

        {/* Back link */}
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#63caff', fontSize: '13px', letterSpacing: '0.05em',
            marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Inter, sans-serif', padding: 0,
          }}
        >
          ← Back to Learn World
        </button>

        {/* Header */}
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#63caff', marginBottom: '10px' }}>
          The Real Medico Interactive
        </p>
        <h1 style={{ fontFamily: 'Merriweather, serif', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 48px)', color: '#fff', marginBottom: '8px' }}>
          3D Model Library
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '40px' }}>
          Tap any model to explore it interactively in 3D.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '16px' }}>⌕</span>
          <input
            type="text"
            placeholder="Search models, topics, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(99,202,255,0.2)',
              borderRadius: '12px',
              padding: '14px 16px 14px 44px',
              color: '#fff', fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
            }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: '100px',
                border: `1px solid ${activeCategory === cat ? 'rgba(99,202,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
                background: activeCategory === cat ? 'rgba(99,202,255,0.12)' : 'transparent',
                color: activeCategory === cat ? '#63caff' : '#64748b',
                fontSize: '13px', fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>
          {filtered.length} model{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Model cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {filtered.map(model => (
            <ModelCard key={model.slug} model={model} onClick={() => router.push(`/models/${model.slug}`)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔬</div>
            <p style={{ fontSize: '15px' }}>No models match your search.</p>
          </div>
        )}

      </div>
    </main>
  );
}

function ModelCard({ model, onClick }) {
  const [hovered, setHovered] = useState(false);

  const categoryColors = {
    'Anatomy': '#ff6b9d',
    'Cell Biology': '#63caff',
    'Neuroanatomy': '#a78bfa',
    'Musculoskeletal': '#06d6a0',
  };
  const color = categoryColors[model.category] || '#63caff';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? color + '55' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.25s',
        boxShadow: hovered ? `0 0 24px ${color}22` : 'none',
      }}
    >
      {/* Icon placeholder */}
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: `${color}18`,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', marginBottom: '16px',
      }}>
        🧬
      </div>

      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color, marginBottom: '6px' }}>
        {model.category}
      </p>
      <h2 style={{ fontFamily: 'Merriweather, serif', fontWeight: 700, fontSize: '17px', color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
        {model.name}
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>
        {model.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {model.tags.map(tag => (
          <span key={tag} style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.05)', color: '#475569',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
