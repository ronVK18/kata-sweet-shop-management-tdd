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

    if (loading) return <p>Loading sweets...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Admin Panel</h2>
            <hr />

            {/* Form to Add New Sweet */}
            <h3>Add New Sweet</h3>
            <form onSubmit={handleAddSweet}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newSweet.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newSweet.category}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newSweet.price}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="quantityInStock"
                    placeholder="Quantity"
                    value={newSweet.quantityInStock}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Sweet</button>
            </form>

            <hr />

            {/* List of Existing Sweets */}
            <h3>Manage Existing Sweets</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                {sweets.map((sweet) => (
                    <div key={sweet._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <h4>{sweet.name}</h4>
                        <p>Category: {sweet.category}</p>
                        <p>Price: ${sweet.price}</p>
                        <p>Stock: {sweet.quantityInStock}</p>
                        <button onClick={() => { setIsEditing(true); setCurrentSweet(sweet); }}>Update</button>
                        <button onClick={() => handleDeleteSweet(sweet._id)}>Delete</button>
                    </div>
                ))}
            </div>

            <hr />

            {/* Form to Update Sweet */}
            {isEditing && (
                <div>
                    <h3>Update Sweet</h3>
                    <form onSubmit={handleUpdateSweet}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={currentSweet.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={currentSweet.category}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={currentSweet.price}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="quantityInStock"
                            placeholder="Quantity"
                            value={currentSweet.quantityInStock}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminSweetPanel;