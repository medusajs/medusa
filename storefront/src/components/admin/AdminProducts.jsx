import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Package, 
  Layers 
} from 'lucide-react';

export default function AdminProducts() {
  const { 
    adminProducts, 
    saveProduct, 
    deleteProduct, 
    toggleProductStatus,
    isProductModalOpen,
    setIsProductModalOpen,
    editingProduct,
    setEditingProduct
  } = useAdmin();

  const { formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Product Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Apparel',
    collection_id: 'col_apparel',
    material: '',
    origin: '',
    badge: 'New Arrival',
    status: 'published',
    thumbnail: '',
    inrPrice: 14990,
    usdPrice: 180,
    eurPrice: 165,
    gbpPrice: 140,
    jpyPrice: 28000,
    inventory: 20,
    description: ''
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Apparel',
      collection_id: 'col_apparel',
      material: '100% Organic Extrafine Cotton',
      origin: 'Milan, Italy',
      badge: 'New Release',
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
      inrPrice: 14990,
      usdPrice: 180,
      eurPrice: 165,
      gbpPrice: 140,
      jpyPrice: 28000,
      inventory: 25,
      description: 'Understated luxury piece crafted with sustainable materials.'
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle || '',
      category: product.category,
      collection_id: product.collection_id || 'col_all',
      material: product.material || '',
      origin: product.origin || '',
      badge: product.badge || '',
      status: product.status || 'published',
      thumbnail: product.thumbnail,
      inrPrice: product.prices?.inr || (product.prices?.usd ? product.prices.usd * 85 : 14990),
      usdPrice: product.prices?.usd || 180,
      eurPrice: product.prices?.eur || 165,
      gbpPrice: product.prices?.gbp || 140,
      jpyPrice: product.prices?.jpy || 28000,
      inventory: product.inventory_quantity || 10,
      description: product.description || ''
    });
    setIsProductModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const productPayload = {
      ...(editingProduct || {}),
      title: formData.title,
      subtitle: formData.subtitle,
      category: formData.category,
      collection_id: formData.collection_id,
      material: formData.material,
      origin: formData.origin,
      badge: formData.badge,
      status: formData.status,
      thumbnail: formData.thumbnail,
      images: [formData.thumbnail],
      prices: {
        inr: Number(formData.inrPrice),
        usd: Number(formData.usdPrice),
        eur: Number(formData.eurPrice),
        gbp: Number(formData.gbpPrice),
        jpy: Number(formData.jpyPrice)
      },
      inventory_quantity: Number(formData.inventory),
      description: formData.description
    };
    await saveProduct(productPayload);
  };

  const filtered = adminProducts.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Catalog & Multi-Currency Inventory</h1>
          <p className="admin-page-subtitle">Configure products, regional pricing (INR ₹, USD $, EUR €), and stock levels</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          id="btn-admin-add-product"
        >
          <Plus size={16} />
          <span>New Catalog Artifact</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="promo-input"
              style={{ width: '100%' }}
              id="input-admin-search-products"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              className="custom-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Apparel">Apparel</option>
              <option value="Objects">Objects & Ceramics</option>
              <option value="Leather">Leather Goods</option>
              <option value="Timepieces">Timepieces</option>
              <option value="Scent">Scent & Living</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artifact</th>
                <th>Category</th>
                <th>INR Price (₹)</th>
                <th>USD Price ($)</th>
                <th>EUR Price (€)</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        style={{ width: '42px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{product.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{product.material || product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-tag">{product.category}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-green)' }}>
                      ₹{(product.prices?.inr || (product.prices?.usd ? product.prices.usd * 85 : 14990)).toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td>
                    ${product.prices?.usd || 180}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    €{product.prices?.eur || 165}
                  </td>
                  <td>
                    <span className={`badge-tag ${product.inventory_quantity > 10 ? 'badge-live' : 'badge-demo'}`}>
                      {product.inventory_quantity} units
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle publish status"
                    >
                      <span className={`badge-tag ${product.status === 'published' ? 'badge-live' : ''}`}>
                        {product.status === 'published' ? '● Published' : '○ Draft'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn-icon btn-icon-subtle"
                        onClick={() => openEditModal(product)}
                        title="Edit Artifact"
                        id={`btn-edit-${product.id}`}
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        className="btn-icon btn-icon-subtle"
                        onClick={() => deleteProduct(product.id)}
                        title="Delete Artifact"
                        id={`btn-delete-${product.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Creation / Edit Modal */}
      {isProductModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div 
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto',
              animation: 'modalScale 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="drawer-header">
              <h2 className="drawer-title" style={{ fontSize: '1.3rem' }}>
                {editingProduct ? 'Edit Catalog Artifact' : 'Create New Catalog Artifact'}
              </h2>
              <button className="btn-icon" onClick={() => setIsProductModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  id="input-prod-title"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="custom-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Objects">Objects</option>
                    <option value="Leather">Leather</option>
                    <option value="Timepieces">Timepieces</option>
                    <option value="Scent">Scent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Multi-Currency Price Grid (INR, USD, EUR) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">India Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.inrPrice}
                    onChange={(e) => setFormData({ ...formData, inrPrice: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">USD Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.usdPrice}
                    onChange={(e) => setFormData({ ...formData, usdPrice: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">EUR Price (€)</label>
                  <input
                    type="number"
                    required
                    value={formData.eurPrice}
                    onChange={(e) => setFormData({ ...formData, eurPrice: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Inventory Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Publish Status</label>
                  <select
                    className="custom-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Material & Craft</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Provenance Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Editorial Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  id="btn-admin-save-product"
                >
                  {editingProduct ? 'Save Changes' : 'Create Artifact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
