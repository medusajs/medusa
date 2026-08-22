import React from 'react';
import { useStore } from '../context/StoreContext';
import { Globe, Radio, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  const { 
    backendStatus, 
    setIsBackendModalOpen, 
    regions, 
    selectedRegion, 
    setSelectedRegion 
  } = useStore();

  return (
    <div className="announcement-bar">
      <div className="atelier-container" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="announcement-status-pill"
            onClick={() => setIsBackendModalOpen(true)}
            title="Click to configure Medusa Backend URL & API Key"
            id="btn-backend-status"
          >
            <span className={`pulse-dot ${backendStatus.isLive ? '' : 'demo'}`} />
            <span>
              {backendStatus.isLive 
                ? 'Medusa Server: Connected' 
                : (backendStatus.useMock ? 'Demo Mode' : 'Medusa Offline (Demo Mode)')}
            </span>
          </button>
        </div>

        <div className="announcement-bar-content">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-gold)' }} />
            Complimentary Worldwide Shipping on Orders over $200 — Use Code <strong>MEDUSA10</strong> for 10% Off
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="region-dropdown">
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const reg = regions.find(r => r.id === e.target.value);
                if (reg) setSelectedRegion(reg);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
              id="select-region"
            >
              {regions.map(r => (
                <option key={r.id} value={r.id} style={{ color: '#111' }}>
                  {r.name} ({r.currency_code.toUpperCase()} {r.currency_symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
