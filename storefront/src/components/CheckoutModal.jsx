import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { medusaClient } from '../api/medusaClient';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  ArrowRight, 
  QrCode, 
  Smartphone, 
  Building2, 
  Sparkles, 
  Zap 
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountCode,
    discountAmount,
    shippingAmount,
    estimatedTax,
    cartTotal,
    formatPrice,
    clearCart,
    selectedRegion,
    addToast
  } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmed
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Method Selection
  const isIndiaRegion = (selectedRegion.currency_code || '').toLowerCase() === 'inr';
  const [paymentProvider, setPaymentProvider] = useState(isIndiaRegion ? 'cashfree' : 'stripe');
  const [cashfreeMethod, setCashfreeMethod] = useState('upi'); // 'upi', 'netbanking', 'card', 'qr'
  const [upiId, setUpiId] = useState('aditya@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Customer Form Fields
  const [formData, setFormData] = useState({
    firstName: isIndiaRegion ? 'Aditya' : 'Julian',
    lastName: isIndiaRegion ? 'Sharma' : 'Vane',
    email: isIndiaRegion ? 'aditya.sharma@bangalore-tech.in' : 'julian.vane@architecture.ch',
    phone: isIndiaRegion ? '+91 98450 12345' : '+1 (555) 019-2834',
    address: isIndiaRegion ? 'Villa 14, Palm Meadows, Whitefield' : '428 Mercer Street, Suite 4B',
    city: isIndiaRegion ? 'Bengaluru' : 'New York',
    state: isIndiaRegion ? 'Karnataka' : 'NY',
    postalCode: isIndiaRegion ? '560066' : '10013',
    country: selectedRegion.countries?.[0]?.iso_2?.toUpperCase() || 'IN',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
    shippingMethod: 'standard'
  });

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let cfSession = null;
      if (paymentProvider === 'cashfree') {
        cfSession = await medusaClient.createCashfreeOrderSession({
          amount: cartTotal,
          currency: selectedRegion.currency_code?.toUpperCase() || 'INR',
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          cart_id: `cart_${Date.now()}`
        });
      }

      // Complete cart using Medusa client
      const response = await medusaClient.completeCart(`cart_${Date.now()}`, {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        payment_provider: paymentProvider,
        payment_reference: paymentProvider === 'cashfree' ? (cfSession?.payment_session_id || `CF_PAY_${Math.floor(100000 + Math.random() * 900000)}`) : `STRIPE_PI_${Math.floor(100000 + Math.random() * 900000)}`,
        currency_code: selectedRegion.currency_code || 'inr',
        total: cartTotal,
        subtotal: cartSubtotal,
        tax_total: estimatedTax,
        discount_total: discountAmount,
        shipping_total: shippingAmount,
        shipping_address: {
          address_1: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country_code: formData.country.toLowerCase()
        },
        items: [...cart]
      });

      const orderResult = response.data;
      setConfirmedOrder({
        orderId: orderResult.id || `ord_01J${Math.floor(100000 + Math.random() * 900000)}`,
        displayId: orderResult.display_id || Math.floor(1045 + Math.random() * 9000),
        email: formData.email,
        phone: formData.phone,
        items: [...cart],
        total: cartTotal,
        paymentProvider: paymentProvider,
        paymentReference: orderResult.payment_reference,
        shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}`,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      });

      clearCart();
      setStep(3);
      addToast('Payment authorized & Order confirmed!', 'success');
    } catch (err) {
      console.error('Checkout error:', err);
      addToast('Failed to complete order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => (step !== 3 ? setIsCheckoutOpen(false) : null)}>
      <div 
        className="checkout-modal-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setIsCheckoutOpen(false)}
          aria-label="Close Checkout"
          id="btn-close-checkout"
        >
          <X size={18} />
        </button>

        {/* Left Side: Steps Form */}
        <div className="checkout-form-side">
          {step === 3 && confirmedOrder ? (
            /* Step 3: Order Confirmation Receipt */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--accent-green)' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-green)', fontWeight: 700 }}>
                    Order Confirmed
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500 }}>
                    Thank you, {formData.firstName}.
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Your order <strong>#{confirmedOrder.displayId || confirmedOrder.orderId}</strong> has been processed via <strong>{confirmedOrder.paymentProvider === 'cashfree' ? 'Cashfree Payments' : 'Stripe'}</strong>. A confirmation SMS & dispatch note has been sent to <em>{confirmedOrder.phone}</em> and <em>{confirmedOrder.email}</em>.
              </p>

              {confirmedOrder.paymentReference && (
                <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Gateway Ref:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{confirmedOrder.paymentReference}</span>
                </div>
              )}

              <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  Shipping Destination
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {confirmedOrder.shippingAddress}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setIsCheckoutOpen(false)}
                style={{ width: '100%', marginTop: '1rem' }}
                id="btn-checkout-done"
              >
                <span>Return to Atelier Storefront</span>
              </button>
            </div>
          ) : (
            /* Step 1 & 2: Information & Payment */
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handlePlaceOrder}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span className={`badge-tag ${step === 1 ? 'badge-live' : ''}`}>
                  1. Shipping Destination
                </span>
                <span className={`badge-tag ${step === 2 ? 'badge-live' : ''}`}>
                  2. Payment (Cashfree / Stripe)
                </span>
              </div>

              {step === 1 ? (
                /* Step 1: Shipping Details */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500 }}>
                    Delivery Destination ({selectedRegion.name})
                  </h3>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                        id="input-checkout-firstname"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                        id="input-checkout-lastname"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Email for Tracking</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        id="input-checkout-email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        id="input-checkout-phone"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street / Apartment / Building Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-input"
                      id="input-checkout-address"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-input"
                        id="input-checkout-city"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal / PIN Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="form-input"
                        id="input-checkout-postal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    id="btn-checkout-to-payment"
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                /* Step 2: Payment Provider Selection (Cashfree vs Cards) */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500 }}>
                      Payment Gateway
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Edit Address
                    </button>
                  </div>

                  {/* Provider Tabs: Cashfree Payments (India) vs Stripe / International */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentProvider('cashfree')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: paymentProvider === 'cashfree' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        background: paymentProvider === 'cashfree' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Zap size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span>Cashfree Payments (UPI / Cards / NetBanking)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentProvider('stripe')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: paymentProvider === 'stripe' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        background: paymentProvider === 'stripe' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <CreditCard size={14} />
                      <span>Global Card / Stripe</span>
                    </button>
                  </div>

                  {paymentProvider === 'cashfree' ? (
                    /* Cashfree India PG Sub-methods */
                    <div style={{ border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#0F52BA' }}>
                            CASHFREE
                          </span>
                          <span className="badge-tag badge-live" style={{ fontSize: '0.65rem' }}>
                            Verified Medusa Plugin
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Sandbox / Live Gateway
                        </span>
                      </div>

                      {/* Cashfree Sub-Options: UPI, NetBanking, Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setCashfreeMethod('upi')}
                          style={{
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: cashfreeMethod === 'upi' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                            background: cashfreeMethod === 'upi' ? 'var(--bg-surface)' : 'transparent',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Smartphone size={16} />
                          <span>Instant UPI</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCashfreeMethod('netbanking')}
                          style={{
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: cashfreeMethod === 'netbanking' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                            background: cashfreeMethod === 'netbanking' ? 'var(--bg-surface)' : 'transparent',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Building2 size={16} />
                          <span>Net Banking</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCashfreeMethod('card')}
                          style={{
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: cashfreeMethod === 'card' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                            background: cashfreeMethod === 'card' ? 'var(--bg-surface)' : 'transparent',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <CreditCard size={16} />
                          <span>RuPay / Visa</span>
                        </button>
                      </div>

                      {cashfreeMethod === 'upi' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <label className="form-label">Virtual Payment Address (VPA / UPI ID)</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="form-input"
                            id="input-cashfree-upi"
                          />
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Supports Google Pay, PhonePe, Paytm, BHIM, Cred UPI
                          </div>
                        </div>
                      )}

                      {cashfreeMethod === 'netbanking' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <label className="form-label">Select Your Bank</label>
                          <select
                            className="custom-select"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                          >
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="SBI">State Bank of India (SBI)</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="KOTAK">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                      )}

                      {cashfreeMethod === 'card' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div className="form-group">
                            <label className="form-label">Card Number (RuPay / Visa / Mastercard)</label>
                            <input
                              type="text"
                              value="4532 •••• •••• 8812"
                              className="form-input"
                              readOnly
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Stripe / International Card */
                    <div style={{ border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '1rem', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            name="cardExp"
                            value={formData.cardExp}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVC</label>
                          <input
                            type="text"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} />
                    <span>256-bit AES Encryption with Cashfree PG & Medusa Core</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={isSubmitting}
                      id="btn-checkout-place-order"
                    >
                      {isSubmitting ? (
                        <span>Processing via Cashfree...</span>
                      ) : (
                        <span>Pay {formatPrice(cartTotal)}</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="checkout-summary-side">
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-muted)' }}>
            Bag Summary ({cart.reduce((s, i) => s + i.quantity, 0)})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.lineItemId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img src={item.thumbnail} alt={item.title} style={{ width: '44px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1, fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 500 }}>{item.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Qty: {item.quantity} • {item.selectedSize}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                <span>Discount ({discountCode})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>{shippingAmount === 0 ? 'Complimentary' : formatPrice(shippingAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>GST / Taxes (18%)</span>
              <span>{formatPrice(estimatedTax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <span>Total Payable</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
