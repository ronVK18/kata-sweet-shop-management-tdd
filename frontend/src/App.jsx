import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import SweetListPage from "./pages/SweetsListPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Sweet Shop</h1>} />
         <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/sweets" element={<SweetListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
