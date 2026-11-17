import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ContactModal from './components/ContactModal';
import ScrollProgress from './components/ScrollProgress';
import WhatsAppButton from './components/WhatsAppButton';
import CookieConsent from './components/CookieConsent';
import axios from 'axios';
import './index.css';

// Lazy-loaded route chunks for faster initial page load
const Services           = lazy(() => import('./pages/Services'));
const Industries         = lazy(() => import('./pages/Industries'));
const FrontEnd           = lazy(() => import('./pages/FrontEnd'));
const BackEnd            = lazy(() => import('./pages/BackEnd'));
const TrustCenter        = lazy(() => import('./pages/TrustCenter'));
const Contact            = lazy(() => import('./pages/Contact'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const AffiliatePortal    = lazy(() => import('./pages/AffiliatePortal'));
const PrivacyPolicy      = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService     = lazy(() => import('./pages/TermsOfService'));
const Blog               = lazy(() => import('./pages/Blog'));
const BlogPost           = lazy(() => import('./pages/BlogPost'));
const NotFound           = lazy(() => import('./pages/NotFound'));

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';

function logPageView(path, referrer) {
  try {
    axios.post(`${API_URL}/analytics/log/`, { path, referrer }).catch(() => {});
  } catch (_) {}
}

function PageviewTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    logPageView(pathname, document.referrer);
  }, [pathname]);

  return null;
}

function ReferralTracker() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  useEffect(() => {
    if (refCode) {
      localStorage.setItem('securestack_ref', refCode);
      const logClick = async () => {
        try {
          await axios.post(`${API_URL}/affiliate/click/`, {
            code: refCode,
            path: window.location.pathname
          });
          console.log('Referral click logged successfully.');
        } catch (err) {
          console.error('Failed to log referral click:', err);
        }
      };
      logClick();
    }
  }, [refCode]);

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
      <ReferralTracker />
      <Navbar />
      <ContactModal />
      <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/front-end-development" element={<FrontEnd />} />
          <Route path="/back-end-development-services" element={<BackEnd />} />
          <Route path="/security-compliance" element={<TrustCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/affiliate" element={<AffiliatePortal />} />
          <Route path="/admin/dashboard" element={<AnalyticsDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppButton phone="263775634182" message="Hi SecureStack! I would like to inquire about your cybersecurity and software development services." />
      <CookieConsent />
    </BrowserRouter>
  );
}

