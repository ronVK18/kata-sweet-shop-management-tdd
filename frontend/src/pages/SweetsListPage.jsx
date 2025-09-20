import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import SweetCard from "../components/SweetCard";
import { AuthContext } from "../context/AuthContext";

function SweetListPage() {
  const { token } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sweets from backend
  useEffect(() => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchSweets = async () => {
      try {
        const res = await api.get("/sweets");
        
        // Check if res.data is an array, or if it has a 'sweets' property that is an array
        const fetchedSweets = res.data.sweets || res.data; 

        if (Array.isArray(fetchedSweets)) {
          setSweets(fetchedSweets);
          console.log(fetchedSweets);
        } else {
          setSweets([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch sweets");
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, [token]); // Added token to the dependency array

  // Purchase handler
  const handlePurchase = async (id) => {
  try {
    // Specify the quantity to be sent in the request body
    const quantityToPurchase = 1;
    
    // Send the POST request with the quantity in the body
    await api.get(`/sweets/${id}/purchase`, { quantity: quantityToPurchase });
    
    setSweets((prev) =>
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

  if (loading) return <p>Loading sweets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Sweets 🍬</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sweets.length > 0 ? (
          sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onPurchase={handlePurchase}
            />
          ))
        ) : (
          <p>No sweets available</p>
        )}
      </div>
    </div>
  );
}

export default SweetListPage;