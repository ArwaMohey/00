import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { authService } from '../../services/api';
import '../../styles/Auth.css';
import { useAuth } from '../../components/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
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
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSocialClick = (providerName) => {
    setError(`${providerName} SSO is not enabled for this deployment. Please sign in with your email and password.`);
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-logo-container">
          <img src="/logo.png" alt="University Health Companion Logo" className="auth-logo" />
        </div>
        <h2>University Health Companion</h2>
        <p>Your trusted digital health partner on campus.</p>
        <ul className="auth-features">
          <li>Book appointments in minutes with verified physicians.</li>
          <li>Track calories and nutrition from one dashboard.</li>
          <li>Access secure doctor communication anytime.</li>
        </ul>
      </div>

      <div className="auth-right-panel">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to your healthcare dashboard.</p>

        <div className="auth-tabs">
          <span className="auth-active-tab">Sign In</span>
          <Link className="auth-decor" to="/signup">Sign Up</Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="auth-label">University Email</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="you@university.edu"
            value={formData.email}
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
            <a href="mailto:support@uhc-campus.app">Need sign-in help?</a>
          </div>

          <button type="submit" className="auth-sign-in">Sign In</button>
        </form>

        <div className="auth-divider">Or continue with</div>

        <div className="auth-social-icons" aria-label="Social sign in links">
          <button type="button" onClick={() => handleSocialClick('Google')} aria-label="Google">
            <FaGoogle />
          </button>
          <button type="button" onClick={() => handleSocialClick('Facebook')} aria-label="Facebook">
            <FaFacebookF />
          </button>
          <button type="button" onClick={() => handleSocialClick('LinkedIn')} aria-label="LinkedIn">
            <FaLinkedinIn />
          </button>
        </div>

        <p className="auth-signup-text">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
