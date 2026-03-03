import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { SERVER_URL } from '../../services/api';

const DoctorCard = ({ doctor }) => {
  const { _id, user, specialization, experience, consultationFee, rating, isVerified } = doctor;
  return (
    <div className="card doctor-card animate-fade" style={{
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--bg-card)',
      transition: 'var(--transition)',
      padding: '1.5rem'
    }}>
      <div className="flex flex-wrap align-center" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 800,
          boxShadow: 'var(--shadow-md)',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {user?.avatar ? (
            <img
              src={`${SERVER_URL}${user.avatar}`}
              alt={user.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            user?.name?.charAt(0) || 'D'
          )}
        </div>
        <div style={{ flex: '1', minWidth: '180px' }}>
          <div className="flex justify-between align-center" style={{ marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Dr. {user?.name}</h3>
            {isVerified && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>VERIFIED</span>}
          </div>
          <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 700 }}>{specialization}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
            <StarRating value={Math.round(rating)} readonly size="0.85rem" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rating || 0} / 5</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border)',
        margin: '0 -4px'
      }}>
        <div className="flex-column">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consultation</span>
          <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>₹{consultationFee || 0}</span>
        </div>
        <Link to={`/doctors/${_id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem' }}>
          Consult Now
        </Link>
      </div>
    </div >
  );
};
export default DoctorCard;
