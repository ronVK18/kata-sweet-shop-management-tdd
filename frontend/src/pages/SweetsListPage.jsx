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
      // await api.post(`/sweets/${id}/purchase`, { quantity: quantityToPurchase });

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

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-purple-600 font-semibold">Loading sweet treats...</p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="animate-bounce text-2xl" style={{ animationDelay: '0s' }}>🍬</div>
            <div className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>🍭</div>
            <div className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>🧁</div>
          </div>
        </div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Available Sweets 🍬</h2>
            <p className="text-xl opacity-90">Discover our delicious collection of premium sweets</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔍 Find Your Perfect Sweet
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Name Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter sweet name..."
                  value={searchParams.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <select 
                  name="category" 
                  value={searchParams.category} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📂
                </div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="0"
                  value={searchParams.minPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </div>
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="999"
                  value={searchParams.maxPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              🔍 Search Sweets
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {filteredSweets.length > 0 ? `Found ${filteredSweets.length} Sweet${filteredSweets.length !== 1 ? 's' : ''}` : 'No Sweets Found'}
          </h3>
          {searchParams.name || searchParams.category !== 'All' || searchParams.minPrice || searchParams.maxPrice ? (
            <button 
              onClick={() => {
                setSearchParams({ name: "", category: "All", minPrice: "", maxPrice: "" });
                setFilteredSweets(sweets);
              }}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center gap-1"
            >
              ✖️ Clear Filters
            </button>
          ) : null}
        </div>

        {/* Sweet List */}
        {filteredSweets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <SweetCard key={sweet._id} sweet={sweet} onPurchase={handlePurchase} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No sweets match your search</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => {
                setSearchParams({ name: "", category: "All", minPrice: "", maxPrice: "" });
                setFilteredSweets(sweets);
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Show All Sweets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetListPage;