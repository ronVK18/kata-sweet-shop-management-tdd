import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const AdminSweetPanel = () => {
    const { token } = useContext(AuthContext);
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSweet, setCurrentSweet] = useState(null);
    const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantityInStock: '' });

    // Fetch all sweets on component mount
    useEffect(() => {
        const fetchSweets = async () => {
            try {
                const res = await api.get('/sweets');
                setSweets(res.data.sweets || []);
            } catch (err) {
                setError('Failed to fetch sweets');
            } finally {
                setLoading(false);
            }
        };
        fetchSweets();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isEditing) {
            setCurrentSweet({ ...currentSweet, [name]: value });
        } else {
            setNewSweet({ ...newSweet, [name]: value });
        }
    };

    const handleAddSweet = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sweets', newSweet);
            alert('Sweet added successfully!');
            setNewSweet({ name: '', category: '', price: '', quantityInStock: '' });
            // Re-fetch sweets to show the new one
            const res = await api.get('/sweets');
            setSweets(res.data.sweets || []);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add sweet');
        }
    };

    const handleUpdateSweet = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/sweets/${currentSweet._id}`, currentSweet);
            alert('Sweet updated successfully!');
            setIsEditing(false);
            setCurrentSweet(null);
            // Re-fetch sweets to show the updated one
            const res = await api.get('/sweets');
            setSweets(res.data.sweets || []);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update sweet');
        }
    };

    const handleDeleteSweet = async (id) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await api.delete(`/sweets/${id}`);
                alert('Sweet deleted successfully!');
                // Filter out the deleted sweet from the state
                setSweets(sweets.filter(sweet => sweet._id !== id));
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete sweet');
            }
        }
    };

    // Get category emoji
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

    // Loading Component
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl text-purple-600 font-semibold">Loading admin panel...</p>
                    <div className="flex justify-center space-x-2 mt-4">
                        <div className="animate-bounce text-2xl" style={{ animationDelay: '0s' }}>⚙️</div>
                        <div className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>🛠️</div>
                        <div className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>👑</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error Component
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel Error</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">👑</div>
                        <div>
                            <h2 className="text-4xl font-bold mb-2">Admin Dashboard</h2>
                            <p className="text-xl opacity-90">Manage your sweet inventory with ease</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl mb-2">🍬</div>
                        <h3 className="text-2xl font-bold text-purple-600">{sweets.length}</h3>
                        <p className="text-gray-600">Total Sweets</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl mb-2">📦</div>
                        <h3 className="text-2xl font-bold text-green-600">
                            {sweets.reduce((sum, sweet) => sum + sweet.quantityInStock, 0)}
                        </h3>
                        <p className="text-gray-600">Total Stock</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl mb-2">⚠️</div>
                        <h3 className="text-2xl font-bold text-amber-600">
                            {sweets.filter(sweet => sweet.quantityInStock <= 5).length}
                        </h3>
                        <p className="text-gray-600">Low Stock</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl mb-2">📂</div>
                        <h3 className="text-2xl font-bold text-indigo-600">
                            {new Set(sweets.map(sweet => sweet.category)).size}
                        </h3>
                        <p className="text-gray-600">Categories</p>
                    </div>
                </div>

                {/* Add New Sweet Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="text-3xl">➕</div>
                        <h3 className="text-2xl font-bold text-gray-800">Add New Sweet</h3>
                    </div>
                    
                    <form onSubmit={handleAddSweet}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sweet Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter sweet name"
                                        value={newSweet.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        🏷️
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="e.g., chocolate, candy"
                                        value={newSweet.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        📂
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="0.00"
                                        value={newSweet.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        ₹
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="quantityInStock"
                                        placeholder="0"
                                        value={newSweet.quantityInStock}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        📦
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                        >
                            <span>➕</span>
                            Add Sweet to Inventory
                        </button>
                    </form>
                </div>

                {/* Existing Sweets Management */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">📋</div>
                            <h3 className="text-2xl font-bold text-gray-800">Manage Existing Sweets</h3>
                        </div>
                        <div className="text-sm text-gray-500">
                            {sweets.length} sweet{sweets.length !== 1 ? 's' : ''} in inventory
                        </div>
                    </div>

                    {sweets.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📭</div>
                            <h4 className="text-xl font-semibold text-gray-600 mb-2">No sweets in inventory</h4>
                            <p className="text-gray-500">Add your first sweet to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sweets.map((sweet) => (
                                <div key={sweet._id} className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                                    {/* Sweet Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-2xl">{getCategoryEmoji(sweet.category)}</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800">{sweet.name}</h4>
                                            <p className="text-sm text-gray-500 capitalize">{sweet.category}</p>
                                        </div>
                                    </div>

                                    {/* Sweet Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-semibold text-purple-600">₹{sweet.price}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Stock:</span>
                                            <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                                                sweet.quantityInStock === 0 ? 'bg-red-100 text-red-600' :
                                                sweet.quantityInStock <= 5 ? 'bg-amber-100 text-amber-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                                {sweet.quantityInStock} units
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => { setIsEditing(true); setCurrentSweet(sweet); }}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <span>✏️</span>
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSweet(sweet._id)}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <span>🗑️</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Update Sweet Form */}
                {isEditing && currentSweet && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="text-3xl">✏️</div>
                                <h3 className="text-2xl font-bold text-gray-800">Update Sweet</h3>
                            </div>
                            
                            <form onSubmit={handleUpdateSweet}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sweet Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter sweet name"
                                                value={currentSweet.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                🏷️
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="category"
                                                placeholder="e.g., chocolate, candy"
                                                value={currentSweet.category}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                📂
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price (₹)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="price"
                                                placeholder="0.00"
                                                value={currentSweet.price}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                ₹
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock Quantity
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="quantityInStock"
                                                placeholder="0"
                                                value={currentSweet.quantityInStock}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                📦
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>💾</span>
                                        Save Changes
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>❌</span>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSweetPanel;