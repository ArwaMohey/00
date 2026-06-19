import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>Here's your health overview for today.</p>
      </div>
      <div className="cards-section">
        <div className="home-card">
          <div className="card-icon card-appointment" />
          <div>
            <h2>Book Appointment</h2>
            <p>Schedule a consultation with one of our healthcare providers.</p>
            <button onClick={() => navigate('/appointments')}>Schedule Now</button>
          </div>
        </div>
        <div className="home-card">
          <div className="card-icon card-health" />
          <div>
            <h2>Track Health</h2>
            <p>Monitor your daily nutrition, fitness, and mental wellbeing.</p>
            <button onClick={() => navigate('/health-tracker')}>View Stats</button>
          </div>
        </div>
        <div className="home-card">
          <div className="card-icon card-messages" />
          <div>
            <h2>Messages</h2>
            <p>Chat with doctors and other healthcare professionals.</p>
            <button onClick={() => navigate('/chat')}>Open Chat</button>
          </div>
        </div>
        <div className="home-card">
          <div className="card-icon card-news" />
          <div>
            <h2>News & Events</h2>
            <p>Stay updated with the latest campus health news and upcoming events.</p>
            <button onClick={() => alert('Coming soon!')}>View News</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
