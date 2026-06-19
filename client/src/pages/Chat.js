import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Chat.css';

const dummyStatus = ['online', 'offline', 'away'];

const botDoctor = {
  _id: 'healthbot',
  name: 'HealthBot',
  specialization: 'AI Assistant',
  image: '/bot-avatar.png',
  status: 'online',
  isBot: true
};

const Chat = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        const docs = (response.data.data || response.data).map((doc, i) => ({
          ...doc,
          status: dummyStatus[i % dummyStatus.length]
        }));
        setDoctors([botDoctor, ...docs]);
        setFilteredDoctors([botDoctor, ...docs]);
      } catch (err) {
        setDoctors([botDoctor]);
        setFilteredDoctors([botDoctor]);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, doctors]);

  // بيانات رسائل وهمية لكل دكتور
  useEffect(() => {
    if (selectedDoctor) {
      setMessages([]); // يبدأ الشات فارغًا
    }
  }, [selectedDoctor]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { from: 'me', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    if (selectedDoctor && selectedDoctor.isBot) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { from: 'bot', text: getBotReply(input), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }, 700);
    }
    setInput('');
  };

  function getBotReply(userMsg) {
    const msg = userMsg.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) return 'Hello! How can I assist you with your health today?';
    if (msg.includes('appointment')) return 'To book an appointment, go to the Appointments page and choose your doctor and time.';
    if (msg.includes('calorie') || msg.includes('diet')) return 'A balanced diet is key! Would you like some nutrition tips?';
    if (msg.includes('thank')) return "You're welcome! 😊";
    return 'I am here to help with health tips, appointments, and more!';
  }

  return (
    <div className="chat-main-container">
      <div className="chat-sidebar">
        <input
          className="chat-search"
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="chat-doctor-list">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`chat-doctor-item${selectedDoctor && selectedDoctor._id === doctor._id ? ' selected' : ''}`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="chat-item-avatar">
                <img className="chat-avatar-img" src={doctor.profile?.avatar || '/default-avatar.png'} alt={doctor.name} />
                <span
                  className="status-indicator"
                  style={{
                    backgroundColor: doctor.status === 'online' ? '#00b894'
                      : doctor.status === 'away' ? '#fdcb6e'
                      : '#b2bec3'
                  }}
                />
              </div>
              <div className="chat-doctor-info">
                <span className="chat-doctor-name">{doctor.name}</span>
                <span className="chat-doctor-specialty">{doctor.specialization}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-content">
        {selectedDoctor ? (
          <>
            <div className="chat-header">
              <span className="chat-header-name">{selectedDoctor.name}</span>
              <span className="chat-header-specialty">{selectedDoctor.specialization}</span>
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message${msg.from === 'me' ? ' user' : ''}`}>
                  <div className="chat-message-bubble">{msg.text}</div>
                  <span className="chat-message-time">{msg.time}</span>
                </div>
              ))}
            </div>
            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                className="chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="chat-send-btn" type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <h2>Select a healthcare provider to start chatting</h2>
            <p>You can discuss your health concerns, ask questions, and get professional advice.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
