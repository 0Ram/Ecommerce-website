import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      await removeFromWishlist(product._id);
      toast.success('Moved to cart!');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="container wishlist-container fade-in">
      <h2>My Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div style={{fontSize:64, marginBottom:24}}>💝</div>
          <h3>Your wishlist is empty</h3>
          <p style={{color:'var(--text-secondary)', marginBottom:24}}>Save items you love for later</p>
          <Link to="/products" className="btn-gradient" style={{display:'inline-block'}}>Discover Products</Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map(product => (
            <div className="product-card" key={product._id}>
              <Link to={`/products/${product._id}`}>
                <div className="product-image"><img src={product.image} alt={product.name} /></div>
              </Link>
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-footer">
                  <span className="product-price">${product.price?.toFixed(2)}</span>
                </div>
                <div style={{display:'flex', gap:8, marginTop:12}}>
                  <button className="btn-gradient btn-sm" style={{flex:1}} onClick={() => handleMoveToCart(product)}>Move to Cart</button>
                  <button className="btn-danger btn-sm" onClick={() => { removeFromWishlist(product._id); toast.success('Removed'); }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
