import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Tag } from 'lucide-react';

export default function SearchModal() {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    setSelectedProduct, 
    formatPrice, 
    getProductPrice 
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const popularKeywords = ['Merino Cardigan', 'Japanese Denim', 'Travertine Lamp', 'Automatic Watch', 'Ceramics', 'Diffuser'];

  const results = query.trim() ? products.filter(p => {
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q);
  }) : [];

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'modalScale 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search artifacts by name, material, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontWeight: 400
            }}
            id="input-global-search"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
          <button
            className="btn-icon"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Body */}
        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {!query.trim() ? (
            <div>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.85rem' }}>
                Trending Inquiries
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {popularKeywords.map(kw => (
                  <button
                    key={kw}
                    className="category-pill-btn"
                    onClick={() => setQuery(kw)}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
              <p>No artifacts found for "{query}".</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                {results.length} Artifacts Found
              </div>
              {results.map(product => {
                const price = getProductPrice(product);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedProduct(product);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    id={`search-result-${product.id}`}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {product.category} • {product.material}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatPrice(price)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
