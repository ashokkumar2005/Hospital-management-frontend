import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HospitalsPage from './pages/HospitalsPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import MedicalCampsPage from './pages/MedicalCampsPage';
import VideoConsultPage from './pages/VideoConsultPage';
import VideosPage from './pages/VideosPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import SOSPage from './pages/SOSPage';
import DashboardPage from './pages/DashboardPage';
import HealthRecordPage from './pages/HealthRecordPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ProfilePage from './pages/ProfilePage';
import BloodConnectPage from './pages/BloodConnectPage';
import FamilyManagementPage from './pages/FamilyManagementPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-register" element={<AdminRegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
          {/* <Route path="/doctors" element={<DoctorsPage />} /> */}
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/medical-camps" element={<MedicalCampsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/symptom-checker" element={<SymptomCheckerPage />} />

          {/* Protected – any logged-in user */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/health-record" element={<ProtectedRoute><HealthRecordPage /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
          <Route path="/book/:doctorId" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
          <Route path="/consult/:roomId" element={<ProtectedRoute><VideoConsultPage /></ProtectedRoute>} />
          <Route path="/sos" element={<ProtectedRoute><SOSPage /></ProtectedRoute>} />
          <Route path="/blood-connect" element={<BloodConnectPage />} />
          <Route path="/family" element={<ProtectedRoute><FamilyManagementPage /></ProtectedRoute>} />

          {/* Doctor */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />

          {/* Hospital */}
          <Route path="/hospital/dashboard" element={<ProtectedRoute roles={['hospital']}><HospitalDashboard /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
