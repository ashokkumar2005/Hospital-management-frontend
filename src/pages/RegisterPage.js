import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/api';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '', specialization: '', experience: '', hospitalId: '' });
  const [error, setError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (form.role === 'doctor' || form.role === 'hospital') {
      getHospitals().then(({ data }) => setHospitals(data.hospitals || [])).catch(console.error);
    }
  }, [form.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await registerUser(form);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="animate-fade" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '520px', padding: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 800, fontSize: '1.8rem' }}>Join SmartDoctor</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Create your account to access digital healthcare</p>

        {error && <div className="alert alert-danger animate-fade">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-column gap-1">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Enter your name" />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 0000000000" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Secure Password</label>
            <input type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={4} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--border)', gap: '0.2rem' }}>
              {['patient', 'doctor', 'hospital'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className="hover-grow"
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: form.role === r ? 'var(--primary)' : 'transparent',
                    color: form.role === r ? 'white' : 'var(--text-secondary)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                    boxShadow: form.role === r ? '0 4px 10px rgba(45, 106, 45, 0.25)' : 'none'
                  }}
                >
                  {r === 'patient' ? '👤 Patient' : r === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Hospital'}
                </button>
              ))}
            </div>
          </div>
          {form.role === 'doctor' && (
            <div className="animate-fade grid grid-2" style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Specialization</label>
                <input className="form-control" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required placeholder="e.g. Cardiology" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Exp (Years)</label>
                <input type="number" className="form-control" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} min={0} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label className="form-label">Associated Hospital</label>
                <select className="form-control" value={form.hospitalId} onChange={e => setForm({ ...form, hospitalId: e.target.value })} required>
                  <option value="">Select Hospital</option>
                  {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {form.role === 'hospital' && (
            <div className="animate-fade" style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Your Hospital</label>
                <select className="form-control" value={form.hospitalId} onChange={e => setForm({ ...form, hospitalId: e.target.value })} required>
                  <option value="">Choose Hospital...</option>
                  {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  If your hospital is not listed, please contact the administrator.
                </p>
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '1rem', borderRadius: '12px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.90rem' }}>
          Already part of our community? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
