import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaBell, FaUserMd, FaSignOutAlt, FaBars, FaTimes, FaHospital } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: darkMode
      ? (scrolled ? 'rgba(15,23,42,0.98)' : 'rgba(15,23,42,0.95)')
      : (scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)'),
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      <style>{`
        .navbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; max-width: 1400px; margin: 0 auto; }
        .navbar-brand { display: flex; align-items: center; gap: 10px; font-size: 1.3rem; font-weight: 800; color: #2D6A2D; text-decoration: none; }
        .navbar-brand span { display: flex; align-items: center; gap: 4px; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link { padding: 8px 14px; border-radius: 8px; font-weight: 500; font-size: 0.92rem; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { background: var(--primary-light); color: var(--primary); }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .theme-btn { background: none; border: 1.5px solid var(--border); border-radius: 8px; padding: 8px; cursor: pointer; color: var(--text-secondary); display: flex; font-size: 1rem; transition: all 0.2s; }
        .theme-btn:hover { border-color: var(--primary); color: var(--primary); }
        .hamburger { display: none; background: none; border: none; font-size: 1.3rem; cursor: pointer; color: var(--text-primary); padding: 4px; }
        .user-menu { position: relative; }
        .user-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--bg-card); transition: all 0.2s; }
        .user-trigger:hover { border-color: var(--primary); }
        .user-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 200px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-lg); overflow: hidden; z-index: 100; }
        .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: background 0.2s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
        .dropdown-item:hover { background: var(--bg-secondary); }
        .dropdown-item.danger { color: var(--danger); }
        .dropdown-divider { border: none; border-top: 1px solid var(--border); margin: 4px 0; }
        .role-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; font-weight: 700; letter-spacing: 0.5px; }
        .role-patient { background: #C1E1C1; color: #000000; }
        .role-doctor { background: #90C790; color: #000000; }
        .role-admin { background: #60AD60; color: #ffffff; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .mobile-menu { position: fixed; top: 70px; left: 0; right: 0; background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; gap: 4px; z-index: 999; box-shadow: var(--shadow-lg); }
          .mobile-menu .nav-link { padding: 12px 16px; display: block; }
        }
      `}</style>

      <div style={navStyle}>
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <FaHospital /> Smart Doctor
          </Link>

          <div className="nav-links">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/doctors" className={isActive('/doctors')}>Doctors</Link>
            <Link to="/hospitals" className={isActive('/hospitals')}>Hospitals</Link>
            <Link to="/hospitals/nearby" className={isActive('/hospitals/nearby')}>Nearby</Link>
            <Link to="/camps" className={isActive('/camps')}>Free Camps</Link>
            <Link to="/videos" className={isActive('/videos')}>Health Videos</Link>
            <Link to="/symptom-checker" className={isActive('/symptom-checker')}>Symptom Check</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
          </div>

          <div className="nav-actions">
            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <>
                <Link to="/sos" style={{ background: '#2D6A2D', color: 'white', padding: '7px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>
                  🚨 SOS
                </Link>
                <Link to="/notifications" style={{ padding: '8px', display: 'flex', color: 'var(--text-secondary)' }}>
                  <FaBell />
                </Link>
                <UserMenu user={user} handleLogout={handleLogout} />
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {['/', '/doctors', '/hospitals', '/hospitals/nearby', '/camps', '/videos', '/symptom-checker', '/about'].map((path, i) => (
            <Link key={i} to={path} className="nav-link" onClick={() => setMenuOpen(false)}>
              {path === '/' ? 'Home' : path.replace('/hospitals/nearby', 'Nearby').replace('/', '').replace(/-/g, ' ').split('/').pop()
                .replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          ))}
          {user ? (
            <button className="nav-link" onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: '600' }}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

const UserMenu = ({ user, handleLogout }) => {
  const [open, setOpen] = useState(false);

  const roleClass = `role-badge role-${user.role}`;

  return (
    <div className="user-menu">
      <div className="user-trigger" onClick={() => setOpen(!open)}>
        <FaUserMd />
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
        <span className={roleClass}>{user.role}</span>
      </div>
      {open && (
        <div className="user-dropdown" onClick={() => setOpen(false)}>
          <Link to="/dashboard" className="dropdown-item">📊 Dashboard</Link>
          <Link to="/profile" className="dropdown-item">👤 Profile</Link>
          {user.role === 'patient' && <Link to="/appointments" className="dropdown-item">📅 Appointments</Link>}
          {user.role === 'patient' && <Link to="/health-records" className="dropdown-item">📋 Health Records</Link>}
          {user.role === 'doctor' && <Link to="/doctor/dashboard" className="dropdown-item">👨‍⚕️ Doctor Panel</Link>}
          {user.role === 'admin' && <Link to="/admin" className="dropdown-item">⚙️ Admin Panel</Link>}
          <hr className="dropdown-divider" />
          <button className="dropdown-item danger" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
