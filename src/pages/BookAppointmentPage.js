import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getDoctor, bookAppointment, getFamilyMembers } from '../services/api';
import Loader from '../components/common/Loader';

const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const consultType = searchParams.get('type') || 'in-person';

  const [form, setForm] = useState({ date: '', timeSlot: '', reason: '', type: consultType, bookedFor: '' });

  useEffect(() => {
    Promise.all([getDoctor(doctorId), getFamilyMembers()])
      .then(([docRes, famRes]) => {
        setDoctor(docRes.data.doctor);
        setFamilyMembers(famRes.data.members || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await bookAppointment({ doctor: doctorId, ...form });
      setSuccess(true);
      if (form.type === 'video' && data.appointment?.roomId) {
        setTimeout(() => navigate(`/consult/${data.appointment.roomId}`), 2000);
      } else {
        setTimeout(() => navigate('/appointments'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loader />;

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>📅 Book Appointment</h1>
          {doctor && <p>with Dr. {doctor.user?.name} – {doctor.specialization}</p>}
        </div>
      </div>
      <div className="container" style={{ maxWidth: '600px' }}>
        {success ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Appointment Booked!</h2>
            <p style={{ color: 'var(--gray)' }}>Redirecting to your appointments...</p>
          </div>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              {['in-person', 'video'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: `2px solid ${form.type === t ? 'var(--primary)' : '#e2e8f0'}`, background: form.type === t ? '#e0f2fe' : 'transparent', color: form.type === t ? 'var(--primary)' : 'var(--gray)', fontWeight: form.type === t ? 700 : 500, fontSize: '0.9rem', cursor: 'pointer' }}>
                  {t === 'video' ? '📹 Video Call' : '🏥 In-Person'}
                </button>
              ))}
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Who is this appointment for?</label>
                <select className="form-control" value={form.bookedFor} onChange={e => setForm({ ...form, bookedFor: e.target.value })}>
                  <option value="">Myself</option>
                  {familyMembers.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.relationship})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Date</label>
                <input type="date" className="form-control" min={minDate} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Select Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.5rem' }}>
                  {TIME_SLOTS.map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm({ ...form, timeSlot: t })}
                      style={{ padding: '0.5rem', borderRadius: '6px', border: `1px solid ${form.timeSlot === t ? 'var(--primary)' : '#e2e8f0'}`, background: form.timeSlot === t ? 'var(--primary)' : 'transparent', color: form.timeSlot === t ? '#fff' : 'var(--dark)', fontSize: '0.82rem', cursor: 'pointer' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea className="form-control" rows={3} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Describe your symptoms or reason..." />
              </div>
              <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                <strong>Consultation Fee: ₹{doctor?.consultationFee || 0}</strong><br />
                <span style={{ color: 'var(--gray)' }}>Payment at the time of appointment</span>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={submitting || !form.date || !form.timeSlot}>
                {submitting ? 'Booking...' : `Confirm ${form.type === 'video' ? 'Video Call' : 'Appointment'}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
