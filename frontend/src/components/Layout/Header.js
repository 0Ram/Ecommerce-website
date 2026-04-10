import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = user?.role === 'admin';

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="main-header">
      <div className="header-content">
        <Link to="/" className="logo"><h1>ShopNow</h1></Link>
        
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products')}`}>Products</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/wishlist" className={`nav-link ${isActive('/wishlist')}`}>♥ Wishlist</Link>
              <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>Orders</Link>
            </>
          )}
          
          <Link to="/cart" className={`nav-link cart-link ${isActive('/cart')}`}>
            🛒 Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              {isAdmin && (
                <Link to="/admin" className={`nav-link admin-nav-link ${isActive('/admin')}`}>
                  ⚙️ Admin
                </Link>
              )}
              <Link to="/profile" className="nav-link">
                <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
              </Link>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
