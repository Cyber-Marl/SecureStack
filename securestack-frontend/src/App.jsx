import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Industries from './pages/Industries';
import FrontEnd from './pages/FrontEnd';
import BackEnd from './pages/BackEnd';
import TrustCenter from './pages/TrustCenter';
import Contact from './pages/Contact';
import ContactModal from './components/ContactModal';
import ScrollProgress from './components/ScrollProgress';
import WhatsAppButton from './components/WhatsAppButton';
import TawkChat from './components/TawkChat';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import { logPageView } from './utils/analyticsService';
import './index.css';

function PageviewTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    logPageView(pathname, document.referrer);
  }, [pathname]);

  return null;
}

function ScrollToHashAndTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProgress />
      <ScrollToHashAndTop />
      <PageviewTracker />
      <Navbar />
      <ContactModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/front-end-development" element={<FrontEnd />} />
        <Route path="/back-end-development-services" element={<BackEnd />} />
        <Route path="/security-compliance" element={<TrustCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/dashboard" element={<AnalyticsDashboard />} />
      </Routes>
      <Footer />
      <WhatsAppButton phone="263775634182" message="Hi SecureStack! I would like to inquire about your cybersecurity and software development services." />
      <TawkChat />
    </BrowserRouter>
  );
}

