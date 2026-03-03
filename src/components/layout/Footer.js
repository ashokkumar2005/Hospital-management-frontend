import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--footer-bg)', padding: '4rem 0 2rem', marginTop: '6rem', color: 'var(--footer-text)' }}>
    <div className="container">
      <div className="grid grid-4" style={{ gap: '3rem' }}>
        <div>
          <h3 style={{ color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>🏥</span> SmartDoctor
          </h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            Revolutionizing healthcare with digital accessibility. Book appointments, track health records, and consult experts instantly.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Services & Care</h4>
          <div className="flex-column gap-1">
            {[
              ['Specialist Search', '/hospitals'],
              ['Facility Locator', '/hospitals'],
              ['Community Camps', '/medical-camps'],
              ['Health Education', '/videos']
            ].map(([label, path]) => (
              <Link key={path} to={path} style={{ color: 'inherit', fontSize: '0.9rem', transition: 'var(--transition)' }}
                onMouseOver={e => e.target.style.color = 'var(--primary)'}
                onMouseOut={e => e.target.style.color = 'inherit'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Patient Resources</h4>
          <div className="flex-column gap-1">
            {[
              ['Symptom Analyzer', '/symptom-checker'],
              ['Digital Records', '/health-record'],
              ['Privacy Policy', '/about'],
              ['Contact Support', '/contact']
            ].map(([label, path]) => (
              <Link key={path} to={path} style={{ color: 'inherit', fontSize: '0.9rem', transition: 'var(--transition)' }}
                onMouseOver={e => e.target.style.color = 'var(--primary)'}
                onMouseOut={e => e.target.style.color = 'inherit'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Emergency Helpline</h4>
          <div className="emergency-box" style={{ background: '#fff', padding: '1.2rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#d32f2f', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>🚑 108 / 112</p>
            <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#000000' }}>Available 24/7 for critical medical emergencies.</p>
            <Link to="/sos" className="btn btn-danger btn-sm btn-block" style={{ borderRadius: '10px', color: '#ffffff' }}>
              Broadcast SOS Alert
            </Link>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '4rem', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} SmartDoctor Ecosystem. All Rights Reserved.</p>
        <div className="flex gap-2" style={{ fontSize: '0.8rem' }}>
          <span>Powered by AI Diagnostics</span>
          <span>•</span>
          <span>B.E CSE Final Year 2024</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
