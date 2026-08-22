import React from 'react';
import { Sparkles, Layers, Box, Globe2 } from 'lucide-react';

export default function EditorialSection() {
  return (
    <section className="editorial-section">
      <div className="atelier-container">
        <div className="editorial-layout">
          {/* Left Column: Visual Story */}
          <div className="editorial-image-box">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
              alt="Atelier Philosophy and Atelier Workshop"
              loading="lazy"
            />
          </div>

          {/* Right Column: Editorial Copy & Pillars */}
          <div>
            <div className="hero-eyebrow" style={{ marginBottom: '1.25rem' }}>
              Atelier Ethos
            </div>

            <blockquote className="editorial-quote">
              "We believe objects in our daily periphery should be silent, durable, and deliberate."
            </blockquote>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Every garment and object in the Atelier collection is produced in limited micro-batches in collaboration with multi-generational European and Japanese craft houses. Built upon Medusa's composable, headless commerce foundation.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Box size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>Zero Compromise</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Full-grain Tuscan leathers, Australian extrafine merino, and Toyoda shuttle denim.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Layers size={20} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>Headless Agility</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Decoupled storefront with sub-second page transitions & multi-region pricing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
