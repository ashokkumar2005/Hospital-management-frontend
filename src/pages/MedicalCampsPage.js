import React, { useState, useEffect } from 'react';
import { getCamps, registerForCamp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const MedicalCampsPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const { isAuth } = useAuth();

  useEffect(() => {
    getCamps().then(({ data }) => setCamps(data.camps || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleRegister = async (id) => {
    if (!isAuth) { alert('Please login to register for camps'); return; }
    setRegistering(id);
    try {
      await registerForCamp(id);
      alert('Successfully registered for the camp!');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally { setRegistering(null); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>🏕️ Free Medical Camps</h1>
          <p>Upcoming health camps and free medical services in your area</p>
        </div>
      </div>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {camps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🏕️</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No upcoming medical camps at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {camps.map(camp => {
              const isUpcoming = new Date(camp.date) >= new Date();
              const daysLeft = Math.ceil((new Date(camp.date) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={camp._id} className="card" style={{ borderLeft: `4px solid ${isUpcoming ? 'var(--secondary)' : '#e2e8f0'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <h3>{camp.title}</h3>
                    {isUpcoming && daysLeft <= 7 && <span className="badge badge-warning">⚡ {daysLeft} days left</span>}
                  </div>
                  {camp.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.8rem', lineHeight: 1.6 }}>{camp.description}</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
                    <p>📅 {new Date(camp.date).toDateString()} {camp.time && `at ${camp.time}`}</p>
                    <p>📍 {camp.address}</p>
                    {camp.specialistDoctor && <p>👨‍⚕️ Specialist: {camp.specialistDoctor}</p>}
                    {camp.organizer && <p>🏢 Organizer: {camp.organizer}</p>}
                    <p>👥 Registered: {camp.registrations?.length || 0} people</p>
                  </div>
                  {isUpcoming && (
                    <button onClick={() => handleRegister(camp._id)} className="btn btn-secondary" style={{ width: '100%' }} disabled={registering === camp._id}>
                      {registering === camp._id ? 'Registering...' : '✅ Register for Free'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalCampsPage;
