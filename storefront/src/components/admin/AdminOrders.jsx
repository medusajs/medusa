import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  X, 
  MapPin, 
  User, 
  Package, 
  AlertCircle, 
  FileText 
} from 'lucide-react';

export default function AdminOrders() {
  const { 
    adminOrders, 
    updateOrderStatus, 
    selectedOrder, 
    setSelectedOrder, 
    isOrderModalOpen, 
    setIsOrderModalOpen 
  } = useAdmin();

  const { formatPrice } = useStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTracking, setNewTracking] = useState('');

  const filteredOrders = adminOrders.filter(o => {
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending' && o.status !== 'pending') return false;
      if (filterStatus === 'shipped' && o.fulfillment_status !== 'shipped') return false;
      if (filterStatus === 'delivered' && o.fulfillment_status !== 'delivered') return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = (o.display_id || o.id).toString().toLowerCase().includes(q);
      const matchEmail = o.customer?.email?.toLowerCase().includes(q);
      const matchName = `${o.customer?.first_name} ${o.customer?.last_name}`.toLowerCase().includes(q);
      if (!matchId && !matchEmail && !matchName) return false;
    }
    return true;
  });

  const openInspectOrder = (order) => {
    setSelectedOrder(order);
    setNewTracking(order.tracking_number || '');
    setIsOrderModalOpen(true);
  };

  const handleUpdateTracking = (e) => {
    e.preventDefault();
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, {
        tracking_number: newTracking,
        fulfillment_status: 'shipped',
        status: 'processing'
      });
    }
  };

  const handleMarkDelivered = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, {
        fulfillment_status: 'delivered',
        status: 'completed'
      });
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders & Fulfillment Dispatch</h1>
          <p className="admin-page-subtitle">Process international dispatches, assign carrier tracking numbers, and manage customer shipments</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'shipped', 'delivered'].map(st => (
              <button
                key={st}
                className={`category-pill-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
                style={{ textTransform: 'capitalize' }}
              >
                {st} Orders
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '220px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by order ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="promo-input"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Placement Date</th>
                <th>Customer Name</th>
                <th>Destination</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Total Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.display_id || order.id.slice(-6)}</strong>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div>{order.customer?.first_name} {order.customer?.last_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.customer?.email}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {order.shipping_address?.city || 'New York'}, {order.shipping_address?.country_code?.toUpperCase() || 'US'}
                  </td>
                  <td>
                    <span className="badge-tag badge-live">
                      ● {order.payment_status || 'captured'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-tag ${order.fulfillment_status === 'delivered' ? 'badge-live' : 'badge-demo'}`}>
                      {order.fulfillment_status || 'not_fulfilled'}
                    </span>
                  </td>
                  <td>
                    <strong>{formatPrice(order.total)}</strong>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => openInspectOrder(order)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspection Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="modal-backdrop" onClick={() => setIsOrderModalOpen(false)}>
          <div 
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '92vh',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={19} />
                <h2 className="drawer-title" style={{ fontSize: '1.3rem' }}>
                  Order #{selectedOrder.display_id || selectedOrder.id.slice(-6)}
                </h2>
              </div>
              <button className="btn-icon" onClick={() => setIsOrderModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Status Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Fulfillment Status
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                    {selectedOrder.fulfillment_status || 'Pending'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedOrder.fulfillment_status !== 'delivered' && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={handleMarkDelivered}
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark as Delivered</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="form-grid-2">
                <div style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                    <User size={14} /> Customer Contact
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {selectedOrder.customer?.email}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedOrder.customer?.phone}
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                    <MapPin size={14} /> Shipping Destination
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedOrder.shipping_address?.address_1}<br />
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.postal_code}<br />
                    {selectedOrder.shipping_address?.country_code?.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Tracking Assignment */}
              <form onSubmit={handleUpdateTracking} style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.6rem' }}>
                  <Truck size={14} /> Carrier Tracking Number
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. DHL-EXP-9948201"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                    Save & Mark Shipped
                  </button>
                </div>
              </form>

              {/* Line Items */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Ordered Artifacts ({selectedOrder.items?.length || 0})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.6rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.title} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      )}
                      <div style={{ flex: 1, fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} • {item.variant?.title || item.selectedSize || 'Standard'}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {formatPrice((item.unit_price || item.price || 100) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '1.05rem', fontWeight: 700 }}>
                  <span>Grand Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
