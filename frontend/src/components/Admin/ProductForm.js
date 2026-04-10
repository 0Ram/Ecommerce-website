import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    rating: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const loadProduct = useCallback(async () => {
    try {
      const response = await productsAPI.getProduct(id);
      const p = response.data;
      setForm({
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        category: p.category,
        stock: p.stock.toString(),
        rating: p.rating.toString(),
        image: p.image
      });
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [isEdit, loadProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        rating: parseFloat(form.rating) || 0,
        image: form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80'
      };

      if (isEdit) {
        await productsAPI.updateProduct(id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.createProduct(productData);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-icon">{isEdit ? '✏️' : '➕'}</span>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="admin-subtitle">
            {isEdit ? 'Update product details below' : 'Fill in the details to add a new product'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="admin-btn admin-btn-ghost">
          ← Back to Products
        </button>
      </div>

      <div className="product-form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Sony WH-1000XM5 Wireless Headphones"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a detailed product description..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="49.99"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="50"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Product Image</h3>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-xxx?w=600&h=600&fit=crop"
              />
              <span className="form-hint">
                💡 Tip: Go to <a href="https://unsplash.com" target="_blank" rel="noreferrer">unsplash.com</a>, 
                find an image, right-click → Copy Image Address, and paste it here.
              </span>
            </div>

            {form.image && (
              <div className="image-preview">
                <img
                  src={form.image}
                  alt="Preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  onLoad={(e) => { e.target.style.display = 'block'; }}
                />
                <span className="preview-label">Image Preview</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/products')} className="admin-btn admin-btn-ghost">
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
