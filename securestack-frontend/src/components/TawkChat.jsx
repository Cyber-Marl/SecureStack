import { useEffect } from 'react';

export default function TawkChat() {
  useEffect(() => {
    // 📢 Tawk.to Property and Widget Configuration
    // Replace these values with your actual IDs from the tawk.to dashboard!
    const PROPERTY_ID = '67e810a9c8d59a72e811fc75'; // Active demo property ID so they can see it work!
    const WIDGET_ID = 'default';

    if (!PROPERTY_ID || PROPERTY_ID === 'YOUR_PROPERTY_ID') {
      console.warn('Tawk.to Chat: Please configure your PROPERTY_ID in TawkChat.jsx');
      return;
    }

    // Initialize Tawk.to Script
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    
    s1.async = true;
    s1.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }

    return () => {
      // Clean up script on component unmount
      s1.remove();
      const tawkEl = document.getElementById('tawkchat-iframe-container');
      if (tawkEl) tawkEl.remove();
    };
  }, []);

  return null;
}
