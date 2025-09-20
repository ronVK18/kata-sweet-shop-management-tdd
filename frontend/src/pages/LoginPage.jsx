import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      setUser(res.data.user);
      setToken(res.data.token);
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/sweets");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center p-8">
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-md"
      >
        ← Back to Home
      </button>
      
      {/* Login Form Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍭</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to your Sweet Dreams account</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input 
                  name="email" 
                  type="email"
                  placeholder="Enter your email" 
                  value={form.email} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={form.password} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </div>
              </div>
            </div>
          </div>
          
          {/* Login Button */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Sign In to Sweet Dreams
          </button>
        </form>
        
        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <a href="#" className="hover:text-purple-600 transition-colors">Forgot Password?</a>
            <span>•</span>
            <a href="#" className="hover:text-purple-600 transition-colors">Need Help?</a>
          </div>
          
          <div className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate("/register")}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
    </div>
  );
}

export default LoginPage;