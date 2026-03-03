import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointments, getNotifications, markNotificationsRead, SERVER_URL } from '../services/api';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Loader from '../components/common/Loader';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAppointments(), getNotifications()])
      .then(([a, n]) => {
        setAppointments(a.data.appointments || []);
        setNotifications(n.data.notifications || []);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async () => {
    await markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const statusCount = appointments.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});
  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled').slice(0, 3);

  const chartData = {
    labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    datasets: [{ data: [statusCount.pending || 0, statusCount.confirmed || 0, statusCount.completed || 0, statusCount.cancelled || 0], backgroundColor: ['#90C790', '#60AD60', '#408F40', '#2D6A2D'], borderWidth: 0 }],
  };

  const monthlyData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Appointments', data: [3, 5, 2, 8, 4, 6], backgroundColor: '#2D6A2D' }] };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <div className="container">
          <h1 className="animate-slide-up">Welcome, {user?.name}! 👋</h1>
          <p className="animate-slide-up stagger-1">Your health dashboard – {new Date().toDateString()}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        {/* Stats Cards */}
        <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
          {[
            { label: 'Total Appointments', value: appointments.length, icon: '📅', color: 'var(--primary)' },
            { label: 'Upcoming', value: upcoming.length, icon: '⏰', color: '#f59e0b' },
            { label: 'Completed', value: statusCount.completed || 0, icon: '✅', color: 'var(--secondary)' },
            { label: 'Notifications', value: notifications.filter(n => !n.isRead).length, icon: '🔔', color: '#8b5cf6' },
          ].map((s, index) => (
            <div key={s.label} className={`card hover-lift animate-scale stagger-${index + 1}`} style={{ textAlign: 'center', borderBottom: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-2" style={{ marginBottom: '3rem' }}>
          {/* Chart Container */}
          <div className="card animate-slide-up stagger-2" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📊 Appointment Analysis
            </h3>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <Doughnut data={chartData} options={{
                  plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { family: 'Outfit', size: 12 } } } },
                  cutout: '70%',
                  maintainAspectRatio: true
                }} />
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="card animate-slide-up stagger-3">
            <div className="flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
              <h3 className="flex align-center gap-1">🔔 Recent Alerts</h3>
              {notifications.some(n => !n.isRead) && (
                <button onClick={handleMarkRead} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                  Mark all as read
                </button>
              )}
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '10px' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No new alerts.</div>
              ) : (
                <div className="flex-column gap-2">
                  {notifications.map((n, i) => (
                    <div key={n._id} className="animate-fade" style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: n.isRead ? 'transparent' : 'rgba(45, 106, 45, 0.05)',
                      border: '1px solid',
                      borderColor: n.isRead ? 'var(--border)' : 'rgba(45, 106, 45, 0.1)',
                      borderLeft: `4px solid ${n.isRead ? 'var(--text-muted)' : 'var(--primary)'}`
                    }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: n.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>{n.title}</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card animate-slide-up stagger-4" style={{ marginBottom: '3rem' }}>
          <div className="flex justify-between align-center" style={{ marginBottom: '2rem' }}>
            <h3 className="flex align-center gap-1">📅 Upcoming Appointments</h3>
            <Link to="/appointments" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>View History</Link>
          </div>

          {upcoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>You have no scheduled appointments.</p>
              <Link to="/hospitals" className="btn btn-primary">Book an Appointment</Link>
            </div>
          ) : (
            <div className="flex-column gap-2">
              {upcoming.map((a, i) => (
                <div key={a._id} className="flex flex-wrap justify-between align-center animate-fade" style={{
                  padding: '1.25rem',
                  background: 'var(--bg-main)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 0.1}s`,
                  gap: '1rem'
                }}>
                  <div className="flex align-center gap-2" style={{ flex: '1', minWidth: '220px' }}>
                    <div style={{ width: '48px', height: '48px', overflow: 'hidden', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                      {a.doctor?.user?.avatar ? (
                        <img
                          src={`${SERVER_URL}${a.doctor.user.avatar}`}
                          alt={a.doctor.user.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ background: 'white', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          {a.type === 'video' ? '📹' : '🏥'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Dr. {a.doctor?.user?.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(a.date).toDateString()} • {a.timeSlot}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap align-center gap-1" style={{ justifyContent: 'flex-end', flex: '1', minWidth: '150px' }}>
                    <span className={`badge ${a.type === 'video' ? 'badge-info' : 'badge-success'}`}>{a.type}</span>
                    <span className={`badge ${a.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
                    {a.type === 'video' && a.roomId && (
                      <Link to={`/consult/${a.roomId}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: 'auto' }}>Join Call</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>⚡ Quick Actions</h3>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            {[
              { label: 'Find Hospital', icon: '🏥', link: '/hospitals', color: 'var(--primary)' },
              { label: 'Blood Connect', icon: '🩸', link: '/blood-connect', color: '#ef4444' },
              { label: 'Family Manage', icon: '👨‍👩‍👧‍👦', link: '/family', color: '#2563eb' },
              { label: 'Health Record', icon: '📋', link: '/health-record', color: 'var(--accent)' },
              { label: 'Symptom Check', icon: '🧠', link: '/symptom-checker', color: 'var(--warning)' },
              { label: 'Emergency SOS', icon: '🆘', link: '/sos', color: 'var(--danger)' },
            ].map((q, i) => (
              <Link to={q.link} key={q.label} className={`animate-scale stagger-${i + 1}`}>
                <div className="card" style={{ textAlign: 'center', background: 'var(--bg-card)', borderLeft: `6px solid ${q.color}` }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{q.icon}</div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{q.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
