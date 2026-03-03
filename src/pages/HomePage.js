import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDoctors, getHospitals } from '../services/api';
import LocationSearchIcon from '../components/LocationSearchIcon';

const HomePage = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, hospitals: 0 });

  useEffect(() => {
    Promise.all([getDoctors(), getHospitals()]).then(([d, h]) => {
      setStats({ doctors: d.data.count || 0, hospitals: h.data.count || 0 });
    }).catch(() => { });
  }, []);

  const features = [
    { icon: '🏥', title: 'Find Hospitals', desc: 'Locate nearby hospitals with real-time map and directions.', link: '/hospitals' },
    { icon: '👨‍⚕️', title: 'Book Doctors', desc: 'Find specialists via their affiliated hospitals.', link: '/hospitals' },
    { icon: '📹', title: 'Video Consult', desc: 'Secure real-time video calls with your doctor.', link: '/hospitals' },
    { icon: '🧠', title: 'Symptom Checker', desc: 'AI-powered symptom assessment with specialist recommendations.', link: '/symptom-checker' },
    { icon: '📋', title: 'Health Records', desc: 'Store and manage your complete health history securely.', link: '/health-record' },
    { icon: '🏕️', title: 'Medical Camps', desc: 'Find free health camps near you.', link: '/medical-camps' },
    { icon: '🎥', title: 'Health Videos', desc: 'Curated educational videos on various health topics.', link: '/videos' },
    { icon: '🆘', title: 'SOS Alert', desc: 'One-tap emergency alert with live location sharing.', link: '/sos' },
  ];

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section className="page-header" style={{ padding: '6rem 1rem', borderRadius: '0 0 40px 40px', textAlign: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="animate-slide-up" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Healthcare Simplified <span className="desktop-only"><br /></span>
            <span style={{ color: 'var(--primary-light)' }}>Online Specialist Access</span>
          </h1>
          <p className="animate-slide-up stagger-1" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', opacity: 0.9, maxWidth: '700px', margin: '1.5rem auto 2.5rem', color: 'rgba(255,255,255,0.95)' }}>
            Find doctors, book appointments, and consult with specialists from the comfort of your home. Your complete digital health companion.
          </p>

          <div className="flex flex-wrap justify-center gap-2 animate-slide-up stagger-2">
            {isAuth ? (
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.05rem' }}>
                Go to Your Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.05rem' }}>
                  Join SmartDoctor Free
                </Link>
                <Link to="/hospitals" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.05rem', color: 'white', borderColor: 'white' }}>
                  Explore Hospitals
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <div className="animate-float desktop-only" style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '4rem', opacity: 0.1 }}>💊</div>
        <div className="animate-float desktop-only" style={{ position: 'absolute', bottom: '20%', right: '5%', fontSize: '5rem', opacity: 0.1, animationDelay: '1s' }}>🏥</div>
      </section>

      {/* Stats Section */}
      <section style={{ marginTop: '-30px', padding: '0 1rem' }}>
        <div className="container">
          <div className="glass animate-scale stagger-3 grid" style={{
            padding: '2rem',
            borderRadius: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            {[
              { icon: '👨‍⚕️', value: `${stats.doctors}+`, label: 'Verified Doctors' },
              { icon: '🏥', value: `${stats.hospitals}+`, label: 'Partner Hospitals' },
              { icon: '📅', value: '10K+', label: 'Happy Patients' },
              { icon: '⭐', value: '4.9', label: 'Patient Rating' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="animate-slide-up" style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>Everything You Need</h2>
            <p className="animate-slide-up stagger-1" style={{ fontSize: '1rem' }}>Complete healthcare management at your fingertips</p>
          </div>

          <div className="grid grid-4">
            {features.map((f, index) => (
              <Link to={f.link} key={f.title} className={`animate-slide-up stagger-${(index % 5) + 1}`} style={{ display: 'block' }}>
                <div className="card" style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                  <div className="animate-float" style={{ fontSize: '2.5rem', marginBottom: '1.2rem', animationDelay: `${index * 0.2}s` }}>{f.icon}</div>
                  <h3 style={{ marginBottom: '0.6rem', fontSize: '1.2rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 1rem', background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="glass" style={{ background: 'var(--primary-gradient)', padding: '4rem 1.5rem', borderRadius: '32px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '1.2rem' }}>Ready to Start Your Health Journey?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Join thousands of patients who trust SmartDoctor for their medical needs. Secure, fast, and accessible 24/7.
            </p>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'white', color: 'var(--primary-dark)', boxShadow: 'var(--shadow-lg)', width: 'auto' }}>
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
