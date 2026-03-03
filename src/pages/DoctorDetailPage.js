import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoctor, getDoctorFeedback, SERVER_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import Loader from '../components/common/Loader';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorDetailPage = () => {
  const { id } = useParams();
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([getDoctor(id), getDoctorFeedback(id)]).then(([d, r]) => {
      setDoctor(d.data.doctor);
      setReviews(r.data.feedbacks || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!doctor) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Doctor not found.</div>;

  const { user, specialization, experience, qualification, bio, consultationFee, rating, totalRatings, availability, hospital, isVerified } = doctor;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0, overflow: 'hidden' }}>
              {user?.avatar ? (
                <img
                  src={`${SERVER_URL}${user.avatar}`}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Dr. {user?.name}</h1>
                {isVerified && <span className="badge badge-success">✓ Verified</span>}
              </div>
              <p style={{ opacity: 0.9, marginTop: '0.3rem' }}>{specialization} • {experience} years experience</p>
              {qualification && <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{qualification}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <StarRating value={Math.round(rating)} readonly />
                <span style={{ opacity: 0.85, fontSize: '0.9rem' }}>{rating || 0} ({totalRatings || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Main */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
            {['overview', 'availability', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.8rem 1.5rem', background: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === tab ? 'var(--primary)' : 'var(--gray)', fontWeight: activeTab === tab ? 700 : 500, marginBottom: '-2px', textTransform: 'capitalize', fontSize: '0.95rem' }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              {bio && <div className="card" style={{ marginBottom: '1rem' }}><h3 style={{ marginBottom: '0.5rem' }}>About</h3><p style={{ color: 'var(--gray)' }}>{bio}</p></div>}
              {hospital && <div className="card" style={{ marginBottom: '1rem' }}><h3 style={{ marginBottom: '0.5rem' }}>Hospital</h3><p>🏥 {hospital.name}</p><p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>📍 {hospital.address}</p></div>}
              <div className="card">
                <h3 style={{ marginBottom: '0.8rem' }}>Contact</h3>
                <p>📧 {user?.email}</p>
                {user?.phone && <p>📞 {user?.phone}</p>}
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Weekly Schedule</h3>
              {availability?.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {DAYS.map(day => {
                    const slot = availability.find(a => a.day === day);
                    return (
                      <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', borderRadius: '8px', background: slot?.isAvailable ? '#f0fdf4' : '#fef2f2' }}>
                        <strong>{day}</strong>
                        {slot?.isAvailable ? <span style={{ color: '#16a34a' }}>{slot.startTime} – {slot.endTime}</span> : <span style={{ color: '#dc2626' }}>Not Available</span>}
                      </div>
                    );
                  })}
                </div>
              ) : <p style={{ color: 'var(--gray)' }}>No availability set. Contact the doctor directly.</p>}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviews.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--gray)' }}>No reviews yet. Be the first!</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map(r => (
                    <div key={r._id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong>{r.patient?.name}</strong>
                        <StarRating value={r.rating} readonly size="1rem" />
                      </div>
                      {r.comment && <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{r.comment}</p>}
                      <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking sidebar */}
        <div className="card" style={{ width: '260px', flexShrink: 0, position: 'sticky', top: '80px' }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Book Appointment</h3>
          <div style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>₹{consultationFee}</div>
          <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.85rem', marginBottom: '1rem' }}>Per Consultation</p>
          {isAuth ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => navigate(`/book/${id}?type=in-person`)} className="btn btn-primary" style={{ width: '100%' }}>📅 Book In-Person</button>
              <button onClick={() => navigate(`/book/${id}?type=video`)} className="btn btn-secondary" style={{ width: '100%' }}>📹 Video Consult</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>Login to Book</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
