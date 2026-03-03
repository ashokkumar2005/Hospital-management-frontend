import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  getAllUsers,
  getAdminStats,
  deleteUser,
  createCamp,
  updateCamp,
  getAllCamps,
  deleteCamp,
  addVideo,
  deleteVideo,
  getVideos,
  createHospital
} from '../services/api';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Loader from '../components/common/Loader';
import {
  Users,
  Tent,
  Video,
  Hospital as HospitalIcon,
  LayoutGrid,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Activity,
  UserPlus
} from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campForm, setCampForm] = useState({ title: '', description: '', date: '', time: '', address: '', specialistDoctor: '', organizer: '', lat: '', lng: '' });
  const [isEditingCamp, setIsEditingCamp] = useState(false);
  const [currentCampId, setCurrentCampId] = useState(null);
  const [videoForm, setVideoForm] = useState({ title: '', youtubeUrl: '', category: 'general', description: '' });
  const [hospitalForm, setHospitalForm] = useState({ name: '', address: '', phone: '', services: '', specializations: '', emergencyAvailable: false, lat: '', lng: '', openHours: '24/7' });

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, u, c, v] = await Promise.all([getAdminStats(), getAllUsers(), getAllCamps(), getVideos()]);
        setStats(s.data.stats || {});
        setUsers(u.data.users || []);
        setCamps(c.data.camps || []);
        setVideos(v.data.videos || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        // Even if some fail, try to show what we have or just stop loading
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => { if (window.confirm('Delete user?')) { await deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); } };
  const handleDeleteCamp = async (id) => { if (window.confirm('Delete camp?')) { await deleteCamp(id); setCamps(prev => prev.filter(c => c._id !== id)); } };
  const handleDeleteVideo = async (id) => {
    if (window.confirm('Delete video?')) {
      try {
        await deleteVideo(id);
        setVideos(prev => prev.filter(v => v._id !== id));
      } catch (err) {
        console.error('Error deleting video:', err);
        alert('Failed to delete video.');
      }
    }
  };

  const handleAddCamp = async (e) => {
    e.preventDefault();
    try {
      const { lat, lng, ...rest } = campForm;
      const payload = { ...rest };

      if (lat && lng) {
        payload.location = {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        };
      }

      if (isEditingCamp) {
        const { data } = await updateCamp(currentCampId, payload);
        setCamps(prev => prev.map(c => c._id === currentCampId ? data.camp : c));
        alert('Medical camp updated successfully!');
        setIsEditingCamp(false);
        setCurrentCampId(null);
      } else {
        const { data } = await createCamp(payload);
        setCamps(prev => [data.camp, ...prev]);
        alert('Medical camp created successfully!');
      }
      setCampForm({ title: '', description: '', date: '', time: '', address: '', specialistDoctor: '', organizer: '', lat: '', lng: '' });
    } catch (err) {
      console.error('Error with medical camp action:', err);
      alert(err.response?.data?.message || 'Action failed. Please try again.');
    }
  };

  const handleEditCampClick = (camp) => {
    setCampForm({
      title: camp.title,
      description: camp.description || '',
      date: camp.date ? new Date(camp.date).toISOString().split('T')[0] : '',
      time: camp.time || '',
      address: camp.address,
      specialistDoctor: camp.specialistDoctor || '',
      organizer: camp.organizer || '',
      lat: camp.location?.coordinates ? camp.location.coordinates[1].toString() : '',
      lng: camp.location?.coordinates ? camp.location.coordinates[0].toString() : ''
    });
    setIsEditingCamp(true);
    setCurrentCampId(camp._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addVideo(videoForm);
      setVideos(prev => [data.video, ...prev]);
      setVideoForm({ title: '', youtubeUrl: '', category: 'general', description: '' });
      alert('Video added successfully!');
    } catch (err) {
      console.error('Error adding video:', err);
      alert(err.response?.data?.message || 'Failed to add video. Please check the YouTube URL.');
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...hospitalForm,
        services: hospitalForm.services.split(',').map(s => s.trim()),
        specializations: hospitalForm.specializations.split(',').map(s => s.trim()),
        location: {
          type: 'Point',
          coordinates: [parseFloat(hospitalForm.lng) || 0, parseFloat(hospitalForm.lat) || 0]
        }
      };
      await createHospital(payload);
      alert('Hospital registered successfully!');
      setHospitalForm({ name: '', address: '', phone: '', services: '', specializations: '', emergencyAvailable: false, lat: '', lng: '', openHours: '24/7' });
    } catch (err) {
      console.error('Error adding hospital:', err);
      alert(err.response?.data?.message || 'Failed to register hospital.');
    }
  };

  if (loading) return <Loader />;

  const statusChart = { labels: stats?.statusBreakdown?.map(s => s._id) || [], datasets: [{ data: stats?.statusBreakdown?.map(s => s.count) || [], backgroundColor: ['#f59e0b', '#0ea5e9', '#10b981', '#ef4444'], borderWidth: 0 }] };
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyChart = { labels: stats?.monthlyData?.map(m => monthNames[m._id - 1]) || [], datasets: [{ label: 'Appointments', data: stats?.monthlyData?.map(m => m.count) || [], backgroundColor: '#0ea5e9', borderRadius: 6 }] };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, path: '' },
    { id: 'users', label: 'Users', icon: Users, path: 'users' },
    { id: 'camps', label: 'Camps', icon: Tent, path: 'camps' },
    { id: 'videos', label: 'Videos', icon: Video, path: 'videos' },
    { id: 'hospitals', label: 'Hospitals', icon: HospitalIcon, path: 'hospitals' }
  ];

  const isActive = (path) => {
    const currentPath = location.pathname.split('/').pop();
    if (path === '' && (currentPath === 'admin' || currentPath === '')) return true;
    return currentPath === path;
  };

  return (
    <div className="admin-dashboard">
      <div className="page-header" style={{ textAlign: 'left', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Activity size={32} />
            <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Access platform-wide metrics and manage system content.</p>
        </div>
      </div>
      <div className="container">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', marginBottom: '2.5rem', flexWrap: 'wrap', position: 'sticky', top: '70px', background: 'var(--bg)', zIndex: 10, padding: '1rem 0' }}>
          {TABS.map(t => (
            <Link key={t.id} to={t.path}
              style={{
                padding: '0.8rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                borderBottom: isActive(t.path) ? '3px solid var(--primary)' : '3px solid transparent',
                color: isActive(t.path) ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive(t.path) ? 700 : 500,
                marginBottom: '-2px',
                transition: 'var(--transition)',
                fontSize: '0.95rem'
              }}>
              <t.icon size={18} />
              {t.label}
            </Link>
          ))}
        </div>

        <Routes>
          <Route path="/" element={
            <div className="animate-in">
              <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
                {[
                  { label: 'Total Patients', value: stats?.totalUsers || 0, icon: Users, color: 'var(--primary)' },
                  { label: 'Doctors', value: stats?.totalDoctors || 0, icon: Activity, color: 'var(--secondary)' },
                  { label: 'Appointments', value: stats?.totalAppointments || 0, icon: Calendar, color: '#8b5cf6' },
                  { label: 'Pending', value: stats?.pendingAppointments || 0, icon: Clock, color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} className="card dashboard-stat-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                      <s.icon size={80} />
                    </div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: s.color }}>
                      <s.icon size={32} strokeWidth={2.5} />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={20} /> Appointment Status
                  </h3>
                  <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                    <Doughnut data={statusChart} options={{ plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }, cutout: '70%' }} />
                  </div>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} /> Monthly Appointments
                  </h3>
                  <Bar data={monthlyChart} options={{ plugins: { legend: { display: false } }, borderRadius: 8, scales: { y: { beginAtZero: true, grid: { borderDash: [5, 5] } }, x: { grid: { display: false } } } }} />
                </div>
              </div>
            </div>
          } />

          <Route path="users" element={
            <div className="animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Registered Users ({users.length})</h3>
                <button className="btn btn-primary btn-sm"><UserPlus size={16} /> Add New</button>
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Role', 'Joined', 'Action'].map(h => <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row-hover">
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{u.name}</td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                          <td style={{ padding: '1rem 1.5rem' }}><span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'doctor' ? 'info' : u.role === 'hospital' ? 'warning' : 'success'}`}>{u.role}</span></td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            {u.role !== 'admin' && (
                              <button onClick={() => handleDeleteUser(u._id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }}>
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          } />

          <Route path="camps" element={
            <div className="animate-in">
              <div className="card" style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tent size={20} /> {isEditingCamp ? 'Update Medical Camp' : 'Add Medical Camp'}
                  {isEditingCamp && (
                    <button className="btn btn-sm" onClick={() => {
                      setIsEditingCamp(false);
                      setCampForm({ title: '', description: '', date: '', time: '', address: '', specialistDoctor: '', organizer: '' });
                    }} style={{ marginLeft: 'auto', background: 'var(--bg-secondary)' }}>Cancel Edit</button>
                  )}
                </h3>
                <form onSubmit={handleAddCamp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-control" required value={campForm.title} onChange={e => setCampForm({ ...campForm, title: e.target.value })} placeholder="Health Checkup Camp" /></div>
                  <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-control" required value={campForm.date} onChange={e => setCampForm({ ...campForm, date: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Time</label><input className="form-control" value={campForm.time} onChange={e => setCampForm({ ...campForm, time: e.target.value })} placeholder="9:00 AM - 4:00 PM" /></div>
                  <div className="form-group"><label className="form-label">Address</label><input className="form-control" required value={campForm.address} onChange={e => setCampForm({ ...campForm, address: e.target.value })} placeholder="Community Hall, City" /></div>
                  <div className="form-group"><label className="form-label">Specialist Doctor</label><input className="form-control" value={campForm.specialistDoctor} onChange={e => setCampForm({ ...campForm, specialistDoctor: e.target.value })} placeholder="Dr. Smith" /></div>
                  <div className="form-group"><label className="form-label">Organizer</label><input className="form-control" value={campForm.organizer} onChange={e => setCampForm({ ...campForm, organizer: e.target.value })} placeholder="City Health Dept" /></div>
                  <div className="form-group"><label className="form-label">Latitude</label><input type="number" step="any" className="form-control" value={campForm.lat} onChange={e => setCampForm({ ...campForm, lat: e.target.value })} placeholder="12.9716" /></div>
                  <div className="form-group"><label className="form-label">Longitude</label><input type="number" step="any" className="form-control" value={campForm.lng} onChange={e => setCampForm({ ...campForm, lng: e.target.value })} placeholder="77.5946" /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description</label><textarea className="form-control" rows={3} value={campForm.description} onChange={e => setCampForm({ ...campForm, description: e.target.value })} placeholder="Details about the camp..." /></div>
                  <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>
                    {isEditingCamp ? <Activity size={18} /> : <Plus size={18} />}
                    {isEditingCamp ? ' Update Camp Details' : ' Add Camp'}
                  </button>
                </form>
              </div>
              <div className="grid grid-2">
                {camps.map(c => (
                  <div key={c._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.4rem 0' }}>{c.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {new Date(c.date).toDateString()}
                      </p>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>{c.address}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditCampClick(c)} className="btn btn-info btn-sm" style={{ padding: '0.6rem' }}><Activity size={18} /></button>
                      <button onClick={() => handleDeleteCamp(c._id)} className="btn btn-danger btn-sm" style={{ padding: '0.6rem' }}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } />

          <Route path="videos" element={
            <div className="animate-in">
              <div className="card" style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={20} /> Add Health Video</h3>
                <form onSubmit={handleAddVideo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-control" required value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Understanding Heart Health" /></div>
                  <div className="form-group"><label className="form-label">YouTube URL</label><input className="form-control" required value={videoForm.youtubeUrl} onChange={e => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={videoForm.category} onChange={e => setVideoForm({ ...videoForm, category: e.target.value })}>
                      {['heart', 'diabetes', 'mental', 'nutrition', 'general'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description</label><input className="form-control" value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="Brief overview of the video content" /></div>
                  <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}><Plus size={18} /> Add Video</button>
                </form>
              </div>
              <div className="grid grid-3">
                {videos.map(v => (
                  <div key={v._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="video-thumb" style={{ background: '#000', borderRadius: 'var(--radius)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={40} color="white" opacity={0.5} />
                    </div>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{v.category}</span>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', lineHeight: 1.4 }}>{v.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', height: '2.5rem', overflow: 'hidden' }}>{v.description}</p>
                      <button onClick={() => handleDeleteVideo(v._id)} className="btn btn-danger btn-block btn-sm"><Trash2 size={16} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } />

          <Route path="hospitals" element={
            <div className="animate-in">
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HospitalIcon size={20} /> Add Hospital</h3>
                <form onSubmit={handleAddHospital} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  {[['name', 'Hospital Name'], ['address', 'Full Address'], ['phone', 'Phone'], ['openHours', 'Open Hours']].map(([k, l]) => (
                    <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-control" value={hospitalForm[k]} onChange={e => setHospitalForm({ ...hospitalForm, [k]: e.target.value })} placeholder={l} /></div>
                  ))}
                  <div className="form-group"><label className="form-label">Latitude</label><input type="number" step="any" className="form-control" value={hospitalForm.lat} onChange={e => setHospitalForm({ ...hospitalForm, lat: e.target.value })} placeholder="12.9716" /></div>
                  <div className="form-group"><label className="form-label">Longitude</label><input type="number" step="any" className="form-control" value={hospitalForm.lng} onChange={e => setHospitalForm({ ...hospitalForm, lng: e.target.value })} placeholder="77.5946" /></div>
                  <div className="form-group"><label className="form-label">Services (comma-separated)</label><input className="form-control" value={hospitalForm.services} onChange={e => setHospitalForm({ ...hospitalForm, services: e.target.value })} placeholder="ER, ICU, Surgery" /></div>
                  <div className="form-group"><label className="form-label">Specializations (comma-separated)</label><input className="form-control" value={hospitalForm.specializations} onChange={e => setHospitalForm({ ...hospitalForm, specializations: e.target.value })} placeholder="Cardiology, Oncology" /></div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', gridColumn: '1 / -1' }}>
                    <input type="checkbox" id="emergency" checked={hospitalForm.emergencyAvailable} onChange={e => setHospitalForm({ ...hospitalForm, emergencyAvailable: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                    <label htmlFor="emergency" style={{ fontWeight: 600, cursor: 'pointer' }}>24/7 Emergency Services Available</label>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}><Plus size={18} /> Register Hospital</button>
                </form>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
