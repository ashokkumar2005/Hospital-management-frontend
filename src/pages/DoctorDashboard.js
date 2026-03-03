import React, { useState, useEffect } from 'react';
import { getAppointments, updateDoctorProfile, getMe, getPatientHealthRecord, SERVER_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ specialization: '', experience: '', qualification: '', bio: '', consultationFee: '' });
  const [availability, setAvailability] = useState(DAYS.map(day => ({ day, startTime: '09:00', endTime: '17:00', isAvailable: false })));
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Patient Record Modal State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordLoading, setRecordLoading] = useState(false);

  useEffect(() => {
    Promise.all([getAppointments(), getMe()]).then(([a, m]) => {
      setAppointments(a.data.appointments || []);
      if (m.data.doctorProfile) {
        setDoctorProfile(m.data.doctorProfile);
        const d = m.data.doctorProfile;
        setProfileForm({ specialization: d.specialization || '', experience: d.experience || '', qualification: d.qualification || '', bio: d.bio || '', consultationFee: d.consultationFee || '' });
        if (d.availability?.length) setAvailability(DAYS.map(day => d.availability.find(a => a.day === day) || { day, startTime: '09:00', endTime: '17:00', isAvailable: false }));
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const { updateAppointment } = await import('../services/api');
    await updateAppointment(id, { status });
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach(key => formData.append(key, profileForm[key]));
      formData.append('availability', JSON.stringify(availability));
      if (imageFile) formData.append('image', imageFile);

      await updateDoctorProfile(formData);
      alert('Profile updated!');
      // Refresh user data to show new avatar
      const m = await getMe();
      if (m.data.doctorProfile) {
        setDoctorProfile(m.data.doctorProfile);
        setImagePreview(null);
        setImageFile(null);
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const toggleDay = (day) => setAvailability(prev => prev.map(a => a.day === day ? { ...a, isAvailable: !a.isAvailable } : a));
  const fetchPatientRecord = async (patientId) => {
    setRecordLoading(true);
    try {
      const { data } = await getPatientHealthRecord(patientId);
      setSelectedRecord(data.record);
    } catch (e) {
      alert(e.response?.data?.message || 'Error fetching health record. Please try again.');
    } finally {
      setRecordLoading(false);
    }
  };

  const updateTime = (day, field, value) => setAvailability(prev => prev.map(a => a.day === day ? { ...a, [field]: value } : a));

  const pending = appointments.filter(a => a.status === 'pending');
  const today = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString());

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>👨‍⚕️ Doctor Dashboard</h1>
          <p>Dr. {user?.name} – Manage appointments and profile</p>
        </div>
      </div>
      <div className="container">
        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { label: "Today's Appointments", value: today.length, icon: '📅', color: 'var(--primary)' },
            { label: 'Pending Approval', value: pending.length, icon: '⏰', color: '#f59e0b' },
            { label: 'Total Patients', value: new Set(appointments.map(a => a.patient?._id)).size, icon: '👤', color: 'var(--secondary)' },
            { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: '✅', color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
          {['appointments', 'profile', 'schedule'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.7rem 1.4rem', background: 'none', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent', color: tab === t ? 'var(--primary)' : 'var(--gray)', fontWeight: tab === t ? 700 : 500, marginBottom: '-2px', textTransform: 'capitalize', cursor: 'pointer', fontSize: '0.9rem' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.length === 0 ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No appointments yet.</div> : (
              appointments.map(a => (
                <div key={a._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3>{a.patient?.name}</h3>
                      <p style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>📅 {new Date(a.date).toDateString()} at {a.timeSlot}</p>
                      {a.reason && <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>Reason: {a.reason}</p>}
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <span className={`badge ${a.type === 'video' ? 'badge-info' : 'badge-success'}`}>{a.type}</span>
                        <span className={`badge ${a.status === 'confirmed' ? 'badge-success' : a.status === 'pending' ? 'badge-warning' : a.status === 'completed' ? 'badge-info' : 'badge-danger'}`}>{a.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {a.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(a._id, 'confirmed')} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>✅ Confirm</button>
                          <button onClick={() => handleStatusUpdate(a._id, 'cancelled')} className="btn btn-danger" style={{ fontSize: '0.82rem' }}>❌ Reject</button>
                        </>
                      )}
                      {a.status === 'confirmed' && (
                        <>
                          <button onClick={() => handleStatusUpdate(a._id, 'completed')} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>✓ Complete</button>
                          {a.type === 'video' && a.roomId && (
                            <a href={`/consult/${a.roomId}`} className="btn btn-primary" style={{ fontSize: '0.82rem', textAlign: 'center' }}>📹 Join Call</a>
                          )}
                        </>
                      )}
                      {a.patient?._id && (
                        <button onClick={() => fetchPatientRecord(a.patient._id)} className="btn btn-outline" style={{ fontSize: '0.82rem' }}>📋 View Record</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', background: '#f1f5f9' }}>
                  <img
                    src={imagePreview || (doctorProfile?.user?.avatar ? `${SERVER_URL}${doctorProfile.user.avatar}` : 'https://via.placeholder.com/150')}
                    alt="Doctor"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', marginBottom: '0.5rem', display: 'inline-block' }}>
                    📷 Choose New Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Professional photos help build trust with patients.</p>
                </div>
              </div>
              <div className="form-group"><label>Specialization</label><input className="form-control" value={profileForm.specialization} onChange={e => setProfileForm({ ...profileForm, specialization: e.target.value })} /></div>
              <div className="form-group"><label>Experience (years)</label><input type="number" className="form-control" value={profileForm.experience} onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })} /></div>
              <div className="form-group"><label>Qualification</label><input className="form-control" value={profileForm.qualification} onChange={e => setProfileForm({ ...profileForm, qualification: e.target.value })} placeholder="MBBS, MD..." /></div>
              <div className="form-group"><label>Consultation Fee (₹)</label><input type="number" className="form-control" value={profileForm.consultationFee} onChange={e => setProfileForm({ ...profileForm, consultationFee: e.target.value })} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Bio / About</label><textarea className="form-control" rows={3} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} /></div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Profile'}</button>
          </form>
        )}

        {tab === 'schedule' && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Weekly Availability Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {availability.map(slot => (
                <div key={slot.day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', background: slot.isAvailable ? '#f0fdf4' : 'var(--light)', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '130px', fontWeight: 600 }}>
                    <input type="checkbox" checked={slot.isAvailable} onChange={() => toggleDay(slot.day)} />
                    {slot.day}
                  </label>
                  {slot.isAvailable && (
                    <>
                      <input type="time" value={slot.startTime} onChange={e => updateTime(slot.day, 'startTime', e.target.value)} className="form-control" style={{ width: '130px' }} />
                      <span>to</span>
                      <input type="time" value={slot.endTime} onChange={e => updateTime(slot.day, 'endTime', e.target.value)} className="form-control" style={{ width: '130px' }} />
                    </>
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSaveProfile} className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Schedule'}
            </button>
          </div>
        )}
      </div>

      {/* Patient Record Modal */}
      {(recordLoading || selectedRecord) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card animate-scale" style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedRecord(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>

            {recordLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}><Loader /></div>
            ) : (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>📋 Health Record: {selectedRecord.patient?.name || 'Patient'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Basic Info</h4>
                    <p><strong>Blood Group:</strong> {selectedRecord.bloodGroup || 'Not specified'}</p>
                    <p><strong>Weight:</strong> {selectedRecord.weight ? `${selectedRecord.weight} kg` : 'N/A'}</p>
                    <p><strong>Height:</strong> {selectedRecord.height ? `${selectedRecord.height} cm` : 'N/A'}</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Medications</h4>
                    <p>{selectedRecord.currentMeds?.length > 0 ? selectedRecord.currentMeds.map(m => m.name).join(', ') : 'No current medications'}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Allergies</h4>
                  <p>{selectedRecord.allergies?.length > 0 ? selectedRecord.allergies.join(', ') : 'None reported'}</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Medical History</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {selectedRecord.medicalHistory?.length > 0 ?
                      selectedRecord.medicalHistory.map((m, i) => <li key={i}>{m.condition} {m.diagnosedYear ? `(${m.diagnosedYear})` : ''}</li>)
                      : <li>No significant history reported</li>}
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Uploaded Reports</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {selectedRecord.reports && selectedRecord.reports.length > 0 ? (
                      selectedRecord.reports.map(r => (
                        <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div>
                            <p style={{ fontWeight: 600 }}>📄 {r.title}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{new Date(r.uploadedAt).toDateString()}</p>
                          </div>
                          <a
                            href={`${SERVER_URL}${r.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline"
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                          >
                            View File
                          </a>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: '12px', color: 'var(--gray)' }}>
                        No reports uploaded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setSelectedRecord(null)} className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
