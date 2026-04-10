import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import Orders from './components/Orders/Orders';
import Wishlist from './components/Wishlist/Wishlist';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProducts from './components/Admin/AdminProducts';
import ProductForm from './components/Admin/ProductForm';

import './index.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  
                  {/* Admin Routes */}
                  <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="admin/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
                  <Route path="admin/products/edit/:id" element={<AdminRoute><ProductForm /></AdminRoute>} />
                </Route>
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                theme="dark"
              />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
