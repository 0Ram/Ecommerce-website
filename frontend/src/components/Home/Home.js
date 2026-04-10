import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from '../Products/ProductCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productsAPI.getProducts({ limit: 8 });
        setFeatured(res.data.products || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Books', icon: '📚' },
    { name: 'Home', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Beauty', icon: '✨' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">🔥 New Collection 2026</div>
            <h1 className="hero-title">
              Discover <span>Premium</span> Products For You
            </h1>
            <p className="hero-subtitle">
              Explore our curated collection of premium products. From cutting-edge electronics 
              to stylish fashion — find everything you love at unbeatable prices.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-gradient" id="shop-now-btn">Shop Now →</Link>
              <Link to="/products?category=Electronics" className="btn-outline">Explore Electronics</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><h3>10K+</h3><p>Products</p></div>
              <div className="hero-stat"><h3>50K+</h3><p>Customers</p></div>
              <div className="hero-stat"><h3>4.9★</h3><p>Rating</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-grid">
              <div className="hero-grid-item">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop" alt="Shop" />
              </div>
              <div className="hero-grid-item">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=240&fit=crop" alt="Watch" />
              </div>
              <div className="hero-grid-item">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=240&fit=crop" alt="Sneakers" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item"><div className="trust-icon">🚚</div><h4>Free Shipping</h4><p>On orders over ₹500</p></div>
          <div className="trust-item"><div className="trust-icon">🔒</div><h4>Secure Payment</h4><p>100% protected</p></div>
          <div className="trust-item"><div className="trust-icon">↩️</div><h4>Easy Returns</h4><p>30-day return policy</p></div>
          <div className="trust-item"><div className="trust-icon">🎧</div><h4>24/7 Support</h4><p>Dedicated help center</p></div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find exactly what you're looking for</p>
        </div>
        <div className="category-chips">
          {categories.map(cat => (
            <Link to={`/products?category=${cat.name}`} className="category-chip" key={cat.name}>
              <span className="chip-icon">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked just for you</p>
          </div>
          {loading ? (
            <div className="products-grid">
              {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" />)}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div style={{textAlign:'center', marginTop:'32px'}}>
            <Link to="/products" className="btn-gradient">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <div className="container">
        <div className="promo-banner">
          <h2>🎉 Summer Sale — Up to 40% Off</h2>
          <p>Don't miss out on our biggest sale of the year</p>
          <Link to="/products" className="btn-outline" style={{borderColor:'rgba(255,255,255,0.3)', color:'#fff'}}>
            Shop the Sale →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
