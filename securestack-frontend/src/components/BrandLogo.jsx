import './BrandLogo.css';

export default function BrandLogo({ size = 'md', showTagline = true }) {
  return (
    <span className={`brand-logo brand-logo--${size}`}>
      <span className="brand-logo__mark" aria-hidden="true">
        <svg
          viewBox="0 0 120 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="brand-logo__svg"
        >
          <defs>
            <linearGradient id="ss-orange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9f5a" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="ss-blue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1e6fff" />
            </linearGradient>
            <linearGradient id="ss-silver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Left Curly Brace */}
          <path
            d="M21 34C15.5 34 13 36.8 13 42.5V52.5C13 57.2 10.2 59.8 5.5 60.5C10.2 61.2 13 63.8 13 68.5V78.5C13 84.2 15.5 87 21 87"
            className="brand-logo__brace-left"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Curly Brace */}
          <path
            d="M99 34C104.5 34 107 36.8 107 42.5V52.5C107 57.2 109.8 59.8 114.5 60.5C109.8 61.2 107 63.8 107 68.5V78.5C107 84.2 104.5 87 99 87"
            stroke="url(#ss-orange)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Shield Dark Interior Base */}
          <path
            d="M60 18L92 33V62C92 81.5 78.2 95.8 60 104C41.8 95.8 28 81.5 28 62V33L60 18Z"
            fill="#0b101b"
          />

          {/* Outer Shield Left Half (Orange) */}
          <path
            d="M60 18L28 33V62C28 81.5 41.8 95.8 60 104"
            stroke="url(#ss-orange)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M60 24L33.5 36.5V61.5C33.5 78 45.2 90.2 60 97.5"
            stroke="url(#ss-orange)"
            strokeWidth="2"
            strokeOpacity="0.8"
            strokeLinejoin="round"
          />

          {/* Outer Shield Right Half (Electric Blue) */}
          <path
            d="M60 18L92 33V62C92 81.5 78.2 95.8 60 104"
            stroke="url(#ss-blue)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M60 24L86.5 36.5V61.5C86.5 78 74.8 90.2 60 97.5"
            stroke="url(#ss-blue)"
            strokeWidth="2"
            strokeOpacity="0.8"
            strokeLinejoin="round"
          />

          {/* Developer Character & Laptop Crest at Top of Shield */}
          <path
            d="M41 37C41 29.5 47.5 25.5 60 25.5C72.5 25.5 79 29.5 79 37"
            fill="#0f172a"
            stroke="url(#ss-orange)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="15.5"
            r="8.2"
            fill="#f4a261"
            stroke="#0b101b"
            strokeWidth="1.8"
          />
          <path
            d="M51.5 14.5C51.5 9 55.2 6 60.5 6C65.2 6 68.5 8.8 68.5 14C66.5 11.8 63.5 11 59.5 11C55.8 11 53.2 12.2 51.5 14.5Z"
            fill="#1e293b"
          />
          <path
            d="M52.5 10.5C55 7.5 61 7 66.5 9.5"
            stroke="#fe914c"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect x="53.5" y="13.5" width="5.5" height="3.8" rx="1" fill="#0b101b" stroke="#ffffff" strokeWidth="1.2" />
          <rect x="61" y="13.5" width="5.5" height="3.8" rx="1" fill="#0b101b" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="59" y1="15.2" x2="61" y2="15.2" stroke="#ffffff" strokeWidth="1.2" />

          {/* Laptop Screen in Front of Developer */}
          <path
            d="M47 26.5H73L71 38.5H49L47 26.5Z"
            fill="#cbd5e1"
            stroke="#0b101b"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M56.5 30.5L54 32.5L56.5 34.5" stroke="#0f172a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M63.5 30.5L66 32.5L63.5 34.5" stroke="#0f172a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="61" y1="29.8" x2="59" y2="35.2" stroke="#ea580c" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="43" y1="39" x2="77" y2="39" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

          {/* Left S inside Shield (Crisp Silver/White) */}
          <path
            d="M58 43L40 49.5V62.5L52.5 68.5V76.5L44.5 72.5V68L39.5 66V76.5L58 88V64L45.5 58V52.5L53 49.5V54.5L58 56.5V43Z"
            fill="url(#ss-silver)"
          />

          {/* Right S inside Shield (Vibrant Orange) */}
          <path
            d="M62 43V62.5L74.5 68.5V76.5L66.5 72.5V68L62 66V88L80.5 76.5V64L68 58V52.5L75.5 55.5V59.5L80.5 61.5V49.5L62 43Z"
            fill="url(#ss-orange)"
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
