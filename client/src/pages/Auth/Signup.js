import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import '../../styles/Auth.css';
import { useAuth } from '../../components/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      const { passwordConfirm, ...signupData } = formData;
      const response = await authService.register(signupData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setAuthUser(response.data.user);
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-logo-container">
          <img src="/logo.png" alt="University Health Companion Logo" className="auth-logo" />
        </div>
        <h2>University Health Companion</h2>
        <p>Your personal health assistant on campus</p>
        <ul className="auth-features">
          <li><img src="/calendar-icon.png" alt="" /> Easy appointment scheduling</li>
          <li><img src="/chart-icon.png" alt="" /> Track your health metrics</li>
          <li><img src="/message-icon.png" alt="" /> Direct messaging with providers</li>
        </ul>
      </div>

      <div className="auth-right-panel">
        <h2>Create Account</h2>
        <p>Join our health companion service</p>
        
        <div className="auth-tabs">
          <Link className="auth-decor" to="/login">Sign In</Link>
          <span className="auth-active-tab">Sign Up</span>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <label className="auth-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="auth-input"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <label className="auth-label">Student ID</label>
          <input
            type="text"
            name="studentId"
            className="auth-input"
            placeholder="Enter your student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
          
          <label className="auth-label">Email</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <label className="auth-label">Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            className="auth-input"
            placeholder="Confirm your password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="auth-sign-in">Create Account</button>
        </form>
        
        <div className="auth-divider">Or sign up with</div>
        
        <div className="auth-social-icons">
          <div>G</div>
          <div>f</div>
          <div>in</div>
        </div>
        
        <p className="auth-signup-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;