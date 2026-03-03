import React, { useState, useEffect } from 'react';
import { getBloodRequests, createBloodRequest, getDonorsByGroup } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BloodConnectPage = () => {
    const { user, isAuth } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [matchingDonors, setMatchingDonors] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    const [form, setForm] = useState({
        patientName: '',
        bloodGroup: '',
        unitsNeeded: 1,
        hospitalName: '',
        location: '',
        contactPhone: '',
        notes: ''
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await getBloodRequests();
            setRequests(data.requests);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const findDonors = async (group) => {
        setSelectedGroup(group);
        try {
            const { data } = await getDonorsByGroup(group);
            setMatchingDonors(data.donors);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            await createBloodRequest(form);
            setShowModal(false);
            fetchRequests();
            setForm({
                patientName: '', bloodGroup: '', unitsNeeded: 1,
                hospitalName: '', location: '', contactPhone: '', notes: ''
            });
            alert('Blood Request posted successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to post request.');
        }
    };

    return (
        <div className="animate-fade">
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
                <div className="container">
                    <h1>🩸 Blood Connect</h1>
                    <p>Request blood or find donors near you in an emergency</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '5rem' }}>
                <div className="grid grid-3" style={{ marginBottom: '3rem', alignItems: 'start' }}>

                    {/* Quick Find Card */}
                    <div className="card hover-lift animate-slide-up" style={{ gridColumn: 'span 1' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>🔍 Find Donors</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Quickly check how many registered donors are available for a specific blood group.
                        </p>
                        <div className="form-group">
                            <select className="form-control" onChange={(e) => findDonors(e.target.value)}>
                                <option value="">Select Blood Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        {selectedGroup && (
                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444' }}>{matchingDonors.length}</div>
                                <p style={{ fontWeight: 600 }}>Registered {selectedGroup} Donors</p>
                                {matchingDonors.length > 0 && (
                                    <div style={{ marginTop: '1rem', maxHeight: '150px', overflowY: 'auto', textAlign: 'left' }}>
                                        {matchingDonors.map(d => (
                                            <div key={d._id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontSize: '0.85rem' }}>
                                                <strong>{d.name}</strong> - {d.phone}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Active Requests List */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>🆘 Urgent Blood Requests</h3>
                            {isAuth && (
                                <button className="btn btn-danger" onClick={() => setShowModal(true)}>+ Request Blood</button>
                            )}
                        </div>

                        {loading ? (
                            <p>Loading requests...</p>
                        ) : requests.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No active blood requests found.</p>
                            </div>
                        ) : (
                            <div className="flex-column gap-2">
                                {requests.map(req => (
                                    <div key={req._id} className="card hover-lift" style={{ borderLeft: '5px solid #ef4444' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div>
                                                <span className="badge badge-danger" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{req.bloodGroup} Needed</span>
                                                <h4 style={{ fontSize: '1.25rem' }}>Patient: {req.patientName}</h4>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                                    📍 {req.hospitalName}, {req.location}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{req.unitsNeeded} Units</div>
                                                <p style={{ fontSize: '0.85rem' }}>Required: {new Date(req.requirementDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <hr style={{ margin: '1rem 0', opacity: 0.1 }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '0.9rem' }}>Contact: <strong>{req.contactPhone}</strong></p>
                                                {req.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>"{req.notes}"</p>}
                                            </div>
                                            <a href={`tel:${req.contactPhone}`} className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>📞 CALL NOW</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Request */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2>Post Blood Request</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateRequest}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label>Patient Name</label>
                                    <input className="form-control" required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Blood Group Needed</label>
                                    <select className="form-control" required value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                                        <option value="">Select</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Units Needed</label>
                                    <input type="number" className="form-control" min="1" required value={form.unitsNeeded} onChange={e => setForm({ ...form, unitsNeeded: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input className="form-control" required value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Hospital Name</label>
                                <input className="form-control" required value={form.hospitalName} onChange={e => setForm({ ...form, hospitalName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Hospital Location (Area/City)</label>
                                <input className="form-control" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Additional Notes</label>
                                <textarea className="form-control" rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any specific instructions..." />
                            </div>
                            <button type="submit" className="btn btn-danger btn-block" style={{ padding: '1rem' }}>🚀 Post Emergency Request</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BloodConnectPage;
