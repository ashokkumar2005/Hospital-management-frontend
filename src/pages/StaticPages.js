// ════════════════════════════════════════════════════════
//  ABOUT PAGE
// ════════════════════════════════════════════════════════
import React from 'react';
export const AboutPage = () => (
  <div className="page-wrapper">
    <div className="page-header" style={{ margin: '-30px -20px 40px', borderRadius: '0 0 24px 24px', background: 'linear-gradient(135deg, #2D6A2D, #1B431B)', color: 'white' }}>
      <h1 style={{ color: 'white' }}>About Smart Doctor</h1>
      <p style={{ color: 'rgba(255,255,255,0.8)' }}>Bridging the gap between patients and quality healthcare</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
      <div>
        <h2>Our Mission</h2>
        <p style={{ marginTop: '16px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>Smart Doctor is a comprehensive digital health platform built to make quality healthcare accessible to everyone. We connect patients with qualified doctors, provide real-time hospital information, and ensure emergency medical support is always a tap away.</p>
        <p style={{ marginTop: '16px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>Developed as a B.E CSE final year project, Smart Doctor demonstrates how technology can transform the healthcare experience for millions of patients.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[['500+', 'Doctors'], ['50K+', 'Patients'], ['200+', 'Hospitals'], ['24/7', 'Support']].map(([v, l]) => (
          <div key={l} className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>{v}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
    <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Our Team</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
      {[['👨‍💻', 'Lead Developer', 'Full-Stack MERN Development'], ['🎨', 'UI/UX Designer', 'User Experience & Interface Design'], ['📊', 'Project Manager', 'Architecture & Documentation']].map(([icon, role, desc]) => (
        <div key={role} className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
          <h4>{role}</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px' }}>{desc}</p>
        </div>
      ))}
    </div>
    <div className="card" style={{ background: 'linear-gradient(135deg, #C1E1C1, #F4F9F4)', border: '1px solid #408F40' }}>
      <h3 style={{ marginBottom: '12px' }}>🎓 Academic Project</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Smart Doctor is a final year B.E Computer Science & Engineering project demonstrating full-stack development with MERN stack, real-time communication (WebRTC + Socket.io), geolocation services, JWT authentication, and modern React architecture.</p>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════
//  CONTACT PAGE
// ════════════════════════════════════════════════════════
export const ContactPage = () => {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = React.useState(false);
  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ margin: '-30px -20px 40px', borderRadius: '0 0 24px 24px', background: 'linear-gradient(135deg, #60AD60, #90C790)' }}>
        <h1 style={{ color: 'white' }}>Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>We're here to help — reach out anytime</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Send a Message</h2>
          {sent ? (
            <div className="alert alert-success">✅ Message sent! We'll get back to you within 24 hours.</div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
              {[['Name', 'text', 'name', 'Your full name'], ['Email', 'email', 'email', 'you@example.com'], ['Subject', 'text', 'subject', 'How can we help?']].map(([label, type, key, placeholder]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-control" placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows={5} placeholder="Describe your issue or query..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Send Message</button>
            </form>
          )}
        </div>
        <div>
          <div className="card" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>Contact Information</h3>
            {[['📍', 'Address', '123 Health Avenue, Medical City, State 400001'], ['📞', 'Phone', '+91 98765 43210'], ['📧', 'Email', 'support@smartdoctor.com'], ['⏰', 'Hours', 'Mon–Sat, 9AM–6PM']].map(([icon, label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                <div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{label}</div><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{value}</div></div>
              </div>
            ))}
          </div>
          <div className="card" style={{ background: '#F4F9F4', border: '1px solid #90C790' }}>
            <h4 style={{ color: '#000000', marginBottom: '8px' }}>🚨 Emergency?</h4>
            <p style={{ color: '#000000', fontSize: '0.9rem' }}>For medical emergencies, call <strong>108</strong> immediately or use our SOS feature in the app.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
//  NOT FOUND PAGE
// ════════════════════════════════════════════════════════
import { Link } from 'react-router-dom';
export const NotFoundPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '20px' }}>
    <div>
      <div style={{ fontSize: '6rem', marginBottom: '16px' }}>🏥</div>
      <h1 style={{ fontSize: '5rem', color: 'var(--primary)', fontWeight: '900' }}>404</h1>
      <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/doctors" className="btn btn-outline">Find Doctors</Link>
      </div>
    </div>
  </div>
);
