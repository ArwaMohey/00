import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LuHouse,
  LuCalendarClock,
  LuHeartPulse,
  LuMessageCircle,
  LuUserRound,
  LuLogOut
} from 'react-icons/lu';
import { useAuth } from '../components/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="University Health Companion Logo" className="sidebar-logo" />
        <div>
          <h1 className="sidebar-title">University Health Companion</h1>
          <p className="sidebar-subtitle">Student Wellness Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LuHouse />
          <span>Home</span>
        </NavLink>
        <NavLink to="/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LuCalendarClock />
          <span>Appointments</span>
        </NavLink>
        <NavLink to="/health-tracker" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LuHeartPulse />
          <span>Health Tracker</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LuMessageCircle />
          <span>Chat</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LuUserRound />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">Signed in as {user?.name || 'Student'}</div>
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LuLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
