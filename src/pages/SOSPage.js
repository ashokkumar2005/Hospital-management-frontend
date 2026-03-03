import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { triggerSOS, getSOSHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });

const SOSPage = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [history, setHistory] = useState([]);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }), () => { });
    }
    getSOSHistory().then(({ data }) => setHistory(data.alerts || [])).catch(() => { });
  }, []);

  const handleSOS = () => {
    if (!location) { alert('Unable to get your location. Please enable location access.'); return; }
    if (!window.confirm('⚠️ This will send an emergency alert to your contact and show nearby hospitals. Proceed?')) return;

    // 3-second countdown
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          sendSOS();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendSOS = async () => {
    setLoading(true);
    try {
      const { data } = await triggerSOS({ lat: location.lat, lng: location.lng, address: `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` });
      setTriggered(true);
      setNearbyHospitals(data.nearbyHospitals || []);
      setHistory(prev => [data.alert, ...prev]);
    } catch (e) { console.error(e); alert('SOS failed. Please call 108 directly.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade">
      <div className="page-header animate-slide-up" style={{ background: 'linear-gradient(135deg, #408F40, #2D6A2D)' }}>
        <div className="container">
          <h1>🆘 Emergency SOS</h1>
          <p>One-click emergency alert to your contacts and emergency services</p>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {!triggered ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
            <div className="animate-slide-up stagger-1">
              <div className="card hover-lift" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📍 Your Location</h3>
                {location ? (
                  <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                    <MapContainer center={[location.lat, location.lng]} zoom={14} style={{ height: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                      <Marker position={[location.lat, location.lng]}><Popup>📍 You are here</Popup></Marker>
                    </MapContainer>
                  </div>
                ) : <p style={{ color: 'var(--text-muted)' }}>Getting your location...</p>}
              </div>
              <div className="card hover-lift">
                <h3 style={{ marginBottom: '0.5rem' }}>Emergency Contact</h3>
                {user?.emergencyContact?.name ? (
                  <p>📞 {user.emergencyContact.name} – {user.emergencyContact.phone}</p>
                ) : (
                  <div>
                    <p style={{ color: '#f59e0b' }}>⚠️ No emergency contact set.</p>
                    <a href="/profile" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Set one in your profile →</a>
                  </div>
                )}
              </div>
            </div>

            {/* SOS Button */}
            <div className="animate-scale stagger-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
              <button onClick={handleSOS} disabled={loading || countdown !== null}
                className="hover-grow"
                style={{ width: '180px', height: '180px', borderRadius: '50%', background: loading ? '#000000' : 'linear-gradient(135deg, #60AD60, #2D6A2D)', color: '#fff', fontSize: '3.5rem', border: '6px solid #C1E1C1', boxShadow: '0 0 40px rgba(45, 106, 45, 0.5)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', animation: 'pulse 2s infinite' }}>
                {countdown !== null ? countdown : loading ? '...' : '🆘'}
              </button>
              <style>{`@keyframes pulse { 0%,100% { box-shadow: 0 0 40px rgba(45, 106, 45, 0.5); } 50% { box-shadow: 0 0 70px rgba(45, 106, 45, 0.8); } }`}</style>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
                {countdown !== null ? `Sending in ${countdown}...` : 'TAP FOR EMERGENCY'}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>Sends alert + location to your emergency contact</p>
              <div style={{ padding: '1rem', background: '#F4F9F4', borderRadius: '8px', textAlign: 'center', width: '100%' }}>
                <p style={{ color: '#2D6A2D', fontWeight: 700 }}>Emergency: 108</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Police: 100</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', borderLeft: '4px solid #2D6A2D' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#2D6A2D', marginBottom: '1rem' }}>SOS Alert Sent!</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Your emergency contact has been notified with your location.</p>
            {nearbyHospitals.length > 0 && (
              <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '1rem' }}>Nearest Hospitals:</h3>
                {nearbyHospitals.map(h => (
                  <div key={h._id} style={{ padding: '0.8rem', background: '#F4F9F4', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <strong>{h.name}</strong> {h.emergencyAvailable && '🚨'}
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{h.address}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setTriggered(false)} className="btn btn-danger" style={{ marginTop: '1.5rem' }}>Send Another Alert</button>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Alert History</h3>
            {history.map(a => (
              <div key={a._id} style={{ padding: '0.7rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
                <span style={{ color: '#2D6A2D', fontWeight: 600 }}>🆘 SOS Alert</span> – {new Date(a.createdAt).toLocaleString()}
                <span className={`badge badge-${a.status === 'sent' ? 'warning' : 'success'}`} style={{ marginLeft: '0.5rem' }}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSPage;
