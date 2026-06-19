import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuCalendarCheck2,
  LuActivity,
  LuMessageSquareHeart,
  LuNewspaper,
  LuArrowRight
} from 'react-icons/lu';
import { useAuth } from '../components/AuthContext';
import './Home.css';

const homeCards = [
  {
    id: 'appointments',
    title: 'Book Appointment',
    description: 'Schedule your next consultation with available university doctors.',
    buttonLabel: 'Schedule Now',
    route: '/appointments',
    icon: LuCalendarCheck2
  },
  {
    id: 'health',
    title: 'Track Health Metrics',
    description: 'Monitor your calories and nutrition trends in real time.',
    buttonLabel: 'Open Tracker',
    route: '/health-tracker',
    icon: LuActivity
  },
  {
    id: 'chat',
    title: 'Doctor Messaging',
    description: 'Reach healthcare providers quickly for guidance and updates.',
    buttonLabel: 'Open Chat',
    route: '/chat',
    icon: LuMessageSquareHeart
  },
  {
    id: 'updates',
    title: 'Health Updates',
    description: 'Review preventive-care reminders and campus clinic announcements.',
    buttonLabel: 'View Profile & Alerts',
    route: '/profile',
    icon: LuNewspaper
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="welcome-section">
        <h1>Welcome back, {user?.name || 'Student'}.</h1>
        <p>Here is your personalized university healthcare command center.</p>
      </section>

      <section className="cards-section">
        {homeCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.id} className="home-card">
              <div className="card-icon-wrap">
                <Icon className="card-icon" />
              </div>
              <div className="home-card-content">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <button type="button" onClick={() => navigate(card.route)}>
                  {card.buttonLabel}
                  <LuArrowRight />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
