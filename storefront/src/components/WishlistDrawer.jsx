import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    formatPrice,
    getProductPrice
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div 
        className="drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={20} fill="#E11D48" color="#E11D48" />
            <h2 className="drawer-title">Saved Items</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              ({wishlist.length})
            </span>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Saved Items"
            id="btn-close-wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--bg-subtle)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <Heart size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>No saved items</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '280px' }}>
                Tap the heart icon on any artifact to save it to your private curation list.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsWishlistOpen(false);
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="btn-wishlist-empty-shop"
              >
                <span>Explore Catalog</span>
              </button>
            </div>
          ) : (
            wishlist.map(product => {
              const price = getProductPrice(product);
              return (
                <div key={product.id} className="cart-item" id={`wishlist-item-${product.id}`}>
                  <img src={product.thumbnail} alt={product.title} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <div className="cart-item-title">{product.title}</div>
                    <div className="cart-item-variant">{product.category}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                      {formatPrice(price)}
                    </div>

                    <button
                      className="btn-quick-add"
                      style={{ marginTop: '0.5rem', alignSelf: 'flex-start', padding: '0.4rem 0.8rem' }}
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product);
                      }}
                      id={`btn-wishlist-move-to-bag-${product.id}`}
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
                  </div>

                  <button
                    className="btn-icon btn-icon-subtle"
                    onClick={() => toggleWishlist(product)}
                    aria-label="Remove from wishlist"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
