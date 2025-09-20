import React from "react";

function SweetCard({ sweet, onPurchase }) {
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'chocolate': '🍫',
      'candy': '🍬',
      'gummy': '🐻',
      'lollipop': '🍭',
      'cake': '🧁',
      'cookie': '🍪',
      'ice cream': '🍦',
      'donut': '🍩',
      'pie': '🥧',
      'default': '🍯'
    };
    return emojiMap[category?.toLowerCase()] || emojiMap.default;
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (quantity <= 5) return { text: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const stockStatus = getStockStatus(sweet.quantityInStock);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 group">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12">
          {getCategoryEmoji(sweet.category)}
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
            {sweet.name}
          </h3>
          <div className="flex items-center gap-2 text-purple-100">
            <span className="text-sm">📂</span>
            <span className="text-sm font-medium capitalize">{sweet.category}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Price</span>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-purple-600">₹{sweet.price}</span>
              <span className="text-sm text-gray-500">per piece</span>
            </div>
          </div>
        </div>

        {/* Stock Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Availability</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.bg} ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
          
          {/* Stock Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                sweet.quantityInStock === 0 ? 'bg-red-500' :
                sweet.quantityInStock <= 5 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (sweet.quantityInStock / 20) * 100)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Quantity</span>
            <span className="font-semibold text-gray-700">
              {sweet.quantityInStock} {sweet.quantityInStock === 1 ? 'piece' : 'pieces'}
            </span>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={() => onPurchase(sweet._id)}
          disabled={sweet.quantityInStock === 0}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            sweet.quantityInStock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-300'
          }`}
        >
          {sweet.quantityInStock === 0 ? (
            <>
              <span>😔</span>
              <span>Out of Stock</span>
            </>
          ) : (
            <>
              <span>🛒</span>
              <span>Add to Cart</span>
            </>
          )}
        </button>

        {/* Quick Info */}
        {sweet.quantityInStock > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🚀 Fast delivery • 💯 Quality assured • 🔒 Secure payment
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

export default SweetCard;