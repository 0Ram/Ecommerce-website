import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getProducts({ limit: 100 });
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setDeleteId(null);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-icon">📋</span> Manage Products
          </h1>
          <p className="admin-subtitle">{products.length} products in store</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin" className="admin-btn admin-btn-ghost">← Dashboard</Link>
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">+ Add Product</Link>
        </div>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        {search && (
          <button className="admin-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} className="table-product-img" />
                </td>
                <td className="product-name-cell">
                  <span className="product-name-text">{product.name}</span>
                </td>
                <td><span className="category-chip">{product.category}</span></td>
                <td className="price-cell">${product.price.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 10 ? 'low' : 'ok'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>⭐ {product.rating}</td>
                <td className="actions-cell">
                  <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit-btn" title="Edit">
                    ✏️
                  </Link>
                  {deleteId === product._id ? (
                    <div className="delete-confirm">
                      <button onClick={() => handleDelete(product._id)} className="action-btn confirm-btn" title="Confirm Delete">✓</button>
                      <button onClick={() => setDeleteId(null)} className="action-btn cancel-btn" title="Cancel">✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(product._id)} className="action-btn delete-btn" title="Delete">
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No products found {search && `matching "${search}"`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
