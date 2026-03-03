import React, { useState, useEffect } from 'react';
import { getDoctors } from '../services/api';
import DoctorCard from '../components/common/DoctorCard';
import Loader from '../components/common/Loader';

const SPECIALIZATIONS = ['Cardiologist', 'Neurologist', 'Orthopedist', 'Pediatrician', 'Dermatologist', 'Gynecologist', 'Psychiatrist', 'Gastroenterologist', 'Pulmonologist', 'General Physician', 'Ophthalmologist', 'ENT Specialist'];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getDoctors(params);
      setDoctors(data.doctors || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors({ search, specialization });
  };

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <div className="container">
          <h1 className="animate-slide-up">👨‍⚕️ Find Specialists</h1>
          <p className="animate-slide-up stagger-1">Browse trusted medical experts and book your consultation instantly</p>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        {/* Filters */}
        <form onSubmit={handleSearch} className="glass animate-slide-up stagger-2" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1.5rem', borderRadius: '24px' }}>
          <input className="form-control" style={{ flex: 1, minWidth: '220px' }} placeholder="Search doctor by name..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="form-control" style={{ flex: 1, minWidth: '220px' }} value={specialization} onChange={e => setSpecialization(e.target.value)}>
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-1" style={{ flexShrink: 0 }}>
            <button type="submit" className="btn btn-primary">Apply Filters</button>
            <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setSpecialization(''); fetchDoctors(); }}>Reset</button>
          </div>
        </form>

        {/* Specialization chips */}
        <div className="animate-slide-up stagger-3" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {SPECIALIZATIONS.slice(0, 8).map((s, i) => (
            <button key={s} onClick={() => { setSpecialization(s); fetchDoctors({ specialization: s }); }}
              className="badge" style={{
                cursor: 'pointer',
                padding: '0.6rem 1.2rem',
                background: specialization === s ? 'var(--primary-gradient)' : 'var(--bg-card)',
                color: specialization === s ? '#fff' : 'var(--text-muted)',
                border: specialization === s ? 'none' : '1px solid var(--border)',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'var(--transition)'
              }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center" style={{ padding: '6rem' }}><Loader /></div>
        ) : (
          <div className="animate-fade">
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
              Found {doctors.length} results matching your criteria
            </p>
            <div className="grid grid-3">
              {doctors.map((d, i) => (
                <div key={d._id} className={`animate-slide-up stagger-${(i % 5) + 1}`}>
                  <DoctorCard doctor={d} />
                </div>
              ))}
            </div>
            {doctors.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-main)', border: '2px dashed var(--border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3>No doctors found</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try adjusting your search filters or specialization.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
