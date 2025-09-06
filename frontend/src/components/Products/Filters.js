import React, { useState } from 'react';

const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const Filters = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'All',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <button
          className="filters-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters {showFilters ? '−' : '+'}
        </button>
      </div>

      <div className={`filters-content ${showFilters ? 'show' : ''}`}>
        <div className="filter-group">
          <label>Search Products</label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Min Price ($)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Max Price ($)</label>
            <input
              type="number"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
