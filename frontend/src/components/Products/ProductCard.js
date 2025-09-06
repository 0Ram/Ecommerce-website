import React from 'react';
import { cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartAPI.addToCart(product._id, 1);
      toast.success('Product added to cart!');
      // Trigger a custom event to update cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Error adding product to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < Math.floor(rating) ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-text">({product.rating})</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">${product.price}</div>
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        
        <div className="product-stock">
          {product.stock > 0 && <span>{product.stock} in stock</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
