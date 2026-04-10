import React, { useState } from 'react';

const Filters = ({ filters, setFilters }) => {
  const [showMobile, setShowMobile] = useState(false);
  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="filters-container">
      <div className="filters-header" style={{display:'none'}}>
        <button className="filters-toggle" onClick={() => setShowMobile(!showMobile)}>
          {showMobile ? 'Hide Filters ▲' : 'Show Filters ▼'}
        </button>
      </div>
      <div className={`filters-content ${showMobile ? 'show' : ''}`}>
        <div className="filter-group" style={{flex:2}}>
          <label>Search</label>
          <input className="filter-input" placeholder="Search products..." value={filters.search} onChange={e => handleChange('search', e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select className="filter-select" value={filters.category} onChange={e => handleChange('category', e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Min Price</label>
          <input className="filter-input" type="number" placeholder="$0" value={filters.minPrice} onChange={e => handleChange('minPrice', e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Max Price</label>
          <input className="filter-input" type="number" placeholder="$999" value={filters.maxPrice} onChange={e => handleChange('maxPrice', e.target.value)} />
        </div>
        <button className="clear-filters-btn" onClick={() => setFilters({search:'',category:'All',minPrice:'',maxPrice:''})}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filters;
