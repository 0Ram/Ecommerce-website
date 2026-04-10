import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload.items || [], totalAmount: action.payload.totalAmount || 0, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'CLEAR':
      return { ...state, items: [], totalAmount: 0, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], totalAmount: 0, loading: false });
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { dispatch({ type: 'CLEAR' }); return; }
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch { dispatch({ type: 'CLEAR' }); }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartAPI.addToCart(productId, quantity);
    dispatch({ type: 'SET_CART', payload: res.data });
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await cartAPI.updateCartItem(productId, quantity);
    dispatch({ type: 'SET_CART', payload: res.data });
  };

  const removeItem = async (productId) => {
    const res = await cartAPI.removeFromCart(productId);
    dispatch({ type: 'SET_CART', payload: res.data });
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    dispatch({ type: 'CLEAR' });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, itemCount, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
