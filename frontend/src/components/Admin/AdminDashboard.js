import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-icon">⚙️</span> Admin Dashboard
          </h1>
          <p className="admin-subtitle">Manage your store from here</p>
        </div>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          + Add New Product
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <h3>{stats?.totalCategories || 0}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/admin/products" className="action-card">
              <span className="action-icon">📋</span>
              <div>
                <h3>Manage Products</h3>
                <p>View, edit, and delete products</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/admin/products/new" className="action-card">
              <span className="action-icon">➕</span>
              <div>
                <h3>Add New Product</h3>
                <p>Create a new product listing</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/products" className="action-card">
              <span className="action-icon">🏪</span>
              <div>
                <h3>View Store</h3>
                <p>See your store as customers see it</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
          </div>
        </div>

        {stats?.recentProducts && stats.recentProducts.length > 0 && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Recently Added Products</h2>
              <Link to="/admin/products" className="view-all-link">View All →</Link>
            </div>
            <div className="recent-products-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img src={product.image} alt={product.name} className="table-product-img" />
                      </td>
                      <td>{product.name}</td>
                      <td><span className="category-chip">{product.category}</span></td>
                      <td className="price-cell">${product.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
