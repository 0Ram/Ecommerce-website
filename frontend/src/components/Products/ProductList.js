import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from './ProductCard';
import Filters from './Filters';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '', category: searchParams.get('category') || 'All', minPrice: '', maxPrice: ''
  });

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setFilters(f => ({ ...f, category: cat }));
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category && filters.category !== 'All') params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        const res = await productsAPI.getProducts(params);
        setProducts(res.data.products || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h2>Our Products</h2>
        <p>Discover our curated collection of premium products</p>
      </div>
      <Filters filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="products-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your filters or search term</p>
          <button className="btn-outline" style={{marginTop:16}} onClick={() => setFilters({search:'',category:'All',minPrice:'',maxPrice:''})}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product._id} style={{animationDelay: `${index * 0.05}s`}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
