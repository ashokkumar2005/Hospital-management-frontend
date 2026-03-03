import React from 'react';
import { Link } from 'react-router-dom';

const HospitalCard = ({ hospital, userLocation, onNavigate }) => {
  const { name, address, phone, services, specializations, emergencyAvailable, rating, openHours, location } = hospital;

  const getDirections = () => {
    const [lng, lat] = location?.coordinates || [0, 0];
    window.open(`https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`, '_blank');
  };

  const calcDistance = () => {
    if (!userLocation || !location?.coordinates) return null;
    const [lng2, lat2] = location.coordinates;
    if (lng2 === 0 && lat2 === 0) return null;
    const R = 6371;
    const dLat = ((lat2 - userLocation.lat) * Math.PI) / 180;
    const dLng = ((lng2 - userLocation.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((userLocation.lat * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return d.toFixed(1);
  };

  const distance = calcDistance();

  return (
    <div className="card animate-fade" style={{ transition: 'var(--transition)', border: '1px solid var(--border)', padding: '1.5rem' }}>
      <div className="flex flex-wrap justify-between align-start" style={{ marginBottom: '1.25rem', gap: '1rem' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>{name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: '1.4' }}>
            <span>📍</span> {address}
          </p>
        </div>
        <div className="flex flex-wrap gap-1" style={{ justifyContent: 'flex-end' }}>
          {emergencyAvailable && (
            <span className="badge badge-danger" style={{
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              color: 'white',
              fontSize: '0.65rem',
              padding: '0.4rem 0.8rem',
              boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
            }}>
              EMERGENCY 24/7
            </span>
          )}
          {distance && (
            <span className="badge badge-info" style={{ fontWeight: 700, fontSize: '0.65rem' }}>
              {distance} KM AWAY
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2" style={{ marginBottom: '1.25rem' }}>
        {phone && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ opacity: 0.7 }}>📞</span> {phone}
          </div>
        )}
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          <span style={{ opacity: 0.7 }}>⏰</span> {openHours}
        </div>
      </div>

      {services?.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {services.slice(0, 4).map(s => (
            <span key={s} className="badge" style={{
              background: 'var(--bg-main)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {s}
            </span>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border)',
        margin: '0 -4px'
      }}>
        <div className="flex align-center gap-1">
          <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>★</span>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{rating || '4.5'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onNavigate || getDirections} className="btn btn-outline" style={{ borderRadius: '12px', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
            Directions
          </button>
          <Link to={`/hospitals/${hospital._id}`} className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            View Specialists
          </Link>
        </div>
      </div>
    </div>
  );
};
export default HospitalCard;
