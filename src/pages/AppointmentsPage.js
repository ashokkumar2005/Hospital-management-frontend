import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAppointments, updateAppointment, cancelAppointment, SERVER_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const STATUS_COLORS = { pending: 'badge-warning', confirmed: 'badge-success', completed: 'badge-info', cancelled: 'badge-danger' };

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAppointments().then(({ data }) => setAppointments(data.appointments || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await cancelAppointment(id);
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
  };

  const handleStatusUpdate = async (id, status) => {
    await updateAppointment(id, { status });
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>📅 My Appointments</h1>
          <p>Manage all your medical appointments</p>
        </div>
      </div>
      <div className="container">
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '0.5rem 1.2rem', borderRadius: '20px', border: '2px solid var(--primary)', background: filter === s ? 'var(--primary)' : 'transparent', color: filter === s ? '#fff' : 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No appointments found</p>
            <Link to="/doctors" className="btn btn-primary">Book Appointment</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(a => (
              <div key={a._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                      <span className={`badge ${a.type === 'video' ? 'badge-info' : 'badge-success'}`}>{a.type}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>
                        {user?.role === 'patient' && a.doctor?.user?.avatar ? (
                          <img src={`${SERVER_URL}${a.doctor.user.avatar}`} alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          (user?.role === 'patient' ? a.doctor?.user?.name : a.patient?.name)?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        {user?.role === 'patient' ? (
                          <h3 style={{ margin: 0 }}>Dr. {a.doctor?.user?.name}</h3>
                        ) : (
                          <h3 style={{ margin: 0 }}>{a.patient?.name}</h3>
                        )}
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', margin: 0 }}>{a.doctor?.specialization}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>📅 {new Date(a.date).toDateString()} at {a.timeSlot}</p>
                    {a.reason && <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Reason: {a.reason}</p>}
                    {a.notes && <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Notes: {a.notes}</p>}
                    <p style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.3rem' }}>Fee: ₹{a.fee}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '140px' }}>
                    {a.type === 'video' && a.roomId && a.status === 'confirmed' && (
                      <Link to={`/consult/${a.roomId}`} className="btn btn-primary" style={{ fontSize: '0.82rem', textAlign: 'center' }}>📹 Join Call</Link>
                    )}
                    {user?.role === 'doctor' && a.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(a._id, 'confirmed')} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>✅ Confirm</button>
                        <button onClick={() => handleStatusUpdate(a._id, 'cancelled')} className="btn btn-danger" style={{ fontSize: '0.82rem' }}>❌ Reject</button>
                      </>
                    )}
                    {user?.role === 'doctor' && a.status === 'confirmed' && (
                      <button onClick={() => handleStatusUpdate(a._id, 'completed')} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>✓ Complete</button>
                    )}
                    {user?.role === 'patient' && a.status === 'pending' && (
                      <button onClick={() => handleCancel(a._id)} className="btn btn-danger" style={{ fontSize: '0.82rem' }}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
