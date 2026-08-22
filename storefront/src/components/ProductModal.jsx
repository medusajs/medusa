import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, Plus, Minus, Check, ShieldCheck, Truck, RotateCcw, Code } from 'lucide-react';

export default function ProductModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    formatPrice, 
    getProductPrice, 
    addToCart, 
    toggleWishlist, 
    isFavorite 
  } = useStore();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showMedusaPayload, setShowMedusaPayload] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImgIndex(0);
      setSelectedColor(selectedProduct.colors?.[0]?.name || '');
      setSelectedSize(selectedProduct.sizes?.[0] || '');
      setQuantity(1);
      setShowMedusaPayload(false);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const price = getProductPrice(selectedProduct);
  const favorite = isFavorite(selectedProduct.id);
  const images = selectedProduct.images || [selectedProduct.thumbnail];

  const handleAddToCart = () => {
    addToCart(selectedProduct, {
      color: selectedColor,
      size: selectedSize,
      quantity
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
      <div 
        className="product-modal-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setSelectedProduct(null)}
          aria-label="Close Product Modal"
          id="btn-close-product-modal"
        >
          <X size={18} />
        </button>

        {/* Left Column: Gallery */}
        <div className="product-modal-gallery">
          <div className="modal-main-img-box">
            <img
              src={images[activeImgIndex] || selectedProduct.thumbnail}
              alt={selectedProduct.title}
            />
          </div>

          {images.length > 1 && (
            <div className="modal-thumbnail-row">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`modal-thumb-btn ${activeImgIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImgIndex(idx)}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="product-modal-info">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span className="badge-tag">{selectedProduct.category}</span>
              {selectedProduct.badge && (
                <span className="badge-tag" style={{ color: 'var(--accent-gold)' }}>
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', lineHeight: '1.2', fontWeight: 500 }}>
              {selectedProduct.title}
            </h2>

            <div style={{ fontSize: '1.35rem', fontWeight: 600, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {formatPrice(price)}
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {selectedProduct.description}
          </p>

          {/* Color Selector */}
          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
            <div>
              <div className="variant-group-title">
                Color: <span style={{ color: 'var(--text-primary)' }}>{selectedColor}</span>
              </div>
              <div className="variant-pills">
                {selectedProduct.colors.map(col => (
                  <button
                    key={col.name}
                    className={`color-option-pill ${selectedColor === col.name ? 'active' : ''}`}
                    onClick={() => setSelectedColor(col.name)}
                  >
                    <span className="color-swatch-dot" style={{ backgroundColor: col.hex }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div>
              <div className="variant-group-title">
                Size / Dimension: <span style={{ color: 'var(--text-primary)' }}>{selectedSize}</span>
              </div>
              <div className="variant-pills">
                {selectedProduct.sizes.map(sz => (
                  <button
                    key={sz}
                    className={`variant-pill ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <div className="qty-stepper" style={{ height: '46px', padding: '0 4px' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: '32px', height: '100%' }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span style={{ fontSize: '0.95rem' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                style={{ width: '32px', height: '100%' }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              className="btn btn-primary"
              style={{ flex: 1, height: '46px' }}
              onClick={handleAddToCart}
              id="btn-modal-add-to-bag"
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  <span>Added ({quantity})</span>
                </>
              ) : (
                <span>Add to Bag • {formatPrice(price * quantity)}</span>
              )}
            </button>

            <button
              className={`btn-icon ${favorite ? 'active' : ''}`}
              style={{ 
                height: '46px', 
                width: '46px', 
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)'
              }}
              onClick={() => toggleWishlist(selectedProduct)}
              aria-label="Toggle Wishlist"
              id="btn-modal-toggle-wishlist"
            >
              <Heart size={18} fill={favorite ? '#E11D48' : 'none'} color={favorite ? '#E11D48' : 'currentColor'} />
            </button>
          </div>

          {/* Specifications Accordion */}
          <div className="specs-accordion">
            <div className="spec-item">
              <span className="spec-label">Composition & Material</span>
              <span className="spec-val">{selectedProduct.material}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Provenance</span>
              <span className="spec-val">{selectedProduct.origin}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Inventory Status</span>
              <span className="spec-val" style={{ color: selectedProduct.inventory_quantity > 5 ? 'var(--accent-green)' : 'var(--accent-gold)' }}>
                {selectedProduct.inventory_quantity > 0 ? `Available (${selectedProduct.inventory_quantity} in stock)` : 'Made to Order'}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Medusa Product ID</span>
              <span className="spec-val" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{selectedProduct.id}</span>
            </div>
          </div>

          {/* Medusa API Raw Payload Toggle for developers / evaluators */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={() => setShowMedusaPayload(!showMedusaPayload)}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
            >
              <Code size={13} />
              <span>{showMedusaPayload ? 'Hide' : 'Inspect'} Medusa Store API Payload</span>
            </button>

            {showMedusaPayload && (
              <pre style={{
                marginTop: '0.6rem',
                padding: '0.75rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                overflowX: 'auto',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}>
                {JSON.stringify(selectedProduct, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
