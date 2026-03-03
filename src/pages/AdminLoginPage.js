import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { loginUser, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await loginUser(form.email, form.password);
        if (res.success) {
            // Use the user returned from loginUser if available, otherwise check localStorage
            const user = res.user || JSON.parse(localStorage.getItem('user'));

            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                setError('Access denied. This login is for administrators only.');
            }
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="animate-fade" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--primary-gradient)' }}></div>

                <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-main)' }}>
                    🛡️ Admin Access
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    Authorized personnel only. Please verify your administrative credentials.
                </p>

                {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex-column gap-1">
                    <div className="form-group">
                        <label className="form-label">Administrative Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            placeholder="admin@smartdoctor.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Secure Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        style={{ marginTop: '1rem', borderRadius: '12px', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Verifying Identity...' : '🚀 Authenticate Admin'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <a href="/login" style={{
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>
                        <span>←</span> Back to User Portal
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
