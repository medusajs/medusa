import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Heart, ShoppingBag, Sun, Moon, Menu, X, Server, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { 
    totalCartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsSearchOpen,
    setIsBackendModalOpen,
    customer,
    setIsAuthModalOpen,
    setIsAccountDrawerOpen,
    setAppMode,
    selectedCategory,
    setSelectedCategory
  } = useStore();

  const { theme, toggleTheme } = useTheme();

  const categories = [
    { label: 'All Artifacts', val: 'All' },
    { label: 'Apparel', val: 'Apparel' },
    { label: 'Objects & Ceramics', val: 'Objects' },
    { label: 'Leather Goods', val: 'Leather' },
    { label: 'Timepieces', val: 'Timepieces' },
    { label: 'Scent & Living', val: 'Scent' }
  ];

  return (
    <header className="navbar-wrapper">
      <div className="atelier-container navbar-inner">
        {/* Left: Brand & Navigation */}
        <div className="nav-left">
          <a href="#" className="brand-logo" onClick={() => setSelectedCategory('All')}>
            <span className="brand-title">Atelier</span>
            <span className="brand-subtitle">Medusa Enterprise</span>
          </a>

          <nav className="desktop-nav" style={{ marginLeft: '1rem' }}>
            <ul className="nav-links">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.val}>
                  <button
                    className={`nav-link-btn ${selectedCategory === cat.val ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.val);
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    id={`nav-link-${cat.val.toLowerCase()}`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right: Actions & User Portal */}
        <div className="nav-right">
          {/* Admin Control Plane Switcher Button */}
          <button
            className="btn btn-secondary"
            style={{ 
              padding: '0.35rem 0.75rem', 
              fontSize: '0.75rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              borderRadius: 'var(--radius-full)'
            }}
            onClick={() => setAppMode('admin')}
            id="btn-nav-switch-to-admin"
            title="Open Medusa Enterprise Admin Module"
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent-gold)' }} />
            <span>Admin OS</span>
          </button>

          {/* Search Trigger */}
          <button
            className="btn-icon btn-icon-subtle"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Catalogue"
            id="btn-open-search"
            title="Search (⌘K)"
          >
            <Search size={18} />
          </button>

          {/* Patron Account Portal */}
          <button
            className="btn-icon btn-icon-subtle"
            onClick={() => {
              if (customer) {
                setIsAccountDrawerOpen(true);
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            aria-label="Patron Account Portal"
            id="btn-open-customer-account"
            title={customer ? `Signed in as ${customer.first_name}` : "Sign In to Account"}
          >
            <User size={18} />
          </button>

          {/* Medusa API Settings */}
          <button
            className="btn-icon btn-icon-subtle"
            onClick={() => setIsBackendModalOpen(true)}
            aria-label="Medusa Server Settings"
            id="btn-open-medusa-settings"
            title="Medusa Backend Config"
          >
            <Server size={18} />
          </button>

          {/* Theme Switcher */}
          <button
            className="btn-icon btn-icon-subtle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            id="btn-toggle-theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist Trigger */}
          <button
            className="btn-icon btn-icon-subtle"
            style={{ position: 'relative' }}
            onClick={() => setIsWishlistOpen(true)}
            aria-label="View Saved Items"
            id="btn-open-wishlist"
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="nav-badge-count" id="wishlist-count-badge">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Drawer Trigger */}
          <button
            className="btn-icon"
            style={{ 
              position: 'relative', 
              background: 'var(--bg-subtle)', 
              border: '1px solid var(--border-subtle)' 
            }}
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Bag"
            id="btn-open-cart"
            title="Shopping Bag"
          >
            <ShoppingBag size={18} />
            {totalCartCount > 0 && (
              <span className="nav-badge-count" id="cart-count-badge">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
