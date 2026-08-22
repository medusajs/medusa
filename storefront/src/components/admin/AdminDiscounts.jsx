import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Tag, Trash2, Check, X, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminDiscounts() {
  const { 
    adminDiscounts, 
    saveDiscount, 
    toggleDiscountActive, 
    deleteDiscount,
    isDiscountModalOpen,
    setIsDiscountModalOpen
  } = useAdmin();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: 10,
    usage_limit: 100
  });

  const openCreateModal = () => {
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      value: 15,
      usage_limit: 200
    });
    setIsDiscountModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await saveDiscount({
      code: formData.code.toUpperCase().trim(),
      description: formData.description,
      type: formData.type,
      value: Number(formData.value),
      usage_limit: Number(formData.usage_limit)
    });
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Promotions & Discount Codes</h1>
          <p className="admin-page-subtitle">Configure percentage cuts, fixed deductions, and complimentary shipping campaigns across Medusa checkouts</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          id="btn-admin-add-discount"
        >
          <Plus size={16} />
          <span>New Promotion Code</span>
        </button>
      </div>

      {/* Discounts Grid / Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Type</th>
                <th>Benefit Value</th>
                <th>Redemptions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminDiscounts.map(disc => (
                <tr key={disc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Tag size={14} style={{ color: 'var(--accent-gold)' }} />
                      <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem' }}>{disc.code}</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {disc.description}
                  </td>
                  <td>
                    <span className="badge-tag" style={{ textTransform: 'capitalize' }}>
                      {disc.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <strong>
                      {disc.type === 'percentage' ? `${disc.value}% OFF` : (disc.type === 'free_shipping' ? 'Free Shipping' : `$${disc.value} OFF`)}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      <strong>{disc.usage_count || 0}</strong> / {disc.usage_limit || '∞'} used
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleDiscountActive(disc.id)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle status"
                    >
                      <span className={`badge-tag ${disc.is_active ? 'badge-live' : ''}`}>
                        {disc.is_active ? '● Active' : '○ Paused'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-icon btn-icon-subtle"
                      onClick={() => deleteDiscount(disc.id)}
                      title="Delete Promo Code"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isDiscountModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDiscountModalOpen(false)}>
          <div 
            style={{
              width: '100%',
              maxWidth: '520px',
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
              <h2 className="drawer-title" style={{ fontSize: '1.3rem' }}>
                Create Promotion Campaign
              </h2>
              <button className="btn-icon" onClick={() => setIsDiscountModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIPTEN"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                  id="input-discount-code"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campaign Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% VIP discount for newsletter subscribers"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select
                    className="custom-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                {formData.type !== 'free_shipping' && (
                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Max Usage Limit</label>
                <input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDiscountModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  id="btn-admin-save-discount"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
