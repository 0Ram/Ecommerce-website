import React, { useState, useEffect } from 'react';
import { cartAPI } from '../../services/api';
import CartItem from './CartItem';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      toast.error('Error fetching cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      setCart(response.data);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Error updating cart');
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        setCart({ items: [], totalAmount: 0 });
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Error clearing cart');
        console.error('Error clearing cart:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map(item => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdateQuantity={updateItemQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cart.items.length})</span>
              <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <div className="continue-shopping">
        <Link to="/products" className="continue-shopping-link">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
