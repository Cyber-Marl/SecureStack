import { useEffect } from 'react';
import { COOKIE_CONSENT_KEY } from './CookieConsent';

export default function TawkChat() {
  useEffect(() => {
    // 📢 Tawk.to Property and Widget Configuration
    const PROPERTY_ID = '6200f2aab9e4e21181bdd155';
    const WIDGET_ID = '1jpsa3se2';

    if (!PROPERTY_ID || PROPERTY_ID === 'YOUR_PROPERTY_ID') {
      return;
    }

    // Check cookie consent: only load if user accepted all cookies (or hasn't opted out to essential-only)
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'essential') {
      return;
    }

    let loaded = false;

    const loadTawk = () => {
      if (loaded || document.getElementById('tawk-script')) return;
      loaded = true;

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const s1 = document.createElement("script");
      s1.id = 'tawk-script';
      s1.async = true;
      s1.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');

      const s0 = document.getElementsByTagName("script")[0];
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    };

    // Load if user already consented or if default session
    if (consent === 'all') {
      loadTawk();
    }

    const onConsentChange = (e) => {
      if (e.detail === 'all') {
        loadTawk();
      }
    };

    window.addEventListener('securestack:cookie-consent', onConsentChange);

    return () => {
      window.removeEventListener('securestack:cookie-consent', onConsentChange);
    };
  }, []);

  return null;
}
