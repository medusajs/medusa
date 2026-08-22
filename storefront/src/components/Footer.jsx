import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const { setSelectedCategory, setIsBackendModalOpen, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      addToast('Subscribed to Atelier Dispatch', 'success');
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="atelier-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Newsletter */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '1.2rem' }}>
              <span className="brand-title" style={{ fontSize: '1.4rem' }}>Atelier</span>
              <span className="brand-subtitle">Medusa Commerce</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              A sanctuary for deliberate design, understated luxury, and modern headless architecture.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.4rem', maxWidth: '320px' }}>
              <input
                type="email"
                required
                placeholder="Join the private journal..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="promo-input"
                style={{ fontSize: '0.8rem' }}
                id="input-newsletter-email"
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 0.85rem' }} id="btn-subscribe-newsletter">
                {subscribed ? <Check size={14} /> : <ArrowRight size={14} />}
              </button>
            </form>
          </div>

          {/* Column 2: Collections */}
          <div>
            <div className="footer-col-title">Catalogue</div>
            <ul className="footer-links">
              <li>
                <button 
                  className="footer-link" 
                  onClick={() => { setSelectedCategory('Apparel'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Apparel & Knitwear
                </button>
              </li>
              <li>
                <button 
                  className="footer-link" 
                  onClick={() => { setSelectedCategory('Objects'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Ceramics & Objects
                </button>
              </li>
              <li>
                <button 
                  className="footer-link" 
                  onClick={() => { setSelectedCategory('Leather'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Tuscan Leather
                </button>
              </li>
              <li>
                <button 
                  className="footer-link" 
                  onClick={() => { setSelectedCategory('Timepieces'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Bauhaus Watches
                </button>
              </li>
              <li>
                <button 
                  className="footer-link" 
                  onClick={() => { setSelectedCategory('Scent'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Botanical Scent
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care */}
          <div>
            <div className="footer-col-title">Care & Logistics</div>
            <ul className="footer-links">
              <li><a href="#shipping" className="footer-link">Worldwide Shipping</a></li>
              <li><a href="#returns" className="footer-link">30-Day Complimentary Returns</a></li>
              <li><a href="#patina" className="footer-link">Leather Patina Guide</a></li>
              <li><a href="#sustainability" className="footer-link">Materials Transparency</a></li>
              <li><a href="#concierge" className="footer-link">Private Concierge</a></li>
            </ul>
          </div>

          {/* Column 4: Architecture */}
          <div>
            <div className="footer-col-title">Medusa Engine</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Built with React, Vite, and Medusa v2 REST Store APIs for instant speed and global multi-region pricing.
            </p>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.5rem 0.9rem' }}
              onClick={() => setIsBackendModalOpen(true)}
              id="btn-footer-backend-config"
            >
              Configure Medusa Endpoint
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ATELIER EDITIONS. All rights reserved. Powered by Medusa JS.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" className="footer-link" style={{ fontSize: '0.78rem' }}>Privacy Notice</a>
            <a href="#terms" className="footer-link" style={{ fontSize: '0.78rem' }}>Terms of Service</a>
            <a href="#accessibility" className="footer-link" style={{ fontSize: '0.78rem' }}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
