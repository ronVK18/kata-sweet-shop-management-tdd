import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import SweetCard from "../components/SweetCard";
import { AuthContext } from "../context/AuthContext";

function SweetListPage() {
  const { token } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "All",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all sweets on mount
  useEffect(() => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchSweets = async () => {
      try {
        const res = await api.get("/sweets");
        const fetchedSweets = res.data.sweets || res.data;

        if (Array.isArray(fetchedSweets)) {
          setSweets(fetchedSweets);
          setFilteredSweets(fetchedSweets);

          const uniqueCategories = [
            "All",
            ...new Set(fetchedSweets.map((sweet) => sweet.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          setSweets([]);
          setFilteredSweets([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch sweets");
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, [token]);

  // Handle purchase
  const handlePurchase = async (id) => {
    try {
      const quantityToPurchase = 1;
      await api.post(`/sweets/${id}/purchase`, { quantity: quantityToPurchase });

      setSweets((prev) =>
        prev.map((sweet) =>
          sweet._id === id
            ? { ...sweet, quantityInStock: sweet.quantityInStock - quantityToPurchase }
            : sweet
        )
      );

      setFilteredSweets((prev) =>
        prev.map((sweet) =>
          sweet._id === id
            ? { ...sweet, quantityInStock: sweet.quantityInStock - quantityToPurchase }
            : sweet
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  // Handle search input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Search sweets
  const handleSearch = async () => {
    try {
      const query = new URLSearchParams();
      if (searchParams.name) query.append("name", searchParams.name);
      if (searchParams.category && searchParams.category !== "All")
        query.append("category", searchParams.category);
      if (searchParams.minPrice) query.append("minPrice", searchParams.minPrice);
      if (searchParams.maxPrice) query.append("maxPrice", searchParams.maxPrice);

      const res = await api.get(`/sweets/search?${query.toString()}`);
      const resultSweets = res.data.sweets || res.data;
      setFilteredSweets(resultSweets);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Search failed");
    }
  };

  if (loading) return <p>Loading sweets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Sweets 🍬</h2>

      {/* Search Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={searchParams.name}
          onChange={handleInputChange}
        />

        <select name="category" value={searchParams.category} onChange={handleInputChange}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          value={searchParams.minPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          value={searchParams.maxPrice}
          onChange={handleInputChange}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Sweet List */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredSweets.length > 0 ? (
          filteredSweets.map((sweet) => (
            <SweetCard key={sweet._id} sweet={sweet} onPurchase={handlePurchase} />
          ))
        ) : (
          <p>No sweets found</p>
        )}
      </div>
    </div>
  );
}

export default SweetListPage;
