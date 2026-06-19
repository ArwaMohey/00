import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import '../../styles/Auth.css';
import { useAuth } from '../../components/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
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

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuthUser(response.data.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <h2>Welcome Back</h2>
        <p>Please sign in to continue to your health dashboard</p>
        
        <div className="auth-tabs">
          <span className="auth-active-tab">Sign In</span>
          <Link className="auth-decor" to="/signup">Sign Up</Link>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
          
          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <div className="auth-forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          
          <button type="submit" className="auth-sign-in">Sign In</button>
        </form>
        
        <div className="auth-divider">Or continue with</div>
        
        <div className="auth-social-icons">
          <div>G</div>
          <div>f</div>
          <div>in</div>
        </div>
        
        <p className="auth-signup-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;