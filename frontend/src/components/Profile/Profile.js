import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await orderAPI.getOrders();
        setOrderCount(res.data.length);
      } catch {}
    };
    fetchStats();
  }, []);

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="container profile-container fade-in">
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <h2>{user?.name}</h2>
        <p className="email">{user?.email}</p>
        
        <div className="profile-stats">
          <div className="profile-stat">
            <h4>{orderCount}</h4>
            <p>Total Orders</p>
          </div>
          <div className="profile-stat">
            <h4>Member</h4>
            <p>Since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12, marginTop:32}}>
          <Link to="/orders" className="btn-gradient" style={{textAlign:'center'}}>📦 View Orders</Link>
          <Link to="/wishlist" className="btn-outline" style={{textAlign:'center'}}>❤️ My Wishlist</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
