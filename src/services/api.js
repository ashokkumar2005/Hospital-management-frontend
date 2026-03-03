import axios from 'axios';

// This handles the base URL for axios requests
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// This handles the base URL for socket connections (removes /api)
export const SERVER_URL = process.env.REACT_APP_SERVER_URL || API_URL.replace('/api', '');

// Enhanced logging for production troubleshooting
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 App running in PRODUCTION mode');
  console.log('📡 API Base URL:', API_URL);
  console.log('🔌 Socket Server URL:', SERVER_URL);
}

const API = axios.create({
  baseURL: API_URL
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes('login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── Hospitals ───────────────────────────────────────────────────────────────
export const getHospitals = (params) => API.get('/hospitals', { params });
export const getNearbyHospitals = (params) => API.get('/hospitals/nearby', { params });
export const getHospital = (id) => API.get(`/hospitals/${id}`);
export const createHospital = (data) => API.post('/hospitals', data);
export const updateHospital = (id, d) => API.put(`/hospitals/${id}`, d);
export const deleteHospital = (id) => API.delete(`/hospitals/${id}`);

// ─── Doctors ─────────────────────────────────────────────────────────────────
export const getDoctors = (params) => API.get('/doctors', { params });
export const getDoctor = (id) => API.get(`/doctors/${id}`);
export const updateDoctorProfile = (data) => API.put('/doctors/profile', data);
export const getDoctorAvailability = (id) => API.get(`/doctors/${id}/availability`);
// Hospital-Doctor Management
export const hospitalAddDoctor = (data) => API.post('/doctors/hospital', data);
export const hospitalUpdateDoctor = (id, data) => API.put(`/doctors/hospital/${id}`, data);
export const hospitalDeleteDoctor = (id) => API.delete(`/doctors/hospital/${id}`);

// ─── Appointments ────────────────────────────────────────────────────────────
export const bookAppointment = (data) => API.post('/appointments', data);
export const getAppointments = () => API.get('/appointments');
export const updateAppointment = (id, d) => API.put(`/appointments/${id}`, d);
export const cancelAppointment = (id) => API.delete(`/appointments/${id}`);

// ─── Medical Camps ───────────────────────────────────────────────────────────
export const getCamps = () => API.get('/medical-camps');
export const getAllCamps = () => API.get('/medical-camps/all');
export const createCamp = (data) => API.post('/medical-camps', data);
export const updateCamp = (id, d) => API.put(`/medical-camps/${id}`, d);
export const deleteCamp = (id) => API.delete(`/medical-camps/${id}`);
export const registerForCamp = (id) => API.post(`/medical-camps/${id}/register`);

// ─── Health Records ──────────────────────────────────────────────────────────
export const getHealthRecord = () => API.get('/health-records');
export const getPatientHealthRecord = (id) => API.get(`/health-records/patient/${id}`);
export const updateHealthRecord = (data) => API.put('/health-records', data);
export const uploadReport = (fd) => API.post('/health-records/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteReport = (rid) => API.delete(`/health-records/report/${rid}`);

// ─── Videos ──────────────────────────────────────────────────────────────────
export const getVideos = (params) => API.get('/videos', { params });
export const addVideo = (data) => API.post('/videos', data);
export const deleteVideo = (id) => API.delete(`/videos/${id}`);

// Compatibility wrapper for components using videoAPI
export const videoAPI = {
  getAll: (params) => API.get('/videos', { params }),
  add: (data) => API.post('/videos', data),
  delete: (id) => API.delete(`/videos/${id}`)
};

// ─── SOS ─────────────────────────────────────────────────────────────────────
export const triggerSOS = (data) => API.post('/sos', data);
export const getSOSHistory = () => API.get('/sos/history');

// ─── Notifications ───────────────────────────────────────────────────────────
export const getNotifications = () => API.get('/notifications');
export const markNotificationsRead = () => API.put('/notifications/read');

// ─── Feedback ────────────────────────────────────────────────────────────────
export const addFeedback = (data) => API.post('/feedback', data);
export const getDoctorFeedback = (id) => API.get(`/feedback/${id}`);

// ─── Symptom Checker ─────────────────────────────────────────────────────────
export const checkSymptoms = (data) => API.post('/symptom-checker', data);

// ─── Blood Connect ───────────────────────────────────────────────────────────
export const getBloodRequests = () => API.get('/blood/requests', { timeout: 10000 });
export const createBloodRequest = (data) => API.post('/blood/request', data);
export const updateBloodRequestStatus = (id, data) => API.put(`/blood/request/${id}`, data);
export const getDonorsByGroup = (group) => API.get(`/blood/donors/${group}`);

// ─── Family Management ───────────────────────────────────────────────────────
export const getFamilyMembers = () => API.get('/family');
export const addFamilyMember = (data) => API.post('/family', data);
export const updateFamilyMember = (id, data) => API.put(`/family/${id}`, data);
export const deleteFamilyMember = (id) => API.delete(`/family/${id}`);

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getAllUsers = () => API.get('/users');
export const getAdminStats = () => API.get('/users/stats');
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;
