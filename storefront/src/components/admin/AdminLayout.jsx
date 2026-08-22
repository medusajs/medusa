import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Settings, 
  Code, 
  ArrowLeft, 
  Server, 
  Sparkles, 
  Download, 
  RefreshCw 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { adminTab, setAdminTab, loadAdminData, exportStoreData, isLoading } = useAdmin();
  const { setAppMode, backendStatus, setIsBackendModalOpen } = useStore();

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'discounts', label: 'Discounts & Promos', icon: Tag },
    { id: 'settings', label: 'Store & Medusa Settings', icon: Settings },
    { id: 'api', label: 'Medusa API Inspector', icon: Code }
  ];

  return (
    <div className="admin-container">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-row">
            <span className="admin-logo-title">Atelier</span>
            <span className="badge-tag badge-live" style={{ fontSize: '0.65rem' }}>Admin OS</span>
          </div>
          <div className="admin-logo-sub">Medusa Headless Control Plane</div>
        </div>

        {/* Back to storefront switch */}
        <div style={{ padding: '0.75rem 1rem' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.78rem', padding: '0.55rem 0.8rem', justifyContent: 'flex-start' }}
            onClick={() => setAppMode('store')}
            id="btn-admin-switch-to-store"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav-list">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = adminTab === item.id;
            return (
              <button
                key={item.id}
                className={`admin-nav-btn ${active ? 'active' : ''}`}
                onClick={() => setAdminTab(item.id)}
                id={`admin-nav-${item.id}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="admin-sidebar-footer">
          <div 
            className="announcement-status-pill"
            style={{ width: '100%', justifyContent: 'space-between', padding: '0.45rem 0.75rem', background: 'var(--bg-surface)' }}
            onClick={() => setIsBackendModalOpen(true)}
            title="Configure Medusa API Endpoint"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }}>
              <span className={`pulse-dot ${backendStatus.isLive ? '' : 'demo'}`} />
              <span>{backendStatus.isLive ? 'Medusa Connected' : 'Demo Engine'}</span>
            </div>
            <Server size={13} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.4rem', fontSize: '0.72rem' }}
              onClick={loadAdminData}
              title="Refresh Data"
            >
              <RefreshCw size={13} className={isLoading ? 'spinning' : ''} />
              <span>Sync</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.4rem', fontSize: '0.72rem' }}
              onClick={exportStoreData}
              title="Export Store JSON Backup"
            >
              <Download size={13} />
              <span>Backup</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="admin-content-area">
        {children}
      </main>
    </div>
  );
}
