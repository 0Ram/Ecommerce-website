import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    fullName: '', address: '', city: '', state: '', zipCode: '', country: 'India', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = (subtotal + shipping + tax).toFixed(2);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v.trim())) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await orderAPI.createOrder({ shippingAddress: form, paymentMethod });
      setOrderId(res.data._id);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order #{orderId?.slice(-8)} has been confirmed</p>
          <div style={{display:'flex', gap:16, justifyContent:'center'}}>
            <Link to="/orders" className="btn-gradient">View Orders</Link>
            <Link to="/products" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container">
        <div className="empty-cart">
          <div className="empty-cart-content">
            <h2>Your cart is empty</h2>
            <p>Add some products before checking out</p>
            <Link to="/products" className="btn-gradient continue-shopping-btn">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <form onSubmit={handleSubmit}>
          <div className="shipping-form">
            <h3 style={{fontSize:18, fontWeight:700, marginBottom:8}}>Shipping Address</h3>
            {[
              { name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
              { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
              { name: 'address', label: 'Address', placeholder: '123 Main Street, Apt 4' },
            ].map(f => (
              <div key={f.name}>
                <label className="checkout-label">{f.label}</label>
                <input className="checkout-input" name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
              </div>
            ))}
            <div className="form-row">
              <div><label className="checkout-label">City</label><input className="checkout-input" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" /></div>
              <div><label className="checkout-label">State</label><input className="checkout-input" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" /></div>
            </div>
            <div className="form-row">
              <div><label className="checkout-label">ZIP Code</label><input className="checkout-input" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="400001" /></div>
              <div><label className="checkout-label">Country</label><input className="checkout-input" name="country" value={form.country} onChange={handleChange} /></div>
            </div>

            <h3 style={{fontSize:18, fontWeight:700, marginTop:24, marginBottom:8}}>Payment Method</h3>
            <div className="payment-methods">
              {['Cash on Delivery', 'Credit Card', 'Debit Card', 'UPI'].map(method => (
                <label key={method} className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={e => setPaymentMethod(e.target.value)} />
                  {method}
                </label>
              ))}
            </div>

            <button type="submit" className="btn-gradient checkout-btn" disabled={loading} style={{marginTop:24}}>
              {loading ? 'Placing Order...' : `Place Order — $${total}`}
            </button>
          </div>
        </form>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            {items.map(item => (
              <div key={item.product?._id} style={{display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:14, color:'var(--text-secondary)'}}>
                <span>{item.product?.name} × {item.quantity}</span>
                <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="summary-row"><span>Tax (18%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>${total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
