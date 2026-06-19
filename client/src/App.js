import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import NavbarPage from './pages/NavbarPage';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import HealthTracker from './pages/HealthTracker';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import MainLayout from './component/MainLayout';
import ProtectedRoute from './component/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import './pages/HealthTracker.css';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/navbar" element={<NavbarPage />} />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <MainLayout><Appointments /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/health-tracker" element={
              <ProtectedRoute>
                <MainLayout><HealthTracker /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <MainLayout><Chat /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout><Profile /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <MainLayout><Home /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;