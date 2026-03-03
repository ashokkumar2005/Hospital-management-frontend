import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'patient' });
  const [error, setError] = useState('');
  const { loginUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await loginUser(form.email, form.password);
    if (res.success) {
      const userRole = res.user.role;
      if (userRole === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="animate-fade" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 800, fontSize: '1.8rem' }}>
          🏥 Welcome Back
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Login to access your personalized medical portal</p>

        {/* Role Selector Tabs - High Contrast green edition */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          {['patient', 'doctor'].map(r => (
            <button
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className="hover-grow"
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '12px',
                border: 'none',
                background: form.role === r ? 'var(--primary)' : 'transparent',
                color: form.role === r ? 'white' : 'var(--text-secondary)',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                boxShadow: form.role === r ? '0 4px 12px rgba(45, 106, 45, 0.3)' : 'none'
              }}
            >
              {r === 'patient' ? '👤 Patient' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block' }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{ padding: '0.8rem' }}
              placeholder={form.role === 'doctor' ? "doctor@demo.com" : "you@example.com"}
            />
          </div>
          <div className="form-group">
            <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block' }}>Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{ padding: '0.8rem' }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '1rem', fontWeight: 700 }} disabled={loading}>
            {loading ? 'Verifying Account...' : `Login as ${form.role.charAt(0).toUpperCase() + form.role.slice(1)}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Are you an administrator?</p>
          <Link to="/admin-login" style={{
            color: '#1e293b',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: '1.5px solid #e2e8f0',
            display: 'inline-block',
            transition: 'var(--transition)'
          }} onMouseOver={e => e.target.style.background = '#f8fafc'} onMouseOut={e => e.target.style.background = 'transparent'}>
            Go to Admin Portal
          </Link>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.2rem', marginTop: '1.8rem', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>🛡️ Demo Credentials:</strong>
          <div style={{ color: 'var(--text-main)', lineWeight: 1.6, background: 'rgba(255,255,255,0.4)', padding: '0.8rem', borderRadius: '8px' }}>
            {form.role === 'doctor' ? (
              <span style={{ fontWeight: 600 }}>👩‍⚕️ Doctor: doctor@demo.com / password123</span>
            ) : (
              <span style={{ fontWeight: 600 }}>👤 Patient: patient@demo.com / password123</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
