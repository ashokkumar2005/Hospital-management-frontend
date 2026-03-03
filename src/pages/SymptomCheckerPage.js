import React, { useState } from 'react';
import { checkSymptoms } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const COMMON_SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Fatigue', 'Dizziness', 'Stomach Pain', 'Chest Pain', 'Shortness of Breath', 'Joint Pain', 'Rash'];
const URGENCY_CONFIG = { low: { color: '#10b981', label: 'Low Urgency', icon: '🟢' }, medium: { color: '#f59e0b', label: 'Moderate Urgency', icon: '🟡' }, high: { color: '#ef4444', label: 'High Urgency – Seek Immediate Care', icon: '🔴' } };

const SymptomCheckerPage = () => {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuth } = useAuth();

  const toggleSymptom = (s) => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleCheck = async () => {
    const symptoms = [...selected, ...input.split(',').map(s => s.trim()).filter(Boolean)];
    if (symptoms.length === 0) return;
    setLoading(true);
    try {
      const { data } = await checkSymptoms({ symptoms });
      setResults(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const urgency = results ? URGENCY_CONFIG[results.overallUrgency] : null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>🧠 AI Symptom Checker</h1>
          <p>Describe your symptoms for an initial assessment and specialist recommendations</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Select your symptoms:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {COMMON_SYMPTOMS.map(s => (
              <button key={s} onClick={() => toggleSymptom(s.toLowerCase())}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '24px',
                  border: `2px solid ${selected.includes(s.toLowerCase()) ? 'var(--primary)' : 'var(--border)'}`,
                  background: selected.includes(s.toLowerCase()) ? 'var(--primary)' : 'transparent',
                  color: selected.includes(s.toLowerCase()) ? '#fff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  transition: 'var(--transition)'
                }}>
                {s}
              </button>
            ))}
          </div>
          <div className="form-group">
            <label>Or type additional symptoms (comma-separated):</label>
            <input className="form-control" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. nausea, back pain, sore throat..." />
          </div>
          {isAuth ? (
            <button onClick={handleCheck} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading || (selected.length === 0 && !input.trim())}>
              {loading ? 'Analyzing...' : '🔍 Check Symptoms'}
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', textAlign: 'center', display: 'block' }}>
              Login to Use Symptom Checker
            </Link>
          )}
        </div>

        {results && (
          <div>
            {/* Urgency Banner */}
            <div style={{ background: urgency?.color + '15', border: `2px solid ${urgency?.color}`, borderRadius: 'var(--radius)', padding: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem' }}>{urgency?.icon}</p>
              <h3 style={{ color: urgency?.color }}>{urgency?.label}</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-main)', fontWeight: 500 }}>{results.advice}</p>
            </div>

            {results.symptoms.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {results.symptoms.map((s, i) => (
                  <div key={i} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ textTransform: 'capitalize' }}>🩺 {s.symptom}</h4>
                      <span className={`badge badge-${s.urgency === 'high' ? 'danger' : s.urgency === 'medium' ? 'warning' : 'success'}`} style={{ textTransform: 'capitalize' }}>{s.urgency} urgency</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      Possible conditions: {s.conditions.join(' • ')}
                    </p>
                    <p style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
                      Recommended specialist: <strong style={{ color: 'var(--primary)' }}>{s.specialist}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {results.symptoms.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Symptoms not recognized. Please consult a doctor for proper evaluation.
              </div>
            )}

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--warning)', borderRadius: '12px', padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--warning)', fontWeight: 800 }}>⚠️ DISCLAIMER:</span> {results.disclaimer}
            </div>

            <Link to="/hospitals" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              Find Specialists in Hospitals →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
