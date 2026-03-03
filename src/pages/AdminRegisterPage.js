import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRegisterPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        secretKey: '' // Added a secret key field for extra security
    });
    const [error, setError] = useState('');
    const { registerUser, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match');
        }

        // You can implement a secret key check here if desired
        // if (form.secretKey !== 'YOUR_SECRET_ADMIN_KEY') {
        //   return setError('Invalid Secret Admin Key');
        // }

        const res = await registerUser({
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            role: 'admin' // Forced role for this page
        });

        if (res.success) {
            navigate('/admin');
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' }}>
            <div className="card" style={{ width: '100%', maxWidth: '480px', borderTop: '4px solid #ef4444' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 800, fontSize: '1.6rem', color: '#1e293b' }}>
                    🛡️ Admin Registration
                </h2>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Create a new administrative account.
                </p>

                {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ fontWeight: 600 }}>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontWeight: 600 }}>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontWeight: 600 }}>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            required
                            placeholder="+91 1234567890"
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '1rem', fontWeight: 600, background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Create Admin Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                    Already have an admin account? <Link to="/admin-login" style={{ color: '#ef4444', fontWeight: 600 }}>Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminRegisterPage;
