import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getOrders();
        setOrders(res.data);
      } catch { toast.error('Failed to load orders'); }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await orderAPI.cancelOrder(id);
      setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: 'Cancelled' } : o));
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  const statusClass = (status) => `order-status status-${status.toLowerCase().replace(/\s+/g, '')}`;

  if (loading) return <div className="container"><div className="loading"><div className="spinner" /></div></div>;

  return (
    <div className="container orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="wishlist-empty">
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/products" className="btn-gradient" style={{display:'inline-block', marginTop:20}}>Shop Now</Link>
        </div>
      ) : (
        orders.map(order => (
          <div className="order-card" key={order._id}>
            <div className="order-top">
              <div>
                <div className="order-id">Order #{order._id.slice(-8)}</div>
                <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
              </div>
              <span className={statusClass(order.orderStatus)}>{order.orderStatus}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <div className="order-item-img"><img src={item.image} alt={item.name} /></div>
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div>
                <span className="order-total-label">Payment: {order.paymentMethod}</span>
                {!['Shipped','Delivered','Cancelled','Out for Delivery'].includes(order.orderStatus) && (
                  <button className="btn-danger btn-sm" style={{marginLeft:16}} onClick={() => handleCancel(order._id)}>Cancel Order</button>
                )}
              </div>
              <span className="order-total-amount">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
