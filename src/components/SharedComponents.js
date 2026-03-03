import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserMd, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// ─── Star Rating Component ────────────────────────────────────────────────────
export const StarRating = ({ rating = 0, size = 'normal', showCount = false, total = 0 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const fontSize = size === 'small' ? '0.85rem' : '1rem';

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) stars.push(<FaStar key={i} style={{ color: '#fbbf24', fontSize }} />);
    else if (i === fullStars + 1 && hasHalf) stars.push(<FaStarHalfAlt key={i} style={{ color: '#fbbf24', fontSize }} />);
    else stars.push(<FaRegStar key={i} style={{ color: '#d1d5db', fontSize }} />);
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {stars}
      {showCount && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>({total})</span>}
    </span>
  );
};

// ─── Doctor Card Component ────────────────────────────────────────────────────
export const DoctorCard = ({ doctor }) => {
  const user = doctor.user || {};
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DR';
  const avgRating = doctor.totalRatings > 0 ? (doctor.rating / doctor.totalRatings) : 0;

  return (
    <Link to={`/doctors/${doctor._id}`} style={{ textDecoration: 'none' }}>
      <div className="card doctor-card" style={{ transition: 'all 0.2s', cursor: 'pointer' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.3rem', fontWeight: '700', flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
              Dr. {user.name}
            </h3>
            <p style={{ color: 'var(--primary)', fontSize: '0.88rem', fontWeight: '600', marginBottom: '6px' }}>
              {doctor.specialization}
            </p>
            <StarRating rating={avgRating} size="small" showCount total={doctor.totalRatings} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaUserMd style={{ color: 'var(--primary)', flexShrink: 0 }} />
            {doctor.experience} years experience
          </span>
          {doctor.hospital && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaMapMarkerAlt style={{ color: 'var(--secondary)', flexShrink: 0 }} />
              {doctor.hospital}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaCalendarAlt style={{ color: 'var(--accent)', flexShrink: 0 }} />
            {doctor.consultationFee > 0 ? `₹${doctor.consultationFee} / consultation` : 'Free consultation'}
          </span>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {doctor.isAvailableForVideoCall && (
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', background: '#C1E1C1', color: '#000000', fontWeight: '600' }}>
              📹 Video Available
            </span>
          )}
          {doctor.isVerified && (
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', background: '#90C790', color: '#000000', fontWeight: '600' }}>
              ✓ Verified
            </span>
          )}
          {doctor.languages && doctor.languages.slice(0, 2).map(lang => (
            <span key={lang} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {lang}
            </span>
          ))}
        </div>

        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
          <span className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            Book Appointment →
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Hospital Card Component ──────────────────────────────────────────────────
export const HospitalCard = ({ hospital }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{hospital.name}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>📍 {hospital.address}, {hospital.city}</p>
      </div>
      {hospital.distance !== undefined && (
        <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
          {hospital.distance} km
        </span>
      )}
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {hospital.emergencyAvailable && <span className="badge badge-danger">🚨 Emergency</span>}
      {hospital.icuAvailable && <span className="badge badge-warning">🏥 ICU</span>}
      {hospital.ambulanceAvailable && <span className="badge badge-info">🚑 Ambulance</span>}
    </div>

    {hospital.specializations && hospital.specializations.length > 0 && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {hospital.specializations.slice(0, 3).map(s => (
          <span key={s} className="badge badge-primary">{s}</span>
        ))}
        {hospital.specializations.length > 3 && <span className="badge badge-gray">+{hospital.specializations.length - 3} more</span>}
      </div>
    )}

    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
      {hospital.phone && (
        <a href={`tel:${hospital.phone}`} className="btn btn-secondary btn-sm">📞 {hospital.phone}</a>
      )}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.location?.coordinates?.[1] || ''},${hospital.location?.coordinates?.[0] || hospital.address}`}
        target="_blank" rel="noopener noreferrer"
        className="btn btn-outline btn-sm"
      >
        🗺️ Get Directions
      </a>
    </div>
  </div>
);

export default { StarRating, DoctorCard, HospitalCard };
