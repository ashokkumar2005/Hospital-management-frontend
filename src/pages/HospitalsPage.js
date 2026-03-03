import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getHospitals, getNearbyHospitals } from '../services/api';
import HospitalCard from '../components/common/HospitalCard';
import Loader from '../components/common/Loader';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });

// Recenter map component
const RecenterMap = ({ center, zoom, route }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      map.fitBounds(L.polyline(route).getBounds(), { padding: [50, 50] });
    } else if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, route, map]);
  return null;
};

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [route, setRoute] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    fetchHospitals();
    getUserLocation();
  }, []);

  const fetchRoute = async (hospital) => {
    if (!userLocation) {
      alert('📍 Please enable location services first!');
      return;
    }

    if (!hospital.location?.coordinates ||
      (hospital.location.coordinates[0] === 0 && hospital.location.coordinates[1] === 0)) {
      alert('⚠️ This hospital does not have valid GPS coordinates updated.');
      return;
    }

    const [hLng, hLat] = hospital.location.coordinates;
    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${hLng},${hLat}?overview=full&geometries=geojson`);
      const data = await resp.json();

      if (data.code !== 'Ok') {
        alert('❌ Unable to find a driving route to this location.');
        return;
      }

      if (data.routes && data.routes.length > 0) {
        // OSRM returns [lng, lat], Leaflet needs [lat, lng]
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRoute(coords);
        setSelectedHospital(hospital);
        setViewMode('map');

        // Midpoint for centering if you want, or just user location
        // We use RecenterMap already
      }
    } catch (e) {
      console.error('Route fetch failed', e);
      alert('📡 Navigation service unavailable. Check your internet connection.');
    }
  };

  const fetchHospitals = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getHospitals(params);
      setHospitals(data.hospitals || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = { lat: coords.latitude, lng: coords.longitude };
          setUserLocation(loc);
          getNearbyHospitals({ lat: loc.lat, lng: loc.lng, maxDistance: 15000 })
            .then(({ data }) => { if (data.hospitals?.length) setHospitals(data.hospitals); })
            .catch(() => { });
        },
        () => console.log('Location denied')
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHospitals({ search, specialization, emergency: emergencyOnly || undefined });
  };

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.2090];

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <div className="container">
          <h1 className="animate-slide-up">🏥 Find Hospitals</h1>
          <p className="animate-slide-up stagger-1">Discover elite medical facilities near you with real-time navigation</p>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        {/* Filters */}
        <form onSubmit={handleSearch} className="glass animate-slide-up stagger-2" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1.5rem', borderRadius: '24px', alignItems: 'center' }}>
          <input className="form-control" style={{ flex: 1, minWidth: '180px' }} placeholder="Search hospitals..." value={search} onChange={e => setSearch(e.target.value)} />
          <input className="form-control" style={{ flex: 1, minWidth: '180px' }} placeholder="Filter by specialty..." value={specialization} onChange={e => setSpecialization(e.target.value)} />
          <div className="flex align-center gap-1" style={{ whiteSpace: 'nowrap' }}>
            <input type="checkbox" id="emergency" checked={emergencyOnly} onChange={e => setEmergencyOnly(e.target.checked)} />
            <label htmlFor="emergency" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>🚨 Emergency Only</label>
          </div>
          <div className="flex gap-1">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>Search</button>
            <button type="button" className="btn btn-outline" onClick={getUserLocation}>📍 Near Me</button>
            <button type="button" className="btn btn-danger" onClick={() => { if (hospitals.length) fetchRoute(hospitals[0]); }}>🚨 Nearest</button>
            <button type="button" className="btn btn-outline" onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}>
              {viewMode === 'grid' ? '🗺️ Open Map' : '▦ Show Grid'}
            </button>
          </div>
        </form>

        {loading ? <div className="flex justify-center" style={{ padding: '6rem' }}><Loader /></div> : (
          <div className="animate-fade">
            {viewMode === 'map' && (
              <div className="animate-scale" style={{
                height: window.innerWidth < 768 ? '350px' : '550px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '2.5rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                  <RecenterMap center={mapCenter} route={route} />
                  {userLocation && (
                    <>
                      <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>📍 Your Current Location</Popup>
                      </Marker>
                      <Circle center={[userLocation.lat, userLocation.lng]} radius={1000} color="var(--primary)" fillOpacity={0.1} />
                    </>
                  )}
                  {hospitals.map(h => {
                    const [lng, lat] = h.location?.coordinates || [77.2090, 28.6139];
                    return (
                      <Marker key={h._id} position={[lat, lng]}>
                        <Popup>
                          <strong>{h.name}</strong><br />
                          <small>{h.address}</small><br />
                          {h.emergencyAvailable && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>🚨 Emergency Available</span>}<br />
                          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => fetchRoute(h)} className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>📍 Draw Route</button>
                            <a href={`https://www.openstreetmap.org/directions?to=${lat},${lng}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>External App</a>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                  {route && <Polyline positions={route} color="#2563eb" weight={5} opacity={0.7} />}
                </MapContainer>
                {route && (
                  <button onClick={() => setRoute(null)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, background: '#fff', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    ❌ Clear Waypoint
                  </button>
                )}
                {selectedHospital && route && (
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, background: 'rgba(255,255,255,0.95)', padding: '1rem', borderRadius: '12px', borderLeft: '5px solid #2563eb', maxWidth: '250px', boxShadow: 'var(--shadow-lg)' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Navigating to:</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{selectedHospital.name}</p>
                  </div>
                )}
              </div>
            )}

            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
              Showing {hospitals.length} certified medical facilities
            </p>

            <div className="grid grid-2">
              {hospitals.map((h, i) => (
                <div key={h._id} className={`animate-slide-up stagger-${(i % 5) + 1}`}>
                  <HospitalCard hospital={h} userLocation={userLocation} onNavigate={() => fetchRoute(h)} />
                </div>
              ))}
            </div>

            {hospitals.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-main)', border: '2px dashed var(--border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                <h3>No medical facilities found</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Expand your search radius or try a different specialty.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalsPage;
