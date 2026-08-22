import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { PackageOpen, RefreshCw } from 'lucide-react';

export default function ProductGrid() {
  const { 
    filteredProducts, 
    isLoadingProducts, 
    gridColumns, 
    setSelectedCategory,
    setSearchQuery,
    setInStockOnly
  } = useStore();

  if (isLoadingProducts) {
    return (
      <div className="atelier-container products-grid-wrapper">
        <div className={`products-grid grid-cols-${gridColumns}`}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="product-card" style={{ opacity: 0.5 }}>
              <div className="product-card-media" style={{ background: 'var(--bg-subtle)' }} />
              <div style={{ height: '14px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '40%', marginBottom: '8px' }} />
              <div style={{ height: '18px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '80%', marginBottom: '8px' }} />
              <div style={{ height: '16px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '30%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="atelier-container products-grid-wrapper">
        <div style={{ 
          textAlign: 'center', 
          padding: '6rem 2rem', 
          background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <PackageOpen size={44} style={{ color: 'var(--text-muted)' }} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              No Artifacts Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
              We could not find any items matching your selected criteria. Try adjusting your filters or search query.
            </p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            id="btn-reset-filters"
          >
            <RefreshCw size={15} />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="atelier-container products-grid-wrapper">
      <div className={`products-grid grid-cols-${gridColumns}`}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
