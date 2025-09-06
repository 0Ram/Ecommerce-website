import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCart();
      const totalItems = response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      setCartItemsCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/products" className="logo">
            <h1>ShopNow</h1>
          </Link>

          <nav className="navigation">
            <Link to="/products" className="nav-link">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="nav-link cart-link">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                  )}
                </Link>
                
                <div className="user-menu">
                  <span className="user-name">Welcome, {user?.name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link signup-link">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
