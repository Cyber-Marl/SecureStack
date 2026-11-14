import './BrandLogo.css';

export default function BrandLogo({ size = 'md', showTagline = true }) {
  return (
    <span className={`brand-logo brand-logo--${size}`}>
      <span className="brand-logo__mark" aria-hidden="true">
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="brand-logo__svg"
        >
          <defs>
            <linearGradient id="ss-shield-grad" x1="4" y1="2" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fe914c" />
              <stop offset="100%" stopColor="#e85d04" />
            </linearGradient>
            <linearGradient id="ss-layer-blue" x1="12" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e6fff" />
            </linearGradient>
          </defs>

          {/* Outer hexagonal cyber-shield */}
          <path
            d="M22 3L38 9.5V21.5C38 31.4 31.1 38.8 22 41.5C12.9 38.8 6 31.4 6 21.5V9.5L22 3Z"
            fill="rgba(254, 145, 76, 0.08)"
            stroke="url(#ss-shield-grad)"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Top stack layer (Orange) */}
          <path
            d="M22 11.5L31.5 16.2L22 20.9L12.5 16.2L22 11.5Z"
            fill="url(#ss-shield-grad)"
          />

          {/* Middle stack layer (Electric Blue) */}
          <path
            d="M12.5 21.6L22 26.3L31.5 21.6"
            stroke="url(#ss-layer-blue)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom stack layer (Orange) */}
          <path
            d="M14.5 27L22 30.8L29.5 27"
            stroke="url(#ss-shield-grad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="brand-logo__text">
        <span className="brand-logo__wordmark">
          <span className="brand-logo__secure">Secure</span>
          <span className="brand-logo__stack">Stack</span>
        </span>
        {showTagline && (
          <span className="brand-logo__tagline">Enterprise Solutions</span>
        )}
      </span>
    </span>
  );
}

