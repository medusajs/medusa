import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, Plus, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    formatPrice, 
    getProductPrice, 
    addToCart, 
    toggleWishlist, 
    isFavorite, 
    setSelectedProduct 
  } = useStore();

  const [isAdded, setIsAdded] = useState(false);

  const price = getProductPrice(product);
  const favorite = isFavorite(product.id);
  const secondaryImage = product.images?.[1] || product.thumbnail;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, {
      color: product.colors?.[0]?.name,
      size: product.sizes?.[0],
      quantity: 1
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleOpenDetail = (e) => {
    e.preventDefault();
    setSelectedProduct(product);
  };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      {/* Media & Action Overlays */}
      <div className="product-card-media" onClick={handleOpenDetail} style={{ cursor: 'pointer' }}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card-img primary"
          loading="lazy"
        />
        {secondaryImage && secondaryImage !== product.thumbnail && (
          <img
            src={secondaryImage}
            alt={`${product.title} Alternate Angle`}
            className="product-card-img secondary"
            loading="lazy"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="product-badge-overlay">
            <span className="badge-tag">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          className={`wishlist-heart-btn ${favorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          title={favorite ? "In Wishlist" : "Save to Wishlist"}
          id={`btn-wishlist-${product.id}`}
        >
          <Heart size={16} fill={favorite ? '#E11D48' : 'none'} />
        </button>

        {/* Quick Action Bar (Revealed on hover) */}
        <div className="quick-action-bar">
          <button
            className="btn-quick-add"
            onClick={handleQuickAdd}
            disabled={product.inventory_quantity <= 0}
            id={`btn-quick-add-${product.id}`}
          >
            {isAdded ? (
              <>
                <Check size={14} style={{ color: 'var(--accent-green)' }} />
                <span>Added to Bag</span>
              </>
            ) : product.inventory_quantity <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <Plus size={14} />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <button
            className="btn-quick-view"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            aria-label="Quick View Details"
            title="Quick View"
            id={`btn-quick-view-${product.id}`}
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="product-meta">
        <span className="product-category-label">{product.category}</span>
        
        <a 
          href={`#product-${product.handle}`} 
          className="product-title-link"
          onClick={handleOpenDetail}
        >
          {product.title}
        </a>

        <div className="product-price-row">
          <span className="product-price">{formatPrice(price)}</span>

          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="color-swatch-list" title={`${product.colors.length} color available`}>
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="color-swatch-dot"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
