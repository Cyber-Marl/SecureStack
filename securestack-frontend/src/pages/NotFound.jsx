import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="nf-root">
      <SEO 
        title="404 Page Not Found" 
        description="The secure page you requested is unavailable or has been moved. Return to safety or run a vulnerability check."
        keywords="404 page not found, secure stack 404, page missing"
        path="/404"
      />
      <div className="nf-bg-grid" />
      
      <div className="nf-container">
        <div className="nf-card">
          {/* Diagnostic Console Alert Tag */}
          <div className="nf-terminal-alert">
            <span className="nf-terminal-dot"></span>
            <span>VULNERABILITY: ROUTE_NOT_RESOLVED (HTTP_404)</span>
          </div>

          {/* Large glowing cyber lock icon */}
          <div className="nf-icon-wrapper">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <line x1="12" y1="15" x2="12" y2="17" />
            </svg>
          </div>

          <h1 className="nf-code">404</h1>
          <h2 className="nf-title">Requested Resource Unavailable</h2>
          <p className="nf-desc">
            The page you are looking for has either been relocated, restricted for authorized consoles only, or does not exist on this domain.
          </p>

          <div className="nf-actions">
            <Link to="/" className="btn btn-primary nf-btn-home">
              ← Return to Safety
            </Link>
            
            <div className="nf-links">
              <Link to="/security-compliance" className="nf-link-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                Domain Scanner
              </Link>
              <span style={{ color: 'var(--text-3)' }}>|</span>
              <Link to="/contact" className="nf-link-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
