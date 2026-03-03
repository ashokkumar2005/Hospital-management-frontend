import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHospital, getDoctors, SERVER_URL } from '../services/api';
import DoctorCard from '../components/common/DoctorCard';
import Loader from '../components/common/Loader';
import { MapPin, Phone, Globe, Clock, ShieldCheck, UserRound } from 'lucide-react';

const HospitalDetailPage = () => {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hResp, dResp] = await Promise.all([
                    getHospital(id),
                    getDoctors({ hospitalId: id })
                ]);
                setHospital(hResp.data.hospital);
                setDoctors(dResp.data.doctors || []);
            } catch (err) {
                console.error('Error fetching hospital details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <Loader />;
    if (!hospital) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Hospital not found.</div>;

    return (
        <div className="animate-fade">
            {/* Hospital Header */}
            <div className="page-header" style={{ paddingBottom: '4rem' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: '#fff',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            boxShadow: 'var(--shadow-lg)',
                            flexShrink: 0
                        }}>
                            🏥
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{hospital.name}</h1>
                                {hospital.emergencyAvailable && (
                                    <span className="badge badge-danger" style={{ padding: '0.5rem 1rem' }}>24/7 EMERGENCY</span>
                                )}
                            </div>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9, fontSize: '1.1rem', marginBottom: '1rem' }}>
                                <MapPin size={20} /> {hospital.address}
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                {hospital.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                        <Phone size={18} /> {hospital.phone}
                                    </div>
                                )}
                                {hospital.openHours && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                        <Clock size={18} /> {hospital.openHours}
                                    </div>
                                )}
                                {hospital.website && (
                                    <a href={hospital.website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#fff', textDecoration: 'underline' }}>
                                        <Globe size={18} /> Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-2rem', paddingBottom: '5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

                    {/* Doctors List */}
                    <div>
                        <div className="card" style={{ marginBottom: '2rem', border: 'none', background: 'transparent', padding: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                                <UserRound size={28} color="var(--primary)" />
                                <h2 style={{ margin: 0 }}>Available Specialists ({doctors.length})</h2>
                            </div>

                            {doctors.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No doctors currently listed for this hospital.</p>
                                </div>
                            ) : (
                                <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                                    {doctors.map((doctor, i) => (
                                        <div key={doctor._id} className={`animate-slide-up stagger-${(i % 5) + 1}`}>
                                            <DoctorCard doctor={doctor} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="flex-column gap-2">
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Services</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {hospital.services?.map(s => (
                                    <span key={s} className="badge" style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Specializations</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {hospital.specializations?.map(s => (
                                    <span key={s} className="badge" style={{ background: 'rgba(45, 106, 45, 0.1)', color: 'var(--primary)', border: 'none' }}>{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ background: 'var(--primary-gradient)', color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <ShieldCheck size={24} />
                                <h3 style={{ margin: 0 }}>Quality Care</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.9 }}>
                                This facility is part of the SmartDoctor certified network, ensuring standard medical practices and verified specialists.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HospitalDetailPage;
