import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productsAPI.getProduct(id);
        setProduct(res.data);
      } catch { toast.error('Product not found'); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.info('Please login to add to cart'); return; }
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add'); }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.info('Please login first'); return; }
    try {
      const action = await toggleWishlist(product._id);
      toast.success(action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="container"><div className="loading"><div className="spinner" /></div></div>;
  if (!product) return <div className="container"><div className="no-products"><h3>Product not found</h3><Link to="/products" className="btn-gradient" style={{marginTop:16, display:'inline-block'}}>Browse Products</Link></div></div>;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating) ? '★' : '☆');

  return (
    <div className="container product-detail">
      <div style={{marginBottom:24}}>
        <Link to="/products" className="nav-link" style={{color:'var(--text-secondary)'}}>← Back to Products</Link>
      </div>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <div className="product-detail-category">{product.category}</div>
          <h1>{product.name}</h1>
          <div className="product-rating" style={{margin:'16px 0'}}>
            {stars.map((s, i) => <span key={i} className={`star ${s === '★' ? 'filled' : ''}`}>{s}</span>)}
            <span className="rating-text">({product.rating})</span>
          </div>
          <div className="product-detail-price">${product.price.toFixed(2)}</div>
          <p className="product-detail-desc">{product.description}</p>
          
          <div className="product-detail-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
            <button className="btn-gradient" onClick={handleAddToCart} disabled={product.stock === 0} style={{flex:1}}>
              {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
            <button className={`btn-outline ${isWishlisted(product._id) ? '' : ''}`} onClick={handleWishlist}>
              {isWishlisted(product._id) ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="product-detail-meta">
            <div className="meta-item"><span>📦</span> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
            <div className="meta-item"><span>🚚</span> Free shipping on orders over $500</div>
            <div className="meta-item"><span>↩️</span> 30-day return policy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
