import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { videoAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['All', 'Heart Health', 'Diabetes', 'Mental Health', 'Nutrition', 'General', 'Fitness', 'Cancer'];

const HealthVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = category && category !== 'All' ? { category } : {};
        const res = await videoAPI.getAll(params);
        setVideos(res.data.videos);
      } catch (e) {}
      setLoading(false);
    };
    fetch();
  }, [category]);

  // Fallback demo videos if none in DB
  const demoVideos = [
    { _id: 'd1', title: 'Heart Health Basics', category: 'Heart Health', youtubeId: 'UGxFH6kYqEQ', description: 'Learn about maintaining a healthy heart' },
    { _id: 'd2', title: 'Managing Diabetes', category: 'Diabetes', youtubeId: 'wZAjVQEE4_I', description: 'Complete guide to diabetes management' },
    { _id: 'd3', title: 'Mental Health Awareness', category: 'Mental Health', youtubeId: 'mOdPE5fL9N4', description: 'Understanding mental health and self-care' },
    { _id: 'd4', title: 'Balanced Nutrition', category: 'Nutrition', youtubeId: 'xuCn8ux2gbs', description: 'Build healthy eating habits' },
    { _id: 'd5', title: 'Stress Management', category: 'Mental Health', youtubeId: 'hnpQrMqDoqE', description: 'Techniques to reduce daily stress' },
    { _id: 'd6', title: 'Exercise for Beginners', category: 'Fitness', youtubeId: 'CBdlrVjhp-E', description: 'Start your fitness journey safely' },
  ];

  const displayVideos = videos.length > 0 ? videos : demoVideos;
  const filtered = category && category !== 'All' ? displayVideos.filter(v => v.category === category) : displayVideos;

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ margin: '-30px -20px 30px', borderRadius: '0 0 24px 24px', background: 'linear-gradient(135deg, #6d28d9, #4c1d95)' }}>
        <h1 style={{ color: 'white' }}>🎬 Healthcare Videos</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Curated health education videos from medical experts</p>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c === 'All' ? '' : c)}
            style={{ padding: '7px 16px', borderRadius: '999px', border: '1.5px solid', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
              background: (category === c || (c === 'All' && !category)) ? '#7c3aed' : 'transparent',
              color: (category === c || (c === 'All' && !category)) ? 'white' : '#7c3aed',
              borderColor: '#7c3aed',
            }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-3">
          {filtered.map(video => (
            <div key={video._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setSelectedVideo(video)}>
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/320x180?text=Video'; }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>▶️</div>
                </div>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#7c3aed', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {video.category}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{video.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setSelectedVideo(null)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
            <div className="video-embed">
              <iframe src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen title={selectedVideo.title} />
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '6px' }}>{selectedVideo.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{selectedVideo.description}</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: '12px' }} onClick={() => setSelectedVideo(null)}>✕ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthVideosPage;
