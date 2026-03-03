import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
  </div>
);

export default LoadingSpinner;
