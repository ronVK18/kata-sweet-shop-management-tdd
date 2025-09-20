import React from "react";

function SweetCard({ sweet, onPurchase }) {
  return (
    <div className="sweet-card" style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", borderRadius: "8px" }}>
      <h3>{sweet.name}</h3>
      <p>Category: {sweet.category}</p>
      <p>Price: ₹{sweet.price}</p>
      <p>Quantity: {sweet.quantity}</p>
      <button 
        onClick={() => onPurchase(sweet._id)} 
        disabled={sweet.quantity === 0}
        style={{ padding: "5px 10px", cursor: sweet.quantity === 0 ? "not-allowed" : "pointer" }}
      >
        {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
      </button>
    </div>
  );
}

export default SweetCard;
