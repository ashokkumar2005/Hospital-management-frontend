import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏥</div>
    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
    <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>← Back to Home</Link>
  </div>
);

export default NotFoundPage;
