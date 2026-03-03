import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import './LocationSearchIcon.css';

/**
 * LocationSearchIcon Component
 * A premium, quick-access icon component for hospital location search.
 * Designed to be a prominent "Quick Use" button for patients.
 */
const LocationSearchIcon = ({ onClick }) => {
    return (
        <div className="location-search-container" onClick={onClick}>
            <div className="icon-wrapper">
                <div className="pulse-ring"></div>
                <MapPin size={40} strokeWidth={2.5} />
                <div className="shine"></div>
            </div>

            <div className="search-label">Find Hospitals</div>
            <div className="search-subtext">Near your location</div>

            {/* Small floating indicator icon */}
            <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                color: 'var(--primary)',
                opacity: 0.8
            }}>
                <Navigation size={16} />
            </div>
        </div>
    );
};

export default LocationSearchIcon;
