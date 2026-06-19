import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="navbar">
      <Link className="link" to="/home">Home</Link>
      <Link className="link" to="/appointments">Appointments</Link>
      <Link className="link" to="/health-tracker">Health Tracker</Link>
      <Link className="link" to="/chat">Chat</Link>
      <Link className="link" to="/profile">Profile</Link>
      <button type="button" className="link logout-link" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;
