import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    discountCode,
    discountAmount,
    shippingAmount,
    estimatedTax,
    cartTotal,
    qualifiesForFreeShipping,
    freeShippingThreshold,
    applyPromoCode,
    removePromoCode,
    formatPrice,
    setIsCheckoutOpen
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const result = applyPromoCode(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoInput('');
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div 
        className="drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} />
            <h2 className="drawer-title">Shopping Bag</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </span>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Shopping Bag"
            id="btn-close-cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping meter */}
        {cart.length > 0 && (
          <div style={{ padding: '1rem 1.75rem 0 1.75rem' }}>
            <div className="shipping-meter">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 500 }}>
                {qualifiesForFreeShipping ? (
                  <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} /> Unlocked Complimentary Worldwide Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for free worldwide delivery
                  </span>
                )}
                <span>{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="shipping-meter-bar">
                <div 
                  className="shipping-meter-fill" 
                  style={{ width: `${freeShippingProgress}%` }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Body / Line Items */}
        <div className="drawer-body">
          {cart.length === 0 ? (
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
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>Your bag is empty</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '280px' }}>
                Discover our thoughtfully designed collection of minimal living artifacts.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="btn-cart-empty-shop"
              >
                <span>Browse Artifacts</span>
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.lineItemId} className="cart-item" id={`cart-item-${item.lineItemId}`}>
                <img src={item.thumbnail} alt={item.title} className="cart-item-img" />
                
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-variant">
                    {item.selectedColor} / {item.selectedSize}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                    {formatPrice(item.price)}
                  </div>

                  <div className="qty-stepper">
                    <button 
                      onClick={() => updateCartQuantity(item.lineItemId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.lineItemId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button
                  className="btn-icon btn-icon-subtle"
                  onClick={() => removeFromCart(item.lineItemId)}
                  aria-label="Remove item"
                  title="Remove"
                  id={`btn-remove-${item.lineItemId}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary & Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="promo-box">
              <input
                type="text"
                placeholder="Discount code (e.g. MEDUSA10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="promo-input"
                id="input-promo-code"
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.82rem' }}>
                Apply
              </button>
            </form>

            {promoError && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}>{promoError}</span>
            )}

            {discountCode && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-subtle)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                  <Tag size={13} /> Code: {discountCode}
                </span>
                <button 
                  onClick={removePromoCode} 
                  style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Shipping</span>
                <span style={{ fontWeight: 500 }}>
                  {shippingAmount === 0 ? <span style={{ color: 'var(--accent-green)' }}>Free</span> : formatPrice(shippingAmount)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Taxes</span>
                <span style={{ fontWeight: 500 }}>{formatPrice(estimatedTax)}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.6rem',
                marginTop: '0.2rem',
                fontSize: '1.05rem',
                fontWeight: 600
              }}>
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem' }}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              id="btn-drawer-checkout"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
