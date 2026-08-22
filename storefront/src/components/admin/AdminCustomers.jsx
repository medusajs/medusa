import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Search, User, Mail, Phone, MapPin, Package, X, Star } from 'lucide-react';

export default function AdminCustomers() {
  const { adminCustomers, selectedCustomer, setSelectedCustomer, isCustomerModalOpen, setIsCustomerModalOpen } = useAdmin();
  const { formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = adminCustomers.filter(c => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = `${c.first_name} ${c.last_name}`.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }
    return true;
  });

  const openCustomerDetail = (cust) => {
    setSelectedCustomer(cust);
    setIsCustomerModalOpen(true);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Directory & CRM</h1>
          <p className="admin-page-subtitle">Track registered patrons, lifetime value (LTV), address records, and purchasing history</p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', maxWidth: '360px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="promo-input"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patron Name</th>
                <th>Contact Info</th>
                <th>Tier</th>
                <th>Orders Placed</th>
                <th>Lifetime Spend (LTV)</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cust => (
                <tr key={cust.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem' }}>
                        {cust.first_name?.[0]}{cust.last_name?.[0]}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {cust.first_name} {cust.last_name}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{cust.email}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cust.phone}</div>
                  </td>
                  <td>
                    <span className="badge-tag badge-live">
                      {cust.tier || 'Collector'}
                    </span>
                  </td>
                  <td>
                    <strong>{cust.orders_count || 1}</strong> orders
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-green)' }}>
                      {formatPrice(cust.total_spent || 300)}
                    </strong>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {new Date(cust.created_at || '2026-01-01').toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => openCustomerDetail(cust)}
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {isCustomerModalOpen && selectedCustomer && (
        <div className="modal-backdrop" onClick={() => setIsCustomerModalOpen(false)}>
          <div 
            style={{
              width: '100%',
              maxWidth: '600px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              animation: 'modalScale 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={19} />
                <h2 className="drawer-title" style={{ fontSize: '1.3rem' }}>
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </h2>
              </div>
              <button className="btn-icon" onClick={() => setIsCustomerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Lifetime Spend</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                    {formatPrice(selectedCustomer.total_spent || 500)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                    {selectedCustomer.orders_count || 1}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                  <span>{selectedCustomer.phone || 'No phone recorded'}</span>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Registered Addresses
                </div>
                {(selectedCustomer.addresses || []).map(addr => (
                  <div key={addr.id} style={{ padding: '0.85rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {addr.address_1}, {addr.city} {addr.postal_code}, {addr.country_code?.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
