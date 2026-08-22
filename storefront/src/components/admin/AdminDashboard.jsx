import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function AdminDashboard() {
  const { adminOrders, adminProducts, adminAnalytics, setAdminTab, setSelectedOrder, setIsOrderModalOpen } = useAdmin();
  const { formatPrice } = useStore();

  const lowStockProducts = adminProducts.filter(p => p.inventory_quantity <= 10);
  const recentOrders = adminOrders.slice(0, 5);

  const totalRevenue = adminOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) + (adminAnalytics?.gross_revenue || 0);

  return (
    <div className="admin-page">
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Commerce Dashboard</h1>
          <p className="admin-page-subtitle">Real-time telemetry and revenue performance across all Medusa channels</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Gross Revenue (YTD)</span>
            <div className="kpi-icon-box"><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">{formatPrice(totalRevenue)}</div>
          <div className="kpi-trend positive">
            <TrendingUp size={13} /> +18.4% vs last period
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Order Volume</span>
            <div className="kpi-icon-box"><ShoppingBag size={18} /></div>
          </div>
          <div className="kpi-value">{adminOrders.length + (adminAnalytics?.orders_count || 0)}</div>
          <div className="kpi-trend positive">
            <TrendingUp size={13} /> +12.1% this month
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Average Order Value</span>
            <div className="kpi-icon-box"><ArrowUpRight size={18} /></div>
          </div>
          <div className="kpi-value">{formatPrice(adminAnalytics?.average_order_value || 396.45)}</div>
          <div className="kpi-trend positive">
            <TrendingUp size={13} /> +4.2% luxury basket
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Catalog Artifacts</span>
            <div className="kpi-icon-box"><Package size={18} /></div>
          </div>
          <div className="kpi-value">{adminProducts.length}</div>
          <div className="kpi-trend" style={{ color: 'var(--text-secondary)' }}>
            {adminProducts.filter(p => p.status === 'published').length} Live in Storefront
          </div>
        </div>
      </div>

      {/* Analytics Chart & Low Stock Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Monthly Revenue Visual Bar Graph */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Monthly Revenue Trajectory</h3>
            <span className="badge-tag">USD ($)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '1rem', padding: '0 1rem' }}>
            {(adminAnalytics?.sales_trend || []).map((point, idx) => {
              const heightPercent = Math.round((point.value / 35000) * 100);
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    ${Math.round(point.value / 1000)}k
                  </div>
                  <div 
                    style={{
                      width: '100%',
                      maxWidth: '42px',
                      height: `${heightPercent}%`,
                      background: idx === (adminAnalytics?.sales_trend.length - 1) ? 'var(--accent-primary)' : 'var(--accent-subtle)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {point.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Inventory & Operational Alerts */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <AlertTriangle size={17} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Inventory Alerts</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lowStockProducts.slice(0, 4).map(prod => (
              <div 
                key={prod.id} 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.8rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                  {prod.title}
                </div>
                <span className="badge-tag" style={{ color: 'var(--accent-red)', borderColor: 'rgba(185,56,56,0.3)' }}>
                  {prod.inventory_quantity} left
                </span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '1.25rem', fontSize: '0.78rem', padding: '0.55rem' }}
            onClick={() => setAdminTab('products')}
          >
            Manage Catalog Stock
          </button>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Recent Customer Dispatches</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Live orders synced across Medusa store engine</p>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
            onClick={() => setAdminTab('orders')}
          >
            View All Orders ({adminOrders.length})
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Fulfillment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
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
                  <td>
                    <span className={`badge-tag ${order.fulfillment_status === 'delivered' ? 'badge-live' : 'badge-demo'}`}>
                      {order.fulfillment_status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <strong>{formatPrice(order.total)}</strong>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderModalOpen(true);
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
