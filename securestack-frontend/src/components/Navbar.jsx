import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import BrandLogo from './BrandLogo';
import { triggerContactModal } from './ContactModal';
import './Navbar.css';

const navLinks = [
  {
    label: 'Services',
    to: '/services',
    children: [
      { label: '🛡️ Cybersecurity & Compliance', to: '/services?tab=cybersecurity' },
      { label: '💻 Web, Mobile & Software', to: '/services?tab=software-engineering' },
      { label: '☁️ Cloud & Infrastructure', to: '/services?tab=cloud' },
      { label: '🤖 AI & Process Automation', to: '/services?tab=ai-data' },
      { divider: true },
      { label: 'Front-End Tech Stack →', to: '/front-end-development' },
      { label: 'Back-End Tech Stack →', to: '/back-end-development-services' },
    ]
  },
  { label: 'Industries', to: '/industries' },
  { label: 'Trust Center', to: '/security-compliance' },
  { label: 'Blog', to: '/blog' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const closeDropdown = () => setDropdown(null);
    window.addEventListener('scroll', onScroll);
    document.addEventListener('click', closeDropdown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  const handleAnchor = (e, to) => {
    e.preventDefault();
    setOpen(false);
    if (to.startsWith('/#')) {
      const id = to.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/#' + id);
      }
    } else {
      navigate(to);
    }
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner container">
        <Link to="/" className="nav-logo" aria-label="SecureStack Home">
          <BrandLogo />
        </Link>

        <ul className={`nav-links${open ? ' open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}
              className={link.children ? 'has-dropdown' : ''}
              onMouseEnter={() => link.children && setDropdown(link.label)}
              onMouseLeave={() => setDropdown(null)}>
              {link.children ? (
                <>
                  <span 
                    className="nav-item dropdown-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdown(dropdown === link.label ? null : link.label);
                    }}
                  >
                    {link.label} <span className="arrow">▾</span>
                  </span>
                  {dropdown === link.label && (
                    <ul className="dropdown">
                      {link.children.map((c, idx) =>
                        c.divider ? (
                          <li key={`div-${idx}`} className="dropdown-divider" aria-hidden="true" />
                        ) : (
                          <li key={c.label}>
                            <Link to={c.to} onClick={() => { setOpen(false); setDropdown(null); }}>
                              {c.label}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </>
              ) : (
                <a className="nav-item" href={link.to} onClick={(e) => handleAnchor(e, link.to)}>
                  {link.label}
                </a>
              )}
            </li>
          ))}
          <li className="nav-mobile-cta">
            <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
              Estimate Project →
            </Link>
          </li>
        </ul>

        <ThemeToggle />

        <Link to="/contact" className="btn btn-primary nav-cta">
          Estimate Project →
        </Link>

        <button className={`hamburger${open ? ' active' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
