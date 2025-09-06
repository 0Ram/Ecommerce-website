import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      onRemove(product._id);
    } else {
      onUpdateQuantity(product._id, newQuantity);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="item-details">
        <h4 className="item-name">{product.name}</h4>
        <p className="item-category">{product.category}</p>
        <p className="item-price">${product.price}</p>
      </div>

      <div className="item-quantity">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="quantity-btn"
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className="quantity">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="quantity-btn"
        >
          +
        </button>
      </div>

      <div className="item-total">
        <div className="subtotal">${subtotal.toFixed(2)}</div>
        <button
          onClick={() => onRemove(product._id)}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
