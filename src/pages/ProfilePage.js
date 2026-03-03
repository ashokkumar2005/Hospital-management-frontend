import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, SERVER_URL } from '../services/api';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', lastVisitDate: '',
    healthCondition: '', medicineReminder: '',
    emergencyName: '', emergencyPhone: '', emergencyEmail: '',
    bloodGroup: '', isBloodDonor: false
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        lastVisitDate: user.lastVisitDate ? user.lastVisitDate.split('T')[0] : '',
        healthCondition: user.healthCondition || '',
        medicineReminder: user.medicineReminder || '',
        emergencyName: user.emergencyContact?.name || '',
        emergencyPhone: user.emergencyContact?.phone || '',
        emergencyEmail: user.emergencyContact?.email || '',
        bloodGroup: user.bloodGroup || '',
        isBloodDonor: user.isBloodDonor || false
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        lastVisitDate: form.lastVisitDate || undefined,
        healthCondition: form.healthCondition,
        medicineReminder: form.medicineReminder,
        bloodGroup: form.bloodGroup,
        isBloodDonor: form.isBloodDonor,
        emergencyContact: {
          name: form.emergencyName,
          phone: form.emergencyPhone,
          email: form.emergencyEmail
        },
      });
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <div className="container">
          <h1 className="animate-slide-up">👤 User Profile</h1>
          <p className="animate-slide-up stagger-1">Manage your medical credentials and account preferences</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>
        {success && <div className="alert alert-success animate-fade">{success}</div>}

        {/* Profile Avatar Header */}
        <div className="card hover-lift animate-slide-up stagger-2" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '2.5rem' }}>
          <div className="animate-scale" style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-lg)',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {user?.avatar ? (
              <img
                src={`${SERVER_URL}${user.avatar}`}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{user?.email}</p>
            <div style={{ marginTop: '0.75rem' }}>
              <span className={`badge badge-${user?.role === 'admin' ? 'danger' : user?.role === 'doctor' ? 'info' : 'success'}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1.2rem' }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="animate-slide-up stagger-3">
          {/* Basic Info */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📝 Basic Information
            </h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Primary)</label>
              <input className="form-control" value={user?.email} disabled style={{ background: 'var(--bg-main)', cursor: 'not-allowed', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Health Alerts */}
          {user?.role === 'patient' && (
            <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔔 Medical Preferences
              </h3>
              <div className="form-group">
                <label className="form-label">Last Physical Checkup Date</label>
                <input type="date" className="form-control" value={form.lastVisitDate} onChange={e => setForm({ ...form, lastVisitDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Medical Conditions</label>
                <input className="form-control" value={form.healthCondition} onChange={e => setForm({ ...form, healthCondition: e.target.value })} placeholder="e.g. Chronic Asthma, Gluten Allergy..." />
              </div>
              <div className="form-group">
                <label className="form-label">Active Medications</label>
                <textarea className="form-control" rows={3} value={form.medicineReminder} onChange={e => setForm({ ...form, medicineReminder: e.target.value })} placeholder="List your regular medications here..." />
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#000000', border: '1px solid rgba(45, 106, 45, 0.2)' }}>
                <strong>Tip:</strong> Keep this information updated to help our AI provide better health monitoring.
              </div>
            </div>
          )}

          {/* Blood Donor Information */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🩸 Blood Donor Information
            </h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select className="form-control" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                  <option value="">Select Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" checked={form.isBloodDonor} onChange={e => setForm({ ...form, isBloodDonor: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: 600 }}>Register as a Blood Donor</span>
                </label>
              </div>
            </div>
            {form.isBloodDonor && (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #ef4444', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Thank you! By registering as a donor, your contact details will be visible to users in your area who need urgent blood matching your type.
                </p>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🆘 Emergency Contact
            </h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Contact Name</label>
                <input className="form-control" value={form.emergencyName} onChange={e => setForm({ ...form, emergencyName: e.target.value })} placeholder="Next of kin name" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input className="form-control" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} placeholder="+91 9876543210" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input type="email" className="form-control" value={form.emergencyEmail} onChange={e => setForm({ ...form, emergencyEmail: e.target.value })} placeholder="contact@example.com" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={saving} style={{
            borderRadius: '16px',
            padding: '1.2rem',
            fontSize: '1.1rem',
            boxShadow: '0 10px 20px rgba(45, 106, 45, 0.2)'
          }}>
            {saving ? 'Processing Changes...' : '💾 Update Profile Information'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
