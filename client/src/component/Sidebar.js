import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-header">
      <img src="/logo.png" alt="University Health Companion Logo" className="sidebar-logo" />
      <h1 className="sidebar-title">University Health Companion</h1>
    </div>
    <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
    <NavLink to="/appointments" className={({ isActive }) => isActive ? 'active' : ''}>Appointments</NavLink>
    <NavLink to="/health-tracker" className={({ isActive }) => isActive ? 'active' : ''}>Health Tracker</NavLink>
    <NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}>Chat</NavLink>
    <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
  </div>
);

export default Sidebar; 