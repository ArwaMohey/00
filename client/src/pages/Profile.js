import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import api from '../services/api';
import './Profile.css';

const dummyProfile = {
  name: 'arwa',
  email: 'arwamohey2005@gmail.com',
  phone: '',
  address: '',
  bio: '',
  dateOfBirth: '',
  avatar: '/default-avatar.png',
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setProfile(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        setProfile({
          ...dummyProfile,
          name: user?.name || dummyProfile.name,
          email: user?.email || dummyProfile.email,
        });
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', profile);
      alert('Profile changes saved successfully!');
    } catch (err) {
      setError('Failed to save profile changes. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-modern-container">
      <div className="profile-modern-header">
        {profile?.avatar && (
          <img className="profile-modern-avatar" src={profile.avatar} alt={profile.name} />
        )}
        <h1>{profile?.name || 'User'}</h1>
        <div className="profile-modern-role">user</div>
      </div>
      <div className="profile-modern-tabs">
        {['Personal Information', 'Medical History', 'Preferences'].map(tab => (
          <button
            key={tab}
            className={`profile-modern-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
      {activeTab === 'Personal Information' && (
        <form onSubmit={handleSubmit} className="profile-modern-form">
          <div className="profile-modern-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile?.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="profile-modern-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile?.email || ''}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="profile-modern-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile?.phone || ''}
              onChange={handleChange}
            />
          </div>
          <div className="profile-modern-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={profile?.address || ''}
              onChange={handleChange}
            />
          </div>
          <div className="profile-modern-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile?.bio || ''}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="profile-modern-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="profile-modern-save-btn">
            Save Changes
          </button>
        </form>
      )}
      {activeTab !== 'Personal Information' && (
        <div className="profile-card profile-placeholder">
          <h3>{activeTab}</h3>
          <p>This feature is coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
