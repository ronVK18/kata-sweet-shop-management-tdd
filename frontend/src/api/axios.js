import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// Add a request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from context if you prefer
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
