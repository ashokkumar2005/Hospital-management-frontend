import React, { useState, useEffect } from 'react';
import { getHealthRecord, updateHealthRecord, uploadReport, deleteReport, SERVER_URL } from '../services/api';
import Loader from '../components/common/Loader';

const HealthRecordPage = () => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    bloodGroup: '', weight: '', height: '', allergies: '', currentMeds: '', medicalHistory: ''
  });

  useEffect(() => {
    getHealthRecord().then(({ data }) => {
      setRecord(data.record);
      setForm({
        bloodGroup: data.record?.bloodGroup || '',
        weight: data.record?.weight || '',
        height: data.record?.height || '',
        allergies: (data.record?.allergies || []).join(', '),
        currentMeds: (data.record?.currentMeds || []).map(m => m.name).join(', '),
        medicalHistory: (data.record?.medicalHistory || []).map(m => m.condition).join(', '),
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        bloodGroup: form.bloodGroup,
        weight: parseFloat(form.weight) || undefined,
        height: parseFloat(form.height) || undefined,
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        currentMeds: form.currentMeds ? form.currentMeds.split(',').map(n => ({ name: n.trim() })).filter(m => m.name) : [],
        medicalHistory: form.medicalHistory ? form.medicalHistory.split(',').map(c => ({ condition: c.trim() })).filter(m => m.condition) : [],
      };
      const { data } = await updateHealthRecord(payload);
      setRecord(data.record);
      setSuccess('Health record saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('title', uploadFile.name);
    try {
      const { data } = await uploadReport(fd);
      setRecord(data.record);
      setUploadFile(null);
      setSuccess('Report uploaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { console.error(e); }
    finally { setUploading(false); }
  };

  const handleDeleteReport = async (rid) => {
    if (!window.confirm('Delete this report?')) return;
    const { data } = await deleteReport(rid);
    setRecord(data.record);
  };

  if (loading) return <Loader />;

  const bmi = form.weight && form.height ? (parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1) : null;
  const bmiStatus = bmi ? (bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese') : null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>📋 Health Record</h1>
          <p>Your complete medical history, securely stored</p>
        </div>
      </div>
      <div className="container">
        {success && <div className="alert alert-success">{success}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
          {['basic', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.8rem 1.5rem', background: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === tab ? 'var(--primary)' : 'var(--gray)', fontWeight: activeTab === tab ? 700 : 500, marginBottom: '-2px', textTransform: 'capitalize', fontSize: '0.95rem', cursor: 'pointer' }}>
              {tab === 'basic' ? 'Health Info' : 'Reports & Files'}
            </button>
          ))}
        </div>

        {activeTab === 'basic' && (
          <form onSubmit={handleSave}>
            {bmi && (
              <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{bmi}</div>
                  <div style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>BMI – {bmiStatus}</div>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Basic Info</h3>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select className="form-control" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" className="form-control" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="70" />
                </div>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input type="number" className="form-control" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="170" />
                </div>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Medical Details</h3>
                <div className="form-group">
                  <label>Allergies (comma-separated)</label>
                  <textarea className="form-control" rows={2} value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="Penicillin, Peanuts, Dust..." />
                </div>
                <div className="form-group">
                  <label>Current Medications</label>
                  <textarea className="form-control" rows={2} value={form.currentMeds} onChange={e => setForm({ ...form, currentMeds: e.target.value })} placeholder="Aspirin, Metformin..." />
                </div>
                <div className="form-group">
                  <label>Medical History (conditions)</label>
                  <textarea className="form-control" rows={2} value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} placeholder="Diabetes, Hypertension..." />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Health Record'}
            </button>
          </form>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Upload Report / Prescription</h3>
              <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Choose File (PDF, Image – max 10MB)</label>
                  <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setUploadFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!uploadFile || uploading}>
                  {uploading ? 'Uploading...' : '⬆️ Upload'}
                </button>
              </form>
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Uploaded Reports ({record?.reports?.length || 0})</h3>
            {record?.reports?.length > 0 ? (
              <div className="grid grid-2">
                {record.reports.map(r => (
                  <div key={r._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>📄 {r.title}</p>
                      <p style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{new Date(r.uploadedAt).toDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a
                        href={`${SERVER_URL}${r.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                      >
                        View
                      </a>
                      <button onClick={() => handleDeleteReport(r._id)} className="btn btn-danger" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', color: 'var(--gray)', border: '1px dashed var(--border)' }}>
                No reports uploaded yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecordPage;
