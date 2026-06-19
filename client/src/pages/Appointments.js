import React, { useState, useEffect } from 'react';
import api from '../services/api';
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments');
      const now = new Date();
      const records = Array.isArray(response.data.data) ? response.data.data : [];

      const sortedAppointments = records.reduce(
        (acc, appointment) => {
          const appointmentDate = new Date(appointment.date);
          if (appointmentDate >= now) {
            acc.upcoming.push(appointment);
          } else {
            acc.past.push(appointment);
          }
          return acc;
        },
        { upcoming: [], past: [] }
      );

      setAppointments(sortedAppointments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!form.specialist || !form.date) {
      return;
    }

    try {
      await api.post('/appointments', {
        doctorId: form.specialist,
        date: form.date,
        status: 'Confirmed'
      });
      setForm({ specialist: '', date: '' });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete appointment');
    }
  };

  if (loading) return <div className="loading-state">Loading appointments...</div>;

  return (
    <div className="appointments-main-container">
      <h1>Appointments</h1>
      <p className="appointments-subtitle">Schedule and manage your healthcare appointments with ease.</p>

      {error && <div className="appointments-error">{error}</div>}

      <div className="appointments-content">
        <section className="appointments-card">
          <h2>Schedule New Appointment</h2>
          <form onSubmit={handleBookAppointment}>
            <label className="appointments-label">Select Doctor</label>
            <select
              name="specialist"
              value={form.specialist}
              onChange={handleFormChange}
              className="appointments-select"
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>

            <label className="appointments-label">Preferred Date</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              className="appointments-date"
              required
            />

            <button type="submit" className="appointments-check-btn">Book Appointment</button>
          </form>
        </section>

        <section className="appointments-column">
          <div className="appointments-card">
            <h2>Upcoming Appointments</h2>
            {appointments.upcoming.length === 0 ? (
              <p className="no-appointments">No upcoming appointments.</p>
            ) : (
              <div className="appointments-list">
                {appointments.upcoming.map((appointment) => (
                  <article key={appointment._id} className="appointment-card">
                    <div>
                      <h3>{appointment.doctor?.name || 'Assigned Doctor'}</h3>
                      <p className="specialty">{appointment.doctor?.specialization || 'General Care'}</p>
                      <p className="datetime">{new Date(appointment.date).toLocaleString()}</p>
                      <p className="status confirmed">{appointment.status}</p>
                    </div>
                    <button
                      type="button"
                      className="appointment-delete"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="appointments-card">
            <h2>Past Appointments</h2>
            {appointments.past.length === 0 ? (
              <p className="no-appointments">No past appointments.</p>
            ) : (
              <div className="appointments-list">
                {appointments.past.map((appointment) => (
                  <article key={appointment._id} className="appointment-card past">
                    <div>
                      <h3>{appointment.doctor?.name || 'Assigned Doctor'}</h3>
                      <p className="specialty">{appointment.doctor?.specialization || 'General Care'}</p>
                      <p className="datetime">{new Date(appointment.date).toLocaleString()}</p>
                      <p className="status completed">{appointment.status}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Appointments;
