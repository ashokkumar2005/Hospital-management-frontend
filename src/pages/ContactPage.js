import React, { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would call an API endpoint
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>📞 Contact Us</h1>
          <p>Get in touch with our support team</p>
        </div>
      </div>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Info */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Get In Touch</h3>
              {[
                { icon: '📧', label: 'Email', value: 'support@smartdoctor.com' },
                { icon: '📞', label: 'Phone', value: '+91 1800-000-0000' },
                { icon: '📍', label: 'Address', value: '123 Health Street, Medical City, India' },
                { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 9 AM – 6 PM' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.3rem' }}>{c.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray)' }}>{c.label}</p>
                    <p>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '0.8rem' }}>🆘 Emergency</h3>
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Call 911</p>
              <p style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>Ambulance: 108 | Police: 100 | Fire: 101</p>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Send Message</h3>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: 'var(--secondary)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: '1rem' }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                  <div className="form-group"><label>Email</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label>Subject</label><input className="form-control" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
                <div className="form-group"><label>Message</label><textarea className="form-control" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required /></div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Send Message ✉️</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
