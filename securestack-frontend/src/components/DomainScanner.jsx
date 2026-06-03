import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { triggerContactModal } from './ContactModal';
import './DomainScanner.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function DomainScanner() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [scanError, setScanError] = useState('');
  const logEndRef = useRef(null);

  const logSteps = [
    "[INFO] Initializing handshake connection to DNS records...",
    "[INFO] Resolving A/AAAA address records...",
    "[INFO] Querying MX mail server exchange hosts...",
    "[INFO] Inspecting TXT domain authorization parameters...",
    "[INFO] Fetching SPF mail validation configurations...",
    "[INFO] Fetching DMARC spoof prevention filters...",
    "[INFO] Contacting host domain on HTTPS port 443...",
    "[INFO] Starting TLS certificate cipher verification...",
    "[INFO] Checking SSL certificate authority trust chain...",
    "[INFO] Establishing secure sockets to evaluate HTTP headers...",
    "[INFO] Analyzing Strict-Transport-Security (HSTS) settings...",
    "[INFO] Validating Content-Security-Policy (CSP) syntax...",
    "[INFO] Inspecting X-Frame-Options clickjacking barriers...",
    "[SUCCESS] Security grading calculations complete."
  ];

  // Auto-scroll logs terminal
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setResults(null);
    setScanError('');
    setLogs([]);
    setProgress(0);

    let cleanDomain = domain.trim().toLowerCase();
    if (cleanDomain.includes("://")) {
      cleanDomain = cleanDomain.split("://")[1];
    }
    if (cleanDomain.includes("/")) {
      cleanDomain = cleanDomain.split("/")[0];
    }
    if (cleanDomain.includes(":")) {
      cleanDomain = cleanDomain.split(":")[0];
    }

    // Step 1: Trigger local simulated logs dynamically in timeouts
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logSteps.length) {
        setLogs(prev => [...prev, logSteps[logIndex]]);
        setProgress(Math.round(((logIndex + 1) / logSteps.length) * 100));
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    // Step 2: Query the real local backend scan API
    try {
      const response = await axios.get(`${API_URL}/scanner/scan/?domain=${cleanDomain}`);
      
      // Wait for simulated logs animation to catch up or complete
      setTimeout(() => {
        setResults(response.data);
        setLoading(false);
      }, 4200); // Give 4.2s for simulated scanning log visualization
      
    } catch (err) {
      clearInterval(logInterval);
      setLoading(false);
      setScanError(err.response?.data?.error || 'Domain scan failed. Please ensure the backend is running and the domain is valid.');
    }
  };

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      case 'D': return 'grade-d';
      default: return 'grade-f';
    }
  };

  return (
    <section className="domain-scanner-root card">
      <div className="scanner-inner">
        <div className="scanner-header text-center">
          <div className="scanner-badge-glow">🛡️ AUDIT PORTAL</div>
          <h2>B2B Enterprise Domain Security Scanner</h2>
          <p className="scanner-subtitle">
            Perform an instant, safe public audit of your infrastructure's DNS security, SSL certificate, and transport headers.
          </p>
        </div>

        {/* Input Form */}
        {!loading && !results && (
          <form onSubmit={handleScanSubmit} className="scanner-form">
            <div className="scanner-input-wrapper">
              <input
                type="text"
                placeholder="Enter corporate domain (e.g. company.com)..."
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
              <span className="scanner-focus-border"></span>
              <button type="submit" className="btn btn-primary scanner-submit-btn">
                Run Free Audit
              </button>
            </div>
            {scanError && <p className="scanner-error-text">{scanError}</p>}
          </form>
        )}

        {/* Loading / Terminal Log State */}
        {loading && (
          <div className="scanner-loading-container">
            <div className="scanner-loading-visuals">
              <div className="pulsing-radar-circle">
                <div className="radar-ping"></div>
                <div className="radar-label">{progress}%</div>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Terminal Box */}
            <div className="scanner-terminal">
              <div className="terminal-bar">
                <span className="t-dot t-red"></span>
                <span className="t-dot t-yellow"></span>
                <span className="t-dot t-green"></span>
                <span className="t-title">securestack-audit-engine --stream</span>
              </div>
              <div className="terminal-body">
                {logs.map((log, index) => (
                  <div key={index} className="terminal-line">
                    <span className="t-prompt">$</span> {log}
                  </div>
                ))}
                <div ref={logEndRef}></div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Results Report Card */}
        {results && (
          <div className="scanner-results-card">
            <div className="results-hero-grid">
              <div className="results-grade-box text-center">
                <div className={`grade-badge ${getGradeClass(results.grade)}`}>
                  {results.grade}
                </div>
                <h3>Domain Rating</h3>
                <p>Overall Security Score: <strong>{results.score}/100</strong></p>
              </div>

              <div className="results-advisory-box">
                <h4>Audit Summary for <span className="highlight-domain">{results.domain}</span></h4>
                <p className="scan-timestamp">Scan Executed: {results.timestamp}</p>
                
                {results.reasons.length === 0 ? (
                  <div className="perfect-score-alert">
                    🎉 Excellent! No security advisories identified. Your public domain security configuration matches enterprise grade compliance standards.
                  </div>
                ) : (
                  <div className="advisory-warnings">
                    <h5>⚠️ Advisory Warnings ({results.reasons.length}):</h5>
                    <ul className="advisory-list">
                      {results.reasons.map((reason, idx) => (
                        <li key={idx} className="advisory-item">
                          <span>•</span> {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Structured Checks Grid */}
            <div className="results-checks-grid">
              {/* DNS Security Checks */}
              <div className="check-category card">
                <h4>DNS Security Records</h4>
                <div className="check-item">
                  <span className={`check-icon ${results.dns.mx_status ? 'pass' : 'fail'}`}>
                    {results.dns.mx_status ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>MX Mail Exchange:</strong>
                    <p className="check-detail">{results.dns.mx_status ? 'Configured' : 'Not Configured'}</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className={`check-icon ${results.dns.spf_record !== 'Not configured' ? 'pass' : 'fail'}`}>
                    {results.dns.spf_record !== 'Not configured' ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>SPF (Sender Policy Framework):</strong>
                    <p className="check-detail monospace-detail">{results.dns.spf_record}</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className={`check-icon ${results.dns.dmarc_record !== 'Not configured' ? 'pass' : 'fail'}`}>
                    {results.dns.dmarc_record !== 'Not configured' ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>DMARC Spoof Defense:</strong>
                    <p className="check-detail monospace-detail">{results.dns.dmarc_record}</p>
                  </div>
                </div>
              </div>

              {/* SSL/TLS Security Checks */}
              <div className="check-category card">
                <h4>SSL / Transport Channel</h4>
                <div className="check-item">
                  <span className={`check-icon ${results.ssl.valid ? 'pass' : 'fail'}`}>
                    {results.ssl.valid ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>SSL handshake:</strong>
                    <p className="check-detail">{results.ssl.valid ? 'Active and Trusted' : 'Unencrypted'}</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className={`check-icon ${results.ssl.days_remaining > 15 ? 'pass' : 'fail'}`}>
                    {results.ssl.days_remaining > 15 ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>Certificate Expiry:</strong>
                    <p className="check-detail">{results.ssl.valid ? `Expires in ${results.ssl.days_remaining} days` : 'N/A'}</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className="check-icon pass">✓</span>
                  <div>
                    <strong>Issuer Authority:</strong>
                    <p className="check-detail">{results.ssl.issuer}</p>
                  </div>
                </div>
              </div>

              {/* HTTP Transport Headers Checks */}
              <div className="check-category card">
                <h4>HTTP Security Headers</h4>
                <div className="check-item">
                  <span className={`check-icon ${results.headers.hsts ? 'pass' : 'fail'}`}>
                    {results.headers.hsts ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>HSTS (Transport Security):</strong>
                    <p className="check-detail">{results.headers.hsts ? 'Enforced' : 'Missing Header'}</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className={`check-icon ${results.headers.x_frame ? 'pass' : 'fail'}`}>
                    {results.headers.x_frame ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>X-Frame (Clickjacking defense):</strong>
                    <p className="check-detail">{results.headers.x_frame ? 'Enforced' : 'Missing Header'}</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className={`check-icon ${results.headers.csp ? 'pass' : 'fail'}`}>
                    {results.headers.csp ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>Content-Security-Policy (CSP):</strong>
                    <p className="check-detail">{results.headers.csp ? 'Enforced' : 'Missing Header'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results CTA Action Block */}
            <div className="results-cta-block text-center">
              <h4>Want to resolve outstanding security findings?</h4>
              <p>SecureStack's lead security engineers are ready to fortify your digital assets and align your domain configuration with enterprise standards.</p>
              <div className="results-cta-buttons">
                <button className="btn btn-primary cta-remediate-btn" onClick={triggerContactModal}>
                  Request Remediations & Fix
                </button>
                <button className="btn btn-outline cta-reset-btn" onClick={() => { setResults(null); setDomain(''); }}>
                  Scan Another Domain
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
