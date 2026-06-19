import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Your Health Dashboard</h1>
      <div className="dashboard-cards">
        <Link to="/appointments" className="card">
          <h3>Appointments</h3>
          <p>Schedule with university doctors</p>
        </Link>
        <Link to="/health-metrics" className="card">
          <h3>Health Metrics</h3>
          <p>Track your health data</p>
        </Link>
        <Link to="/messages" className="card">
          <h3>Messages</h3>
          <p>Contact healthcare providers</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;