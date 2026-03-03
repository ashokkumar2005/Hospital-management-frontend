import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SERVER_URL } from '../../services/api';
import {
  Home,
  Hospital,
  UserRound,
  Tent,
  Video,
  Stethoscope,
  Info,
  LayoutDashboard,
  AlertCircle,
  Sun,
  Moon,
  LogOut,
  User,
  Droplet,
  Users,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuth, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { setMenuOpen(false); logout(); navigate('/login'); };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'doctor') return '/doctor/dashboard';
    if (user?.role === 'hospital') return '/hospital/dashboard';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Hospitals', path: '/hospitals', icon: Hospital },
    { label: 'Camps', path: '/medical-camps', icon: Tent },
    { label: 'Videos', path: '/videos', icon: Video },
    { label: 'Symptoms', path: '/symptom-checker', icon: Stethoscope },
    { label: 'Blood', path: '/blood-connect', icon: Droplet },
    { label: 'Family', path: '/family', icon: Users },
    { label: 'About', path: '/about', icon: Info }
  ];

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0.8rem 0',
      transition: 'var(--transition)',
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="flex align-center gap-1" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', flexShrink: 0 }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.4rem', borderRadius: '10px', color: 'white' }}>
            <Hospital size={22} />
          </div>
          <span>Smart<span style={{ color: 'var(--text-main)' }}>Doctor</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-only flex gap-1 align-center flex-wrap" style={{ flex: 1, justifyContent: 'center', padding: '0 1rem' }}>
          {navLinks.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} className="flex align-center gap-1" style={{
              fontSize: '0.85rem',
              fontWeight: location.pathname === path ? 700 : 500,
              color: location.pathname === path ? 'var(--primary)' : 'var(--text-muted)',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              transition: 'var(--transition)'
            }}
              onMouseOver={e => { if (location.pathname !== path) e.target.style.color = 'var(--primary)'; }}
              onMouseOut={e => { if (location.pathname !== path) e.target.style.color = 'var(--text-muted)'; }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex align-center gap-1" style={{ flexShrink: 0 }}>
          <button onClick={toggle} className="btn" style={{
            background: 'transparent',
            padding: '0.5rem',
            border: 'none',
            borderRadius: '10px',
            color: 'var(--text-main)',
            minWidth: 'auto',
            width: 'auto'
          }}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Controls */}
          <div className="desktop-only">
            {isAuth ? (
              <div className="flex align-center gap-1">
                <Link to={getDashboardLink()} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <LayoutDashboard size={18} /> <span>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                  <LogOut size={16} /> <span>Logout</span>
                </button>
                <Link to="/profile" className="animate-scale" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {user?.avatar ? (
                    <img src={`${SERVER_URL}${user.avatar}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={18} />
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex gap-1">
                <Link to="/login" className="btn btn-outline" style={{ borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Register</Link>
              </div>
            )}
          </div>

          {/* Toggle for Mobile Menu */}
          <button className="mobile-only btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'var(--bg-main)',
            padding: '0.5rem',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--primary)',
            minWidth: 'auto',
            width: 'auto'
          }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-menu ${menuOpen ? 'open' : ''}`}>
        <div className="flex-column gap-1">
          {navLinks.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} className="nav-link-mobile" onClick={() => setMenuOpen(false)} style={{
              color: location.pathname === path ? 'var(--primary)' : 'var(--text-main)',
              background: location.pathname === path ? 'rgba(45, 106, 45, 0.08)' : 'var(--bg-main)'
            }}>
              <Icon size={20} color={location.pathname === path ? 'var(--primary)' : 'var(--text-muted)'} />
              {label}
            </Link>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
          {isAuth ? (
            <div className="flex-column gap-1">
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="nav-link-mobile">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="nav-link-mobile">
                <User size={20} /> My Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', marginTop: '0.5rem' }}>
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: '0.8rem' }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
