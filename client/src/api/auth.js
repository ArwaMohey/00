import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register user
const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Signup failed';
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Login failed';
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

export default {
  signup,
  login,
  logout
};