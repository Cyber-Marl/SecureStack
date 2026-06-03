import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { triggerContactModal } from './ContactModal';
import './Navbar.css';

const navLinks = [
  { label: 'About Us', to: '/#about' },
  {
    label: 'Tech Stack', to: '#',
    children: [
      { label: 'Front-End Development', to: '/front-end-development' },
      { label: 'Back-End Development', to: '/back-end-development-services' },
    ]
  },
  { label: 'Industries', to: '/industries' },
  { label: 'Services', to: '/services' },
  { label: 'Security & Trust', to: '/security-compliance' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
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
        <Link to="/" className="nav-logo">
          <span className="logo-dollar">$</span>ecure <span className="logo-dollar">$</span>tack
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
                      {link.children.map(c => (
                        <li key={c.label}>
                          <NavLink to={c.to} onClick={() => setOpen(false)}>{c.label}</NavLink>
                        </li>
                      ))}
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
        </ul>

        <ThemeToggle />

        <button className="btn btn-primary nav-cta" onClick={triggerContactModal}>
          Get a Quote
        </button>

        <button className={`hamburger${open ? ' active' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
