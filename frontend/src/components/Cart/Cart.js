import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const Cart = () => {
  const { items, clearCart, loading } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = (subtotal + shipping + tax).toFixed(2);

  if (loading) return <div className="container"><div className="loading"><div className="spinner" /></div></div>;

  return (
    <div className="container cart-container">
      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <div style={{fontSize:64, marginBottom:24}}>🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/products" className="btn-gradient continue-shopping-btn">Start Shopping</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-header">
            <h2>Shopping Cart ({items.length})</h2>
            <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
          </div>
          <div className="cart-content">
            <div className="cart-items">
              {items.map(item => (
                <CartItem key={item.product?._id || item._id} item={item} />
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row"><span>Subtotal ({items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
                <div className="summary-row"><span>Tax (18%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="summary-row total"><span>Total</span><span>${total}</span></div>
                <Link to="/checkout" className="btn-gradient checkout-btn" style={{display:'block', textAlign:'center'}}>
                  Proceed to Checkout
                </Link>
                <div className="continue-shopping">
                  <Link to="/products" className="continue-shopping-link">← Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
