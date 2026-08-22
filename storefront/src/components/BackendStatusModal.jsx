import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Terminal, ExternalLink } from 'lucide-react';

export default function BackendStatusModal() {
  const {
    isBackendModalOpen,
    setIsBackendModalOpen,
    backendStatus,
    setBackendConfig,
    checkBackendHealth,
    addToast
  } = useStore();

  const [url, setUrl] = useState(backendStatus.url || 'http://localhost:9000');
  const [apiKey, setApiKey] = useState(backendStatus.key || '');
  const [forceMock, setForceMock] = useState(backendStatus.useMock);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isBackendModalOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await checkBackendHealth();
      setTestResult(res);
      if (res.online) {
        addToast('Connected to live Medusa server!', 'success');
      } else {
        addToast(`Medusa server not reachable: ${res.reason}`, 'info');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setBackendConfig(url, apiKey, forceMock);
    addToast('Medusa backend settings updated', 'success');
    setIsBackendModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsBackendModalOpen(false)}>
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'modalScale 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={20} />
            <h2 className="drawer-title" style={{ fontSize: '1.3rem' }}>Medusa Backend Integration</h2>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsBackendModalOpen(false)}
            aria-label="Close Settings"
            id="btn-close-backend-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status Alert */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: backendStatus.isLive ? 'rgba(43, 122, 86, 0.08)' : 'var(--bg-subtle)',
            border: `1px solid ${backendStatus.isLive ? 'rgba(43, 122, 86, 0.25)' : 'var(--border-subtle)'}`
          }}>
            {backendStatus.isLive ? (
              <CheckCircle2 size={18} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            )}
            <div style={{ fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {backendStatus.isLive 
                  ? 'Medusa Server Online & Linked' 
                  : (forceMock ? 'Standalone Curated Demo Mode Active' : 'Medusa Server Offline — Using Curated Fallback')}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                {backendStatus.isLive 
                  ? `Connected to ${backendStatus.url}` 
                  : 'The storefront functions in demo mode with full cart, wishlist & checkout simulation.'}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">Medusa Backend URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:9000"
              className="form-input"
              id="input-backend-url"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publishable API Key (Optional)</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pk_01..."
              className="form-input"
              id="input-publishable-key"
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={forceMock}
              onChange={(e) => setForceMock(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              id="checkbox-force-demo"
            />
            <span>Force Standalone Demo Mode (Bypass backend requests)</span>
          </label>

          {/* Quick instructions snippet */}
          <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              <Terminal size={13} /> Run your Medusa backend locally:
            </div>
            <code style={{ fontFamily: 'monospace', display: 'block', color: 'var(--text-primary)', background: 'var(--bg-surface)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
              npx @medusajs/medusa-cli develop
            </code>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTest}
              disabled={isTesting}
              id="btn-test-connection"
            >
              <RefreshCw size={14} className={isTesting ? 'spinning' : ''} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              id="btn-save-backend-settings"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
