import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <Link className="link" to="/home">Home</Link>
      <Link className="link" to="/appointments">Appointments</Link>
      <Link className="link" to="/health-tracker">Health Tracker</Link>
      <Link className="link" to="/chat">Chat</Link>
      <Link className="link" to="/profile">Profile</Link>
      <Link className="link" to="/login">Logout</Link>
    </div>
  );
}

export default Navbar;
