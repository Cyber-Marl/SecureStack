import { Link } from 'react-router-dom';
import './Footer.css';

const services = [
  { label: 'IT Security Management', to: '/services' },
  { label: '.NET Development', to: '/services' },
  { label: 'PHP Development', to: '/services' },
  { label: 'Python Development', to: '/services' },
  { label: 'Node.js Development', to: '/services' },
];

const company = [
  { label: 'About Us', to: '/#about' },
  { label: 'Industries', to: '/industries' },
  { label: 'Services', to: '/services' },
  { label: 'Blog & Resources', to: '/blog' },
  { label: 'Front-End Dev', to: '/front-end-development' },
  { label: 'Back-End Dev', to: '/back-end-development-services' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="divider" />
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>$</span>ecure <span>$</span>tack
          </Link>
          <p>Empowering your business through secure development, cybersecurity, and cloud solutions across Africa and beyond.</p>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {services.map(s => <li key={s.label}><Link to={s.to}>{s.label}</Link></li>)}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {company.map(c => <li key={c.label}><Link to={c.to}>{c.label}</Link></li>)}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +263 77 563 4182
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@securestack.co.zw
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Harare, Zimbabwe
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Secure Stack Enterprise Solutions. All rights reserved.</p>
          <p>Built with React + Django</p>
        </div>
      </div>
    </footer>
  );
}
