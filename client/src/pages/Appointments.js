import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../components/AuthContext';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState({
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ specialist: '', date: '' });
  const { user } = useAuth();

  // Fetch doctors for the select input
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data.data);
        console.log('Doctors:', response.data.data);
      } catch (err) {
        // ignore for now
      }
    };
    fetchDoctors();
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments');
      const now = new Date();
      const sortedAppointments = response.data.data.reduce((acc, appointment) => {
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate >= now) {
          acc.upcoming.push(appointment);
        } else {
          acc.past.push(appointment);
        }
        return acc;
      }, { upcoming: [], past: [] });
      setAppointments(sortedAppointments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle booking a new appointment
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!form.specialist || !form.date) return;
    try {
      await api.post('/appointments', {
        studentId: user.studentId || user._id,
        doctorId: form.specialist,
        date: form.date,
        status: 'Confirmed'
      });
      setForm({ specialist: '', date: '' });
      fetchAppointments();
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="appointments-main-container">
      <h1>Appointments</h1>
      <div className="appointments-subtitle">Schedule and manage your healthcare appointments</div>
      <div className="appointments-content">
        <div className="appointments-left">
          <div className="appointments-card">
            <h2>Schedule New Appointment</h2>
            <form onSubmit={handleBookAppointment}>
              <label className="appointments-label">Specialist Type</label>
              <select
                name="specialist"
                value={form.specialist}
                onChange={handleFormChange}
                className="appointments-select"
                required
              >
                <option value="">Select specialist</option>
                {(Array.isArray(doctors) ? doctors : []).map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
              <label className="appointments-label">Select Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className="appointments-date"
                required
              />
              <button type="submit" className="appointments-check-btn">Book Appointment</button>
            </form>
          </div>
        </div>
        <div className="appointments-right">
          <div className="appointments-card">
            <h2>Upcoming Appointments</h2>
            {appointments.upcoming.length === 0 ? (
              <p className="no-appointments">No upcoming appointments</p>
            ) : (
              <div className="appointments-list">
                {appointments.upcoming.map(appointment => (
                  <div key={appointment._id} className="appointment-card">
                    <div className="appointment-info">
                      <h3>{appointment.doctor?.name || 'Doctor'}</h3>
                      <p className="specialty">{appointment.doctor?.specialization || ''}</p>
                      <p className="datetime">
                        {new Date(appointment.date).toLocaleDateString()} at{' '}
                        {new Date(appointment.date).toLocaleTimeString()}
                      </p>
                      <p className="status confirmed">{appointment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="appointments-card">
            <h2>Past Appointments</h2>
            {appointments.past.length === 0 ? (
              <p className="no-appointments">No past appointments</p>
            ) : (
              <div className="appointments-list">
                {appointments.past.map(appointment => (
                  <div key={appointment._id} className="appointment-card past">
                    <div className="appointment-info">
                      <h3>{appointment.doctor?.name || 'Doctor'}</h3>
                      <p className="specialty">{appointment.doctor?.specialization || ''}</p>
                      <p className="datetime">
                        {new Date(appointment.date).toLocaleDateString()} at{' '}
                        {new Date(appointment.date).toLocaleTimeString()}
                      </p>
                      <p className="status completed">{appointment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
