import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const product = item.product;

  if (!product) return null;

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="item-details">
        <h4>{product.name}</h4>
        <div className="item-category">{product.category}</div>
        <div className="item-price">${product.price?.toFixed(2)}</div>
      </div>
      <div className="item-quantity">
        <button className="quantity-btn" onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
        <span className="quantity">{item.quantity}</span>
        <button className="quantity-btn" onClick={() => updateQuantity(product._id, item.quantity + 1)} disabled={item.quantity >= product.stock}>+</button>
      </div>
      <div className="item-total">
        <div className="subtotal">${(product.price * item.quantity).toFixed(2)}</div>
        <button className="remove-btn" onClick={() => removeItem(product._id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
