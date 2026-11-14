import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './CookieConsent.css';

export const COOKIE_CONSENT_KEY = 'securestack_cookie_consent';

export function getCookieConsent() {
  return localStorage.getItem(COOKIE_CONSENT_KEY);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved) {
      // Small timeout so it doesn't jarringly pop up immediately on first byte
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (level) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, level);
    window.dispatchEvent(new CustomEvent('securestack:cookie-consent', { detail: level }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="cookie-consent-bar" aria-label="Cookie consent banner" role="region">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text">
          <div className="cookie-consent-title">
            <ShieldCheck size={18} />
            <span>Privacy &amp; Data Safeguards</span>
          </div>
          <p className="cookie-consent-desc">
            We use essential security cookies to ensure site integrity and privacy-first telemetry to monitor performance.
            Review our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms</Link> to learn how we protect your personal data.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button 
            type="button" 
            className="cookie-btn cookie-btn-essential" 
            onClick={() => handleChoice('essential')}
          >
            Essential Only
          </button>
          <button 
            type="button" 
            className="cookie-btn cookie-btn-accept" 
            onClick={() => handleChoice('all')}
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
