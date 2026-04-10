import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) { setWishlist([]); return; }
    try {
      const res = await wishlistAPI.getWishlist();
      setWishlist(res.data.products || []);
    } catch { setWishlist([]); }
  }, [isAuthenticated]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    const res = await wishlistAPI.toggleWishlist(productId);
    setWishlist(res.data.wishlist.products || []);
    return res.data.action;
  };

  const removeFromWishlist = async (productId) => {
    const res = await wishlistAPI.removeFromWishlist(productId);
    setWishlist(res.data.products || []);
  };

  const isWishlisted = (productId) => wishlist.some(p => (p._id || p) === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
