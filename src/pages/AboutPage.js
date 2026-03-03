import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const team = [
    { name: 'Tamizhmaran', role: 'Full Stack Developer', bg: '#0ea5e9' },
    { name: 'Ashokkumar', role: 'Full Stack Developer', bg: '#10b981' },
    { name: 'Bhuvaneswaran', role: 'Full Stack Developer', bg: '#8b5cf6' },
    { name: 'Tamil selvan', role: 'Full Stack Developer', bg: '#f59e0b' },
  ];

  const features = ['JWT-based secure authentication', 'Real-time maps with OpenStreetMap & Leaflet', 'WebRTC video consultation', 'AI-powered symptom checker', 'Email health alerts via Nodemailer', 'Chart.js health analytics', 'File upload for health records', 'Socket.io real-time notifications'];

  return (
    <div>
      <div className="page-header" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem' }}>About SmartDoctor</h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>A final year B.E CSE project bridging the gap between patients and quality healthcare through technology.</p>
        </div>
      </div>
      <div className="container">
        {/* Mission */}
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>🎯 Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
            SmartDoctor aims to make quality healthcare accessible to everyone through a comprehensive digital platform that connects patients with doctors, provides emergency services, health education, and personal health management — all in one place.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>🛠️ Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            {[
              { name: 'MongoDB', icon: '🍃', desc: 'Database' },
              { name: 'Express.js', icon: '⚡', desc: 'Backend' },
              { name: 'React.js', icon: '⚛️', desc: 'Frontend' },
              { name: 'Node.js', icon: '🟢', desc: 'Runtime' },
              { name: 'Socket.io', icon: '🔌', desc: 'Real-time' },
              { name: 'Leaflet', icon: '🗺️', desc: 'Maps (Free)' },
              { name: 'WebRTC', icon: '📹', desc: 'Video Calls' },
              { name: 'JWT', icon: '🔐', desc: 'Auth' },
            ].map(t => (
              <div key={t.name} style={{ padding: '1.2rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2rem' }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.4rem', color: 'var(--text-main)' }}>{t.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>✅ Key Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.6rem' }}>
            {features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>👥 Our Team</h2>
          <div className="grid grid-4">
            {team.map(m => (
              <div key={m.name} className="hover-lift" style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: m.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, margin: '0 auto 0.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {m.name.charAt(0)}
                </div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{m.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--primary-gradient)', borderRadius: 'var(--radius)', color: '#fff', boxShadow: '0 10px 30px rgba(45, 106, 45, 0.2)' }}>
          <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Ready to Experience Better Healthcare?</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 800, padding: '0.8rem 2rem' }}>Get Started</Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
