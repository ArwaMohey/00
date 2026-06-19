import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import EventsNews from './pages/EventsNews';
import Monitor from './pages/Monitor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="users" element={<Users />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="events-news" element={<EventsNews />} />
          <Route path="monitor" element={<Monitor />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
