import { useEffect, useRef, useState } from 'react';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true); // default dark

  useEffect(() => {
    const saved = localStorage.getItem('ss-theme');
    if (saved === 'light') {
      setDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('ss-theme', next ? 'dark' : 'light');
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
