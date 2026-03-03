import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaSearch, FaPhone } from 'react-icons/fa';
import { getNearbyHospitals } from '../services/api';
import { HospitalCard } from '../components/SharedComponents';
import LoadingSpinner from '../components/LoadingSpinner';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const NearbyHospitalsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [osmHospitals, setOsmHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(5000);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getLocation = () => {
    setGeoLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setError('Unable to get your location. Please allow location access.');
        setGeoLoading(false);
      }
    );
  };

  useEffect(() => { getLocation(); }, []);

  useEffect(() => {
    if (!userLocation) return;
    const fetchNearby = async () => {
      setLoading(true);
      try {
        const res = await getNearbyHospitals({ lat: userLocation.lat, lng: userLocation.lng, radius });
        setHospitals(res.data.hospitals);
        setOsmHospitals(res.data.osmHospitals || []);
      } catch (e) {
        setError('Failed to fetch nearby hospitals');
      }
      setLoading(false);
    };
    fetchNearby();
  }, [userLocation, radius]);

  const allHospitals = [
    ...hospitals,
    ...osmHospitals.map(h => ({ ...h, fromOSM: true })),
  ];

  const filteredHospitals = allHospitals.filter(h => {
    if (selectedFilter === 'emergency') return h.emergencyAvailable;
    if (selectedFilter === 'icu') return h.icuAvailable;
    return true;
  });

  return (
    <div className="page-wrapper animate-fade">
      <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>🗺️ Nearby Hospitals</h1>
          <p style={{ color: 'var(--text-muted)' }}>{filteredHospitals.length} hospitals found near you</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="form-control" style={{ width: 'auto' }} value={radius} onChange={e => setRadius(e.target.value)}>
            <option value={2000}>2 km radius</option>
            <option value={5000}>5 km radius</option>
            <option value={10000}>10 km radius</option>
            <option value={20000}>20 km radius</option>
          </select>
          <button className="btn btn-primary" onClick={getLocation} disabled={geoLoading}>
            <FaMapMarkerAlt /> {geoLoading ? 'Getting...' : 'Refresh Location'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'emergency', 'icu'].map(f => (
          <button key={f} onClick={() => setSelectedFilter(f)}
            className={`btn btn-sm ${selectedFilter === f ? 'btn-primary' : 'btn-outline'}`}>
            {f === 'all' ? '🏥 All' : f === 'emergency' ? '🚨 Emergency' : '🏥 ICU'}
          </button>
        ))}
      </div>

      {/* Map */}
      {userLocation && (
        <div className="map-container animate-scale stagger-1" style={{ marginBottom: '28px' }}>
          <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {/* User location */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup><strong>📍 Your Location</strong></Popup>
            </Marker>
            <Circle center={[userLocation.lat, userLocation.lng]} radius={parseInt(radius)} color="#2D6A2D" fillOpacity={0.05} />

            {/* Hospitals from DB */}
            {hospitals.map(h => h.location?.coordinates && (
              <Marker key={h._id} position={[h.location.coordinates[1], h.location.coordinates[0]]} icon={hospitalIcon}>
                <Popup>
                  <strong>{h.name}</strong><br />
                  📍 {h.address}<br />
                  {h.phone && <><FaPhone /> {h.phone}<br /></>}
                  {h.emergencyAvailable && <span style={{ color: '#d32f2f' }}>🚨 Emergency Available</span>}
                </Popup>
              </Marker>
            ))}

            {/* OSM Hospitals */}
            {osmHospitals.map(h => h.lat && h.lng && (
              <Marker key={h._id} position={[h.lat, h.lng]} icon={hospitalIcon}>
                <Popup>
                  <strong>{h.name}</strong><br />
                  📍 {h.address}<br />
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>Source: OpenStreetMap</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Loading / Hospital List */}
      {!userLocation && !geoLoading && (
        <div className="empty-state">
          <div className="empty-state-icon">📍</div>
          <h3>Location Required</h3>
          <p>Please allow location access to find nearby hospitals</p>
          <button className="btn btn-primary" onClick={getLocation}>Allow Location</button>
        </div>
      )}

      {geoLoading && <LoadingSpinner message="Getting your location..." />}
      {loading && userLocation && <LoadingSpinner message="Finding nearby hospitals..." />}

      {!loading && userLocation && (
        <div className="animate-slide-up stagger-2">
          <h2 style={{ marginBottom: '20px' }}>🏥 {filteredHospitals.length} Hospitals Nearby</h2>
          <div className="grid grid-2">
            {filteredHospitals.map(h => <HospitalCard key={h._id} hospital={h} />)}
          </div>
          {filteredHospitals.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏥</div>
              <h3>No hospitals found</h3>
              <p>Try increasing the search radius</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyHospitalsPage;
