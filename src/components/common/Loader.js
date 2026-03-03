import React from 'react';
const Loader = ({ text = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
    <div className="spinner"></div>
    <p style={{ color: 'var(--gray)' }}>{text}</p>
  </div>
);
export default Loader;
