import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import ProductCard from './ProductCard';
import Filters from './Filters';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryFilters = { ...filters };
      if (queryFilters.category === 'All') {
        delete queryFilters.category;
      }
      
      const response = await productsAPI.getProducts(queryFilters);
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Error fetching products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list-container">
      <div className="page-header">
        <h2>Our Products</h2>
        <p>Discover amazing products at great prices</p>
      </div>

      <Filters filters={filters} onFilterChange={handleFilterChange} />

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
