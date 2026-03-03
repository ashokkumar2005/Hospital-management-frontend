import React, { useState, useEffect } from 'react';
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FamilyManagementPage = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        relationship: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        medicalHistory: ''
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data } = await getFamilyMembers();
            setMembers(data.members);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateFamilyMember(editingId, form);
            } else {
                await addFamilyMember(form);
            }
            setShowModal(false);
            setEditingId(null);
            fetchMembers();
            setForm({
                name: '', relationship: '', dateOfBirth: '',
                gender: 'Male', bloodGroup: '', medicalHistory: ''
            });
            alert(editingId ? 'Profile updated!' : 'Family member added!');
        } catch (e) {
            console.error(e);
            alert('Failed to save profile.');
        }
    };

    const startEdit = (m) => {
        setEditingId(m._id);
        setForm({
            name: m.name,
            relationship: m.relationship,
            dateOfBirth: m.dateOfBirth ? m.dateOfBirth.split('T')[0] : '',
            gender: m.gender || 'Male',
            bloodGroup: m.bloodGroup || '',
            medicalHistory: m.medicalHistory || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this profile?')) return;
        try {
            await deleteFamilyMember(id);
            fetchMembers();
        } catch (e) {
            console.error(e);
            alert('Failed to delete member.');
        }
    };

    return (
        <div className="animate-fade">
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
                <div className="container">
                    <h1>👨‍👩‍👧‍👦 Family Management</h1>
                    <p>Add and manage profiles for your dependents to book appointments and track records</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3>👥 Your Family Circle</h3>
                    <button className="btn btn-primary" onClick={() => { setEditingId(null); setShowModal(true); }}>+ Add Family Member</button>
                </div>

                {loading ? (
                    <p>Loading family members...</p>
                ) : members.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏠</div>
                        <h3>No family profiles added yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Add your parents, spouse, or children to manage their health records and appointments from your account.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add First Member</button>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {/* Main account user (Self) */}
                        <div className="card hover-lift" style={{ borderTop: '4px solid var(--primary)', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 0 }}>{user?.name} (You)</h4>
                                    <span className="badge badge-success">Primary Account</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem' }}><strong>Blood:</strong> {user?.bloodGroup || 'N/A'}</p>
                            <p style={{ fontSize: '0.85rem' }}><strong>Email:</strong> {user?.email}</p>
                        </div>

                        {/* Family Members */}
                        {members.map(m => (
                            <div key={m._id} className="card hover-lift">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                            {m.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: 0 }}>{m.name}</h4>
                                            <span className="badge badge-info">{m.relationship}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                                    <p style={{ marginBottom: '0.25rem' }}><strong>🎂 DOB:</strong> {m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                    <p style={{ marginBottom: '0.25rem' }}><strong>🩸 Blood:</strong> {m.bloodGroup || 'N/A'}</p>
                                    <p style={{ marginBottom: '0.25rem' }}><strong>⚤ Gender:</strong> {m.gender}</p>
                                    {m.medicalHistory && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}><i>"{m.medicalHistory}"</i></p>}
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem' }} onClick={() => startEdit(m)}>✏️ Edit</button>
                                    <button className="btn btn-outline btn-danger" style={{ flex: 1, padding: '0.4rem' }} onClick={() => handleDelete(m._id)}>🗑️ Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Member Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2>{editingId ? 'Edit Profile' : 'Add Family Member'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Relationship</label>
                                    <select className="form-control" required value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}>
                                        <option value="">Select Relationship</option>
                                        {['Father', 'Mother', 'Spouse', 'Child', 'Sibling', 'Other'].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" className="form-control" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select className="form-control" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Blood Group</label>
                                    <select className="form-control" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                                        <option value="">Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Medical History / Allergies</label>
                                <textarea className="form-control" rows="2" value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} placeholder="e.g. Diabetic, hypertensive, egg allergy..." />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '1rem' }}>
                                {editingId ? '💾 Save Changes' : '✨ Add Family Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyManagementPage;
