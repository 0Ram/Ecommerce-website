import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = 'Name is required';
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/products');
    } catch {}
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join ShopNow and start shopping</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" className={errors.name ? 'error' : ''} value={formData.name} onChange={handleChange} placeholder="John Doe" />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" className={errors.email ? 'error' : ''} value={formData.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className={errors.password ? 'error' : ''} value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" className={errors.confirmPassword ? 'error' : ''} value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn-gradient auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
