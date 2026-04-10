import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>ShopNow</h3>
          <p>Your premium destination for quality products. Discover a curated collection of the finest items across electronics, fashion, books, and more.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?category=Books">Books</Link>
          <Link to="/products?category=Home">Home</Link>
          <Link to="/products?category=Sports">Sports</Link>
          <Link to="/products?category=Beauty">Beauty</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/profile">My Account</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Shopping Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#contact">Contact Us</a>
          <a href="#faq">FAQ</a>
          <a href="#shipping">Shipping Info</a>
          <a href="#returns">Returns</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ShopNow. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#twitter" className="social-link" aria-label="Twitter">𝕏</a>
          <a href="#instagram" className="social-link" aria-label="Instagram">📷</a>
          <a href="#github" className="social-link" aria-label="GitHub">⌨</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
