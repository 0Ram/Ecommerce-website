import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.info('Please login to add to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch { toast.error('Failed to add to cart'); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.info('Please login first'); return; }
    try {
      const action = await toggleWishlist(product._id);
      toast.success(action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating) ? '★' : '☆');

  return (
    <div className="product-card" id={`product-${product._id}`}>
      <Link to={`/products/${product._id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.stock === 0 && <span className="out-of-stock">Sold Out</span>}
          <div className="product-actions-overlay">
            <button className={`overlay-btn ${isWishlisted(product._id) ? 'wishlisted' : ''}`} onClick={handleWishlist} title="Wishlist">
              {isWishlisted(product._id) ? '❤️' : '🤍'}
            </button>
            <button className="overlay-btn" onClick={handleAddToCart} disabled={product.stock === 0} title="Add to cart">🛒</button>
          </div>
        </div>
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/products/${product._id}`}><h3 className="product-name">{product.name}</h3></Link>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          {stars.map((s, i) => <span key={i} className={`star ${s === '★' ? 'filled' : ''}`}>{s}</span>)}
          <span className="rating-text">({product.rating})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
        {product.stock > 0 && <div className="product-stock">{product.stock} in stock</div>}
      </div>
    </div>
  );
};

export default ProductCard;
