import React from 'react';
import { useStore } from '../context/StoreContext';
import { LayoutGrid, Grid3X3, Grid2X2, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function CategoryPills() {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    gridColumns,
    setGridColumns,
    filteredProducts,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    formatPrice
  } = useStore();

  const categories = [
    { label: 'All Artifacts', val: 'All' },
    { label: 'Apparel', val: 'Apparel' },
    { label: 'Objects & Ceramics', val: 'Objects' },
    { label: 'Leather Goods', val: 'Leather' },
    { label: 'Timepieces', val: 'Timepieces' },
    { label: 'Scent & Living', val: 'Scent' }
  ];

  return (
    <section className="filter-section" id="products-section">
      <div className="atelier-container">
        <div className="filter-toolbar">
          {/* Category Tabs */}
          <div className="category-pills" role="tablist">
            {categories.map(cat => (
              <button
                key={cat.val}
                className={`category-pill-btn ${selectedCategory === cat.val ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.val)}
                role="tab"
                aria-selected={selectedCategory === cat.val}
                id={`pill-category-${cat.val.toLowerCase()}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls: Sorting & Grid toggles */}
          <div className="filter-controls-group">
            {/* In stock toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                id="checkbox-in-stock"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort dropdown */}
            <div className="select-wrapper">
              <select
                className="custom-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                id="select-sort-by"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            {/* Grid layout toggle (Desktop) */}
            <div className="grid-cols-toggle" title="Layout View">
              <button
                className={`grid-col-btn ${gridColumns === 2 ? 'active' : ''}`}
                onClick={() => setGridColumns(2)}
                aria-label="2 Columns View"
              >
                <Grid2X2 size={16} />
              </button>
              <button
                className={`grid-col-btn ${gridColumns === 3 ? 'active' : ''}`}
                onClick={() => setGridColumns(3)}
                aria-label="3 Columns View"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                className={`grid-col-btn ${gridColumns === 4 ? 'active' : ''}`}
                onClick={() => setGridColumns(4)}
                aria-label="4 Columns View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? 'piece' : 'pieces'}</span>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')} 
              style={{ textDecoration: 'underline', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
