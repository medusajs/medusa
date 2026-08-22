import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function CustomerAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginCustomer, registerCustomer, addToast } = useStore();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('julian.vane@architecture-studio.ch');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginCustomer(loginEmail, loginPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerCustomer({
        first_name: regFirstName,
        last_name: regLastName,
        email: regEmail,
        password: regPassword
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setLoginEmail('julian.vane@architecture-studio.ch');
    setLoginPassword('password123');
    addToast('Pre-filled VIP Patron credentials', 'info');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
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
            <User size={19} />
            <h2 className="drawer-title" style={{ fontSize: '1.3rem' }}>
              {tab === 'login' ? 'Patron Sign In' : 'Join Atelier'}
            </h2>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close Authentication"
            id="btn-close-auth-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: tab === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab === 'login' ? '2px solid var(--accent-primary)' : 'none',
              background: tab === 'login' ? 'var(--bg-surface)' : 'transparent'
            }}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: tab === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab === 'register' ? '2px solid var(--accent-primary)' : 'none',
              background: tab === 'register' ? 'var(--bg-surface)' : 'transparent'
            }}
            onClick={() => setTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.75rem' }}>
          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                    id="input-auth-login-email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-input"
                  id="input-auth-login-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', marginTop: '0.5rem' }}
                id="btn-auth-submit-login"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Account'}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={fillDemoAccount}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  color: 'var(--accent-gold)',
                  cursor: 'pointer',
                  marginTop: '0.25rem'
                }}
              >
                <Sparkles size={13} />
                <span>Fill VIP Patron Demo Account</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="form-input"
                    id="input-auth-reg-firstname"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="form-input"
                    id="input-auth-reg-lastname"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="form-input"
                  id="input-auth-reg-email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="form-input"
                  id="input-auth-reg-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', marginTop: '0.5rem' }}
                id="btn-auth-submit-register"
              >
                <span>{isLoading ? 'Creating Account...' : 'Join Atelier Community'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
