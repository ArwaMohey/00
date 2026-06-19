import React, { useState, useEffect, useMemo } from 'react';
import { LuBot, LuSearch, LuSendHorizontal } from 'react-icons/lu';
import api from '../services/api';
import './Chat.css';

const doctorStatuses = ['online', 'offline', 'away'];

const botDoctor = {
  _id: 'healthbot',
  name: 'HealthBot Assistant',
  specialization: 'AI Triage Support',
  image: '/bot-avatar.png',
  status: 'online',
  isBot: true
};

const getBotReply = (userMsg) => {
  const msg = userMsg.toLowerCase();
  if (msg.includes('hello') || msg.includes('hi')) return 'Hello. I can help with appointments, nutrition, and routine care guidance.';
  if (msg.includes('appointment')) return 'You can book an appointment from the Appointments page, then choose your doctor and preferred date.';
  if (msg.includes('calorie') || msg.includes('diet')) return 'For a balanced intake, track calories and macros in Health Tracker and review your trends daily.';
  if (msg.includes('thank')) return 'You are welcome. I am always here to support your health journey.';
  return 'Please share your question and I will guide you to the right next step.';
};

const Chat = () => {
  const [doctors, setDoctors] = useState([botDoctor]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(botDoctor);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        const raw = response.data?.data;
        const records = Array.isArray(raw) ? raw : [];

        const docs = records.map((doc, index) => ({
          ...doc,
          status: doctorStatuses[index % doctorStatuses.length]
        }));

        const nextDoctors = [botDoctor, ...docs];
        setDoctors(nextDoctors);
        setSelectedDoctor(nextDoctors[0]);
      } catch (err) {
        setDoctors([botDoctor]);
        setSelectedDoctor(botDoctor);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(
    () => doctors.filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase())),
    [search, doctors]
  );

  useEffect(() => {
    setMessages([]);
  }, [selectedDoctor?._id]);

  const handleSend = (event) => {
    event.preventDefault();

    if (!input.trim() || !selectedDoctor) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userText = input;

    setMessages((prev) => [...prev, { from: 'me', text: userText, time }]);
    setInput('');

    if (selectedDoctor.isBot) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: getBotReply(userText),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 450);
    }
  };

  return (
    <div className="chat-main-container">
      <aside className="chat-sidebar">
        <div className="chat-search-wrap">
          <LuSearch />
          <input
            className="chat-search"
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chat-doctor-list">
          {filteredDoctors.map((doctor) => (
            <button
              type="button"
              key={doctor._id}
              className={`chat-doctor-item ${selectedDoctor?._id === doctor._id ? 'selected' : ''}`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="chat-item-avatar">
                {doctor.isBot ? (
                  <span className="chat-bot-avatar"><LuBot /></span>
                ) : (
                  <img className="chat-avatar-img" src={doctor.image || '/default-avatar.png'} alt={doctor.name} />
                )}
                <span className={`status-indicator ${doctor.status}`} />
              </div>
              <div className="chat-doctor-info">
                <span className="chat-doctor-name">{doctor.name}</span>
                <span className="chat-doctor-specialty">{doctor.specialization || 'General Care'}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-content">
        <header className="chat-header">
          <div>
            <span className="chat-header-name">{selectedDoctor?.name}</span>
            <span className="chat-header-specialty">{selectedDoctor?.specialization}</span>
          </div>
        </header>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-placeholder">
              <h2>Start a conversation with {selectedDoctor?.name}.</h2>
              <p>Ask about appointments, wellness tracking, or general guidance.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={`${msg.time}-${index}`} className={`chat-message ${msg.from === 'me' ? 'user' : ''}`}>
                <div className="chat-message-bubble">{msg.text}</div>
                <span className="chat-message-time">{msg.time}</span>
              </div>
            ))
          )}
        </div>

        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="chat-send-btn" type="submit" aria-label="Send message">
            <LuSendHorizontal />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
