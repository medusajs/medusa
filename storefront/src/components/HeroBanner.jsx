import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Zap, Compass } from 'lucide-react';

export default function HeroBanner() {
  const { setSelectedCategory, setSelectedProduct, products } = useStore();

  const featuredHeroProduct = products.find(p => p.id === 'prod_01') || products[0];

  return (
    <section className="hero-section">
      <div className="atelier-container">
        <div className="hero-grid">
          {/* Left Editorial Copy */}
          <div className="hero-content">
            <div className="hero-eyebrow">
              Autumn / Winter 2026 Edition
            </div>
            
            <h1 className="heading-editorial">
              The Architecture of Minimal Living.
            </h1>

            <p className="hero-desc">
              Curated objects, tactile merino knitwear, and sculptural ceramics crafted with uncompromising precision. Powered seamlessly by Medusa headless commerce engine.
            </p>

            <div className="hero-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="btn-hero-explore"
              >
                <span>Explore Artifacts</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => {
                  if (featuredHeroProduct) setSelectedProduct(featuredHeroProduct);
                }}
                id="btn-hero-featured-quickview"
              >
                <span>Featured Lookbook</span>
              </button>
            </div>

            {/* Micro Feature Highlights */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2rem', 
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Zap size={15} style={{ color: 'var(--accent-gold)' }} />
                <span>Medusa v2 API Powered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={15} style={{ color: 'var(--accent-green)' }} />
                <span>Ethically Sourced & Crafted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Compass size={15} style={{ color: 'var(--text-muted)' }} />
                <span>Global Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="hero-visual-card">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" 
              alt="Atelier Minimal Collection Campaign"
              loading="eager"
            />
            <div className="hero-visual-overlay">
              <div className="hero-visual-tag">Featured Release</div>
              <div className="hero-visual-title">Sculptural Form & Tactile Materiality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
