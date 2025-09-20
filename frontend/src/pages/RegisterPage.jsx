import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      setUser(res.data.user);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-md"
      >
        ← Back to Home
      </button>
      
      {/* Register Form Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Sweet Dreams!</h2>
          <p className="text-gray-600">Create your account and start your sweet journey</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input 
                  name="name" 
                  type="text"
                  placeholder="Enter your full name" 
                  value={form.name} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  👤
                </div>
              </div>
            </div>
            
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
                  placeholder="Create a strong password" 
                  value={form.password} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use at least 6 characters with a mix of letters and numbers
              </p>
            </div>
          </div>
          
          {/* Register Button */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Create Sweet Dreams Account
          </button>
        </form>
        
        {/* Terms and Privacy */}
        <div className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">Privacy Policy</a>
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate("/login")}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Sign In Here
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <a href="#" className="hover:text-purple-600 transition-colors">Need Help?</a>
            <span>•</span>
            <a href="#" className="hover:text-purple-600 transition-colors">Contact Support</a>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-32 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3.5s' }}></div>
      <div className="absolute bottom-32 right-16 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}></div>
      <div className="absolute top-2/3 left-12 w-16 h-16 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.7s' }}></div>
      <div className="absolute top-1/4 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1.5s' }}></div>
      
      {/* Additional Sweet-themed floating elements */}
      <div className="absolute top-1/3 left-1/4 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.3s' }}>🍬</div>
      <div className="absolute bottom-1/4 right-1/3 text-3xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.2s' }}>🧁</div>
      <div className="absolute top-1/2 right-1/4 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '2s' }}>🍭</div>
    </div>
  );
}

export default RegisterPage;