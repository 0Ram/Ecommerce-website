import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await login(formData);
      navigate('/products');
    } catch {}
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your ShopNow account</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className={errors.email ? 'error' : ''} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className={errors.password ? 'error' : ''} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter your password" />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <button type="submit" className="btn-gradient auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
