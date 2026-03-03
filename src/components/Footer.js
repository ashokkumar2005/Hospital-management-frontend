// ════════════════════════════════════════
//  FOOTER COMPONENT
// ════════════════════════════════════════
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export const Footer = () => (
  <>
    <style>{`
      .footer { background: var(--bg-card); border-top: 1px solid var(--border); padding: 48px 24px 24px; margin-top: auto; }
      .footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
      .footer-brand { display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: 800; color: var(--primary); margin-bottom: 14px; }
      .footer-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; margin-bottom: 20px; }
      .footer-socials { display: flex; gap: 10px; }
      .social-btn { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 1rem; transition: all 0.2s; text-decoration: none; }
      .social-btn:hover { background: var(--primary); color: white; }
      .footer-heading { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
      .footer-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
      .footer-links li a { color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
      .footer-links li a:hover { color: var(--primary); }
      .footer-contact { display: flex; flex-direction: column; gap: 10px; }
      .contact-item { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 0.9rem; }
      .footer-bottom { max-width: 1200px; margin: 30px auto 0; padding-top: 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
      .footer-bottom p { color: var(--text-muted); font-size: 0.85rem; }
      @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
    `}</style>
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand"><FaHospital /> Smart Doctor</div>
          <p className="footer-desc">Your digital health partner — connecting patients with doctors for easy, affordable healthcare access.</p>
          <div className="footer-socials">
            <a href="#" className="social-btn"><FaFacebook /></a>
            <a href="#" className="social-btn"><FaTwitter /></a>
            <a href="#" className="social-btn"><FaLinkedin /></a>
          </div>
        </div>
        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            {[['/', 'Home'], ['/doctors', 'Find Doctors'], ['/hospitals', 'Hospitals'], ['/camps', 'Free Camps'], ['/videos', 'Health Videos']].map(([path, label]) => (
              <li key={path}><Link to={path}>{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            {['Book Appointment', 'Video Consultation', 'Symptom Checker', 'Health Records', 'SOS Emergency'].map(s => <li key={s}><a href="#">{s}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-contact">
            <span className="contact-item"><FaMapMarkerAlt /> 123 Health Ave, Medical City</span>
            <span className="contact-item"><FaPhone /> +91 98765 43210</span>
            <span className="contact-item"><FaEnvelope /> support@smartdoctor.com</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Smart Doctor. All rights reserved.</p>
        <p>Built with ❤️ as a B.E CSE Final Year Project</p>
      </div>
    </footer>
  </>
);

export default Footer;
