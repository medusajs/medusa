import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { 
  Server, 
  Key, 
  Globe, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  CreditCard 
} from 'lucide-react';

export default function AdminSettings() {
  const { exportStoreData, loadAdminData } = useAdmin();
  const { backendStatus, setBackendConfig, setCashfreeConfig, checkBackendHealth, addToast, regions } = useStore();

  // Medusa Backend Credentials
  const [backendUrl, setBackendUrl] = useState(backendStatus.url || 'http://localhost:9000');
  const [publishableKey, setPublishableKey] = useState(backendStatus.key || '');
  const [adminToken, setAdminToken] = useState(backendStatus.adminToken || '');
  const [forceMock, setForceMock] = useState(backendStatus.useMock);
  const [isTesting, setIsTesting] = useState(false);

  // Cashfree PG Credentials
  const [cfAppId, setCfAppId] = useState(backendStatus.cashfreeAppId || 'TEST103849201');
  const [cfSecret, setCfSecret] = useState(backendStatus.cashfreeSecret || 'cfsk_ma_test_884920194829');
  const [cfEnv, setCfEnv] = useState(backendStatus.cashfreeEnv || 'sandbox');

  const handleTestHealth = async () => {
    setIsTesting(true);
    try {
      const res = await checkBackendHealth();
      if (res.online) {
        addToast('Successfully connected to Medusa backend!', 'success');
      } else {
        addToast(`Medusa connection note: ${res.reason}`, 'info');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveBackend = (e) => {
    e.preventDefault();
    setBackendConfig(backendUrl, publishableKey, adminToken, forceMock);
    setCashfreeConfig(cfAppId, cfSecret, cfEnv);
    addToast('Medusa & Cashfree payment settings saved', 'success');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.products) localStorage.setItem('medusa_admin_products', JSON.stringify(json.products));
        if (json.orders) localStorage.setItem('medusa_admin_orders', JSON.stringify(json.orders));
        if (json.customers) localStorage.setItem('medusa_admin_customers', JSON.stringify(json.customers));
        if (json.discounts) localStorage.setItem('medusa_admin_discounts', JSON.stringify(json.discounts));
        loadAdminData();
        addToast('Store data restored successfully from backup', 'success');
      } catch (err) {
        addToast('Invalid backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store, Medusa & Cashfree Settings</h1>
          <p className="admin-page-subtitle">Configure Medusa backend host endpoints, Cashfree Payments credentials for India (INR), and store data backup</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Left Column: Medusa Server & Cashfree Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Server size={18} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Medusa Engine Endpoint</h3>
            </div>

            <form onSubmit={handleSaveBackend} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">Medusa Server REST Endpoint</label>
                <input
                  type="text"
                  required
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:9000"
                  className="form-input"
                  id="input-admin-backend-url"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Store Publishable API Key (x-publishable-api-key)</label>
                <input
                  type="text"
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  placeholder="pk_01J8K..."
                  className="form-input"
                  id="input-admin-publishable-key"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Secret API Token / JWT</label>
                <input
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="medusa_admin_secret_..."
                  className="form-input"
                  id="input-admin-secret-token"
                />
              </div>

              {/* Cashfree PG Settings Section */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#0F52BA' }}>
                  <Zap size={16} /> Cashfree Payments India Integration (INR ₹)
                </div>

                <div className="form-group">
                  <label className="form-label">Cashfree App ID (Client ID)</label>
                  <input
                    type="text"
                    value={cfAppId}
                    onChange={(e) => setCfAppId(e.target.value)}
                    placeholder="TEST10..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cashfree Secret Key</label>
                  <input
                    type="password"
                    value={cfSecret}
                    onChange={(e) => setCfSecret(e.target.value)}
                    placeholder="cfsk_ma_..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cashfree Environment</label>
                  <select
                    className="custom-select"
                    value={cfEnv}
                    onChange={(e) => setCfEnv(e.target.value)}
                  >
                    <option value="sandbox">Sandbox (Testing / Mock)</option>
                    <option value="production">Production (Live Payments)</option>
                  </select>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={forceMock}
                  onChange={(e) => setForceMock(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Force Local Storefront Simulation (Offline Enterprise Demo Mode)</span>
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleTestHealth}
                  disabled={isTesting}
                  id="btn-admin-test-connection"
                >
                  <RefreshCw size={14} className={isTesting ? 'spinning' : ''} />
                  <span>{isTesting ? 'Pinging...' : 'Test Connection'}</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  id="btn-admin-save-settings"
                >
                  Update Engine Parameters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Regions & Backup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Regions */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Globe size={18} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Sales Regions</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {regions.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                  <div>
                    <strong>{r.name}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      Tax: {Math.round(r.tax_rate * 100)}% {r.id === 'reg_in' ? '(GST)' : ''}
                    </div>
                  </div>
                  <span className="badge-tag">{r.currency_code.toUpperCase()} ({r.currency_symbol})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <Download size={18} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Store Data Backup & Restore</h3>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Export or restore the complete catalog, orders ledger, customer database, and promotional rules.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.78rem' }}
                onClick={exportStoreData}
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>

              <label className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem', cursor: 'pointer' }}>
                <Upload size={14} />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
