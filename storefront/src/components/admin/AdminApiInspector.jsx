import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { medusaClient } from '../../api/medusaClient';
import { Code, Play, CheckCircle2, AlertCircle, Clock, Copy, Check } from 'lucide-react';

export default function AdminApiInspector() {
  const { backendStatus } = useStore();
  const [selectedEndpoint, setSelectedEndpoint] = useState('/store/products');
  const [customParam, setCustomParam] = useState('');
  const [responseOutput, setResponseOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState(null);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { path: '/store/products', label: 'GET /store/products', scope: 'Storefront' },
    { path: '/store/products/prod_01', label: 'GET /store/products/:id', scope: 'Storefront' },
    { path: '/store/regions', label: 'GET /store/regions', scope: 'Storefront' },
    { path: '/store/collections', label: 'GET /store/collections', scope: 'Storefront' },
    { path: '/store/shipping-options', label: 'GET /store/shipping-options', scope: 'Storefront' },
    { path: '/admin/products', label: 'GET /admin/products', scope: 'Admin' },
    { path: '/admin/orders', label: 'GET /admin/orders', scope: 'Admin' },
    { path: '/admin/customers', label: 'GET /admin/customers', scope: 'Admin' },
    { path: '/admin/discounts', label: 'GET /admin/discounts', scope: 'Admin' }
  ];

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseOutput(null);
    const start = performance.now();

    try {
      let data;
      if (selectedEndpoint === '/store/products') {
        data = await medusaClient.getProducts();
      } else if (selectedEndpoint === '/store/products/prod_01') {
        data = await medusaClient.getProduct('prod_01');
      } else if (selectedEndpoint === '/store/regions') {
        data = await medusaClient.getRegions();
      } else if (selectedEndpoint === '/store/collections') {
        data = await medusaClient.getCollections();
      } else if (selectedEndpoint === '/store/shipping-options') {
        data = await medusaClient.getShippingOptions();
      } else if (selectedEndpoint === '/admin/products') {
        data = await medusaClient.getAdminProducts();
      } else if (selectedEndpoint === '/admin/orders') {
        data = await medusaClient.getAdminOrders();
      } else if (selectedEndpoint === '/admin/customers') {
        data = await medusaClient.getAdminCustomers();
      } else if (selectedEndpoint === '/admin/discounts') {
        data = await medusaClient.getAdminDiscounts();
      }
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResponseOutput({
        status: 200,
        statusText: 'OK',
        payload: data
      });
    } catch (err) {
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResponseOutput({
        status: 500,
        statusText: 'Error',
        payload: { error: err.message }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(JSON.stringify(responseOutput.payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Medusa REST API Inspector</h1>
          <p className="admin-page-subtitle">Real-time developer telemetry and interactive payload tester across Store & Admin endpoints</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '1.5rem' }}>
        {/* Left: Endpoint Picker */}
        <div className="admin-card">
          <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Available Medusa Endpoints
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {endpoints.map(ep => (
              <button
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: selectedEndpoint === ep.path ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: selectedEndpoint === ep.path ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace'
                }}
              >
                <span>{ep.label}</span>
                <span className={`badge-tag ${ep.scope === 'Admin' ? 'badge-demo' : 'badge-live'}`} style={{ fontSize: '0.65rem' }}>
                  {ep.scope}
                </span>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem' }}
            onClick={handleExecute}
            disabled={isLoading}
            id="btn-execute-api-call"
          >
            <Play size={14} />
            <span>{isLoading ? 'Executing Request...' : 'Send API Request'}</span>
          </button>
        </div>

        {/* Right: Live Response Payload Terminal */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Code size={18} />
              <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.88rem' }}>
                {backendStatus.url}{selectedEndpoint}
              </span>
            </div>

            {responseOutput && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge-tag badge-live">
                  HTTP {responseOutput.status} {responseOutput.statusText}
                </span>
                {latency !== null && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {latency}ms
                  </span>
                )}
                <button
                  className="btn-icon btn-icon-subtle"
                  onClick={handleCopy}
                  title="Copy JSON Payload"
                >
                  {copied ? <Check size={14} style={{ color: 'var(--accent-green)' }} /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>

          <div style={{ flex: 1, minHeight: '380px', maxHeight: '520px', overflowY: 'auto', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {!responseOutput ? (
              <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Select an endpoint and click <strong>Send API Request</strong> to inspect real-time JSON response payloads.
              </div>
            ) : (
              <pre style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(responseOutput.payload, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
