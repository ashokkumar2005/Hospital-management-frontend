import React, { useState } from 'react';
const StarRating = ({ value = 0, onChange, readonly = false, size = '1.3rem' }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {[1,2,3,4,5].map(star => (
        <span key={star} style={{ fontSize: size, cursor: readonly ? 'default' : 'pointer', color: (hover || value) >= star ? '#fbbf24' : '#e2e8f0' }}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}>
          ★
        </span>
      ))}
    </div>
  );
};
export default StarRating;
