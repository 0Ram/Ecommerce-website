import axios from 'axios';

// const API_URL = 'http://localhost:5001/api';
const API_URL = 'https://ecommerce-website-3-8iib.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) =>{ const data =api.post('/auth/login', credentials) },
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getProducts: (filters) => api.get('/products', { params: filters }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.put('/cart', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export default api;
