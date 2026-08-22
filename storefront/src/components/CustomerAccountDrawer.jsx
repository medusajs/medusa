import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Package, MapPin, LogOut, CheckCircle2, Truck, Clock } from 'lucide-react';
import { MOCK_ORDERS } from '../api/mockData';

export default function CustomerAccountDrawer() {
  const {
    isAccountDrawerOpen,
    setIsAccountDrawerOpen,
    customer,
    logoutCustomer,
    formatPrice
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'addresses'

  if (!isAccountDrawerOpen || !customer) return null;

  // Retrieve customer's orders from local storage / mock data
  const localOrders = JSON.parse(localStorage.getItem('medusa_admin_orders') || '[]');
  const allOrders = [...localOrders, ...MOCK_ORDERS];
  const customerOrders = allOrders.filter(o => 
    o.customer?.email?.toLowerCase() === customer.email?.toLowerCase() ||
    o.customer?.id === customer.id
  );

  return (
    <div className="drawer-backdrop" onClick={() => setIsAccountDrawerOpen(false)}>
      <div 
        className="drawer-panel" 
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={20} />
            <h2 className="drawer-title">Patron Profile</h2>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsAccountDrawerOpen(false)}
            aria-label="Close Account Panel"
            id="btn-close-account-drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div style={{ padding: '1.5rem 1.75rem', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {customer.first_name} {customer.last_name}
              </h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {customer.email}
              </div>
            </div>
            <span className="badge-tag badge-live">
              {customer.tier || 'Collector'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Orders: </span>
              <strong>{customerOrders.length || customer.orders_count || 1}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Member Since: </span>
              <strong>2026</strong>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: activeTab === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'orders' ? '2px solid var(--accent-primary)' : 'none'
            }}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={15} />
            <span>Order History ({customerOrders.length})</span>
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: activeTab === 'addresses' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'addresses' ? '2px solid var(--accent-primary)' : 'none'
            }}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={15} />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="drawer-body">
          {activeTab === 'orders' ? (
            customerOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                <Package size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <p>No previous orders found under this account.</p>
              </div>
            ) : (
              customerOrders.map(order => (
                <div 
                  key={order.id}
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Order #{order.display_id || order.id.slice(-6)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge-tag ${order.fulfillment_status === 'delivered' ? 'badge-live' : 'badge-demo'}`}>
                      {order.fulfillment_status || order.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.6rem' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>{item.quantity}x {item.title}</span>
                        <span style={{ fontWeight: 500 }}>{formatPrice(item.unit_price || item.price || 100)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Paid</span>
                    <strong style={{ fontSize: '0.95rem' }}>{formatPrice(order.total)}</strong>
                  </div>

                  {order.tracking_number && (
                    <div style={{ fontSize: '0.75rem', background: 'var(--bg-subtle)', padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <Truck size={13} /> Tracking: <strong>{order.tracking_number}</strong>
                    </div>
                  )}
                </div>
              ))
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(customer.addresses || []).length === 0 ? (
                <div style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No saved addresses. Your address will be saved during checkout.
                </div>
              ) : (
                customer.addresses.map(addr => (
                  <div key={addr.id} style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Default Shipping Address</span>
                      <span className="badge-tag badge-live">Active</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {addr.address_1}<br />
                      {addr.city}, {addr.postal_code}<br />
                      {addr.country_code?.toUpperCase()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Logout */}
        <div className="drawer-footer">
          <button
            className="btn btn-secondary"
            onClick={logoutCustomer}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            id="btn-account-logout"
          >
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
