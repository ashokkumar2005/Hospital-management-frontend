import React, { useState, useEffect } from 'react';
import { getDoctors, hospitalAddDoctor, hospitalDeleteDoctor, hospitalUpdateDoctor, getHospital, SERVER_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { UserPlus, Users, Trash2, Edit2, ShieldAlert, Activity, Hospital as HospitalIcon } from 'lucide-react';

const HospitalDashboard = () => {
    const { user } = useAuth();
    const [hospital, setHospital] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialization: '', experience: '', qualification: '', consultationFee: 0 });
    const [editingDoctor, setEditingDoctor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.hospital) {
                    const [hResp, dResp] = await Promise.all([
                        getHospital(user.hospital),
                        getDoctors({ hospitalId: user.hospital })
                    ]);
                    setHospital(hResp.data.hospital);
                    setDoctors(dResp.data.doctors || []);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            if (editingDoctor) {
                const { data } = await hospitalUpdateDoctor(editingDoctor._id, doctorForm);
                setDoctors(prev => prev.map(d => d._id === editingDoctor._id ? { ...d, ...data.doctor } : d));
                alert('Doctor updated successfully');
            } else {
                const { data } = await hospitalAddDoctor(doctorForm);
                // Need to refetch or manually add to list (but data.doctor might not be fully populated)
                setDoctors(prev => [...prev, data.doctor]);
                alert('Doctor added successfully');
            }
            setShowAddModal(false);
            setEditingDoctor(null);
            setDoctorForm({ name: '', email: '', password: '', specialization: '', experience: '', qualification: '', consultationFee: 0 });
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Remove this doctor from your hospital?')) {
            await hospitalDeleteDoctor(id);
            setDoctors(prev => prev.filter(d => d._id !== id));
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade">
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <HospitalIcon size={32} />
                        <h1 style={{ margin: 0 }}>{hospital?.name} Administration</h1>
                    </div>
                    <p style={{ opacity: 0.9 }}>Manage your affiliated medical specialists and hospital operations.</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '5rem' }}>
                <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Users size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{doctors.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Specialists</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Activity size={32} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>Active</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>System Status</div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ margin: 0 }}>Specialists Directory</h2>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <UserPlus size={18} /> Add New Specialist
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Specialist</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Specialization</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Experience</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Fee</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(d => (
                                    <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="flex align-center gap-1">
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, overflow: 'hidden' }}>
                                                    {d.user?.avatar ? <img src={`${SERVER_URL}${d.user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : d.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>Dr. {d.user?.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{d.specialization}</td>
                                        <td style={{ padding: '1rem' }}>{d.experience} Years</td>
                                        <td style={{ padding: '1rem' }}>₹{d.consultationFee}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div className="flex gap-1 justify-end">
                                                <button className="btn btn-sm btn-outline" onClick={() => {
                                                    setEditingDoctor(d);
                                                    setDoctorForm({ ...d, name: d.user?.name, email: d.user?.email });
                                                    setShowAddModal(true);
                                                }}><Edit2 size={16} /></button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDoctor(d._id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3>{editingDoctor ? 'Edit specialist details' : 'Register New Specialist'}</h3>
                            <button onClick={() => { setShowAddModal(false); setEditingDoctor(null); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleAddDoctor} className="grid grid-2" style={{ gap: '1rem' }}>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Full Name</label>
                                <input className="form-control" required value={doctorForm.name} onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })} disabled={!!editingDoctor} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" required value={doctorForm.email} onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} disabled={!!editingDoctor} />
                            </div>
                            {!editingDoctor && (
                                <div className="form-group">
                                    <label className="form-label">Initial Password</label>
                                    <input className="form-control" value={doctorForm.password} onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })} placeholder="Default: doctor123" />
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Specialization</label>
                                <input className="form-control" required value={doctorForm.specialization} onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Years of Experience</label>
                                <input type="number" className="form-control" required value={doctorForm.experience} onChange={e => setDoctorForm({ ...doctorForm, experience: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Qualification</label>
                                <input className="form-control" required value={doctorForm.qualification} onChange={e => setDoctorForm({ ...doctorForm, qualification: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Consultation Fee (₹)</label>
                                <input type="number" className="form-control" required value={doctorForm.consultationFee} onChange={e => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary btn-block">
                                    {editingDoctor ? 'Update Specialist' : 'Add specialist'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDashboard;
