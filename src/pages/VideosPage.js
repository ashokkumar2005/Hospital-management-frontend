import React, { useState, useEffect } from 'react';
import { getVideos } from '../services/api';
import Loader from '../components/common/Loader';

const CATEGORIES = [
  { value: '', label: 'All Videos', icon: '🎥' },
  { value: 'heart', label: 'Heart Health', icon: '❤️' },
  { value: 'diabetes', label: 'Diabetes', icon: '💉' },
  { value: 'mental', label: 'Mental Health', icon: '🧠' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { value: 'general', label: 'General', icon: '🏥' },
];

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [playing, setPlaying] = useState(null);

  useEffect(() => { fetchVideos(); }, [category]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data } = await getVideos(category ? { category } : {});
      setVideos(data.videos || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>🎥 Health Education Videos</h1>
          <p>Curated videos to help you understand and manage your health</p>
        </div>
      </div>
      <div className="container">
        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              style={{ padding: '0.5rem 1.1rem', borderRadius: '24px', border: `2px solid ${category === c.value ? 'var(--primary)' : '#e2e8f0'}`, background: category === c.value ? 'var(--primary)' : 'var(--white)', color: category === c.value ? '#fff' : 'var(--dark)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No videos found.</div>
        ) : (
          <div className="grid grid-3">
            {videos.map(v => (
              <div key={v._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {playing === v._id ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`}
                      title={v.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen />
                  </div>
                ) : (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0f172a', cursor: 'pointer' }}
                    onClick={() => setPlaying(v._id)}>
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt={v.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>▶️</span>
                    </div>
                  </div>
                )}
                <div style={{ padding: '1rem' }}>
                  <span className="badge badge-info" style={{ marginBottom: '0.5rem', fontSize: '0.72rem' }}>{v.category}</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>{v.title}</h3>
                  {v.description && <p style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{v.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
