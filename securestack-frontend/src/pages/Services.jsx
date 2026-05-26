import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import './Services.css';

const tabs = [
  {
    id: 'ai-data',
    label: 'AI & Data',
    title: 'AI & Data Services',
    services: [
      { name: 'Artificial Intelligence', desc: 'Deploy smart systems, deep cognitive modelling, and machine learning pipelines for automated business tasks.' },
      { name: 'AI Consulting Services', desc: 'Expert strategy, technical analysis, and roadmapping to integrate AI into your products safely.' },
      { name: 'AI tools for business transformation', desc: 'Automate high-friction enterprise processes and boost efficiency using generative AI tools.' },
      { name: 'Data Science', desc: 'Deep analytics, custom predictive modelling, and database insights for strategic data-driven growth.' },
      { name: 'Database creation and management', desc: 'Secure, optimized PostgreSQL, MySQL, and NoSQL setups with zero latency and high availability.' },
      { name: 'Hire AI engineers', desc: 'Scale your engineering force with seasoned, elite AI & ML specialists ready to build.' },
      { name: 'AI powered Robotics integration', desc: 'Bridge software intelligence with physical devices and automated industrial hardware for smart automation.' },
    ],
  },
  {
    id: 'app-dev',
    label: 'Application Development',
    title: 'Application Development',
    services: [
      { name: 'Mobile Development', desc: 'High-performance native Swift (iOS) and Kotlin (Android) applications built to scale.' },
      { name: 'Web Development', desc: 'Premium, fast web apps built on React, Next.js, and modern single-page architectures.' },
      { name: 'Cross-platform development', desc: 'Cost-efficient cross-platform products using React Native and Flutter with unified codebase.' },
      { name: 'PWA development', desc: 'Installable, fast progressive web applications with offline capabilities and push alerts.' },
      { name: 'CMS-based web development', desc: 'Highly optimized Headless CMS platforms for seamless, secure content management.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    title: 'Cloud Services',
    services: [
      { name: 'Cloud Development', desc: 'Cloud-native architecture design with microservices and resilient serverless infrastructure.' },
      { name: 'Cloud Migration', desc: 'Safe, zero-downtime workload migrations from local servers to AWS, Azure, or private clouds.' },
      { name: 'AWS', desc: 'Full-spectrum Amazon Web Services design, scaling, serverless deployment, and active monitoring.' },
      { name: 'Oracle Managed Services', desc: 'Elite database tuning, management, and scaling on Oracle Cloud Infrastructure (OCI).' },
    ],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    title: 'Cybersecurity Management',
    services: [
      { name: 'IT Security Management', desc: 'Comprehensive enterprise-wide threat mitigation, patch management, and resource safeguarding.' },
      { name: 'Penetration Testing', desc: 'Offensive ethical hacking simulations to expose and patch deep logical vulnerabilities.' },
      { name: 'Compliance & Auditing (SOC 2/ISO 27001)', desc: 'Prepare your security posture and workflows to pass international compliance audits.' },
      { name: 'Security Policy Development', desc: 'Establish clear compliance guidelines and access control protocols across your workspace.' },
      { name: 'Incident Response Planning', desc: 'Rigorous action guides to contain and remediate breach attempts immediately in real-time.' },
      { name: 'Cybersecurity Awareness Training', desc: 'Educate your personnel to identify social engineering, phishing, and malware threats.' },
    ],
  },
  {
    id: 'digital-transformation',
    label: 'Digital Transformation',
    title: 'Digital Transformation',
    services: [
      { name: 'Legacy Migration', desc: 'Breathe new life into aging systems by migrating them to modern, fast stack equivalents.' },
      { name: 'Systems Integration', desc: 'Harmonize siloed business software applications into a single, cohesive workflow.' },
      { name: 'Business Process Automation', desc: 'Settle labor-intensive tasks automatically with custom scripts and server workflows.' },
      { name: 'Custom Workflow Engines', desc: 'Bespoke software solutions to track, manage, and optimize business operations.' },
      { name: 'Workflow & Automation Consulting', desc: 'Audit and optimize your standard operating procedures for maximum execution speed.' },
    ],
  },
  {
    id: 'software-engineering',
    label: 'Software Engineering',
    title: 'Software Engineering',
    services: [
      { name: '.NET Development', desc: 'Enterprise-grade backends and desktop solutions engineered with Microsoft\'s robust C# framework.' },
      { name: 'PHP Development', desc: 'Highly functional websites and custom web portals leveraging modern Laravel and Symfony.' },
      { name: 'Python Development', desc: 'Scalable data structures, RESTful and GraphQL APIs, and intelligent data pipelines.' },
      { name: 'Node.js Development', desc: 'High-concurrency event-driven backend systems for real-time data sync and messaging.' },
      { name: 'C++ Development', desc: 'Bare-metal performance for low-level systems, high-frequency apps, and embedded platforms.' },
      { name: 'Front-End Engineering', desc: 'Pixel-perfect, accessible, and responsive user interface components.' },
      { name: 'Back-End Engineering', desc: 'Secure, reliable RESTful APIs, server orchestration, and custom logic layers.' },
    ],
  },
  {
    id: 'enterprise-applications',
    label: 'Enterprise Applications',
    title: 'Enterprise Applications',
    services: [
      { name: 'E-Commerce Solutions (Magento, WooCommerce)', desc: 'Robust digital storefronts capable of handling high transaction volumes with payment gateways.' },
      { name: 'ERP Systems Integration', desc: 'Unify inventory, sales, purchasing, and accounts into a central database platform.' },
      { name: 'Performance-Critical Applications', desc: 'High-frequency systems optimized for sub-millisecond execution and minimal memory usage.' },
      { name: 'Embedded IoT Systems', desc: 'Custom firmware and low-level control systems for connected hardware devices.' },
    ],
  },
];

export default function Services() {
  const [active, setActive] = useState('ai-data');
  const [selectedService, setSelectedService] = useState(null);
  const currentTab = tabs.find(t => t.id === active);

  return (
    <main className="svc-page-root">
      {/* ── Breadcrumb & Title ── */}
      <section className="svc-breadcrumb-section">
        <div className="container">
          <div className="svc-breadcrumbs">
            <Link to="/">Home</Link>
            <span className="svc-breadcrumb-sep">&gt;</span>
            <span className="svc-breadcrumb-active">Services</span>
          </div>
          <h1 className="svc-main-title">Services we provide</h1>
        </div>
      </section>

      {/* ── Main Tabbed Section ── */}
      <section className="svc-tab-section">
        <div className="container">
          <div className="svc-layout-grid">
            {/* Left panel: Vertical Tabs */}
            <div className="svc-tabs-sidebar">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`svc-sidebar-tab-btn${active === t.id ? ' active' : ''}`}
                  onClick={() => setActive(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Vertical dividing line */}
            <div className="svc-layout-divider" />

            {/* Right panel: Sub-services Grid */}
            <div className="svc-cards-grid">
              {currentTab.services.map(s => (
                <div 
                  key={s.name} 
                  className="svc-card-clickable"
                  onClick={() => setSelectedService(s)}
                >
                  <span className="svc-card-text">{s.name}</span>
                  <span className="svc-card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Detail Modal Pop-up ── */}
      {selectedService && (
        <div className="svc-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="svc-modal-card card" onClick={e => e.stopPropagation()}>
            <button className="svc-modal-close" onClick={() => setSelectedService(null)}>×</button>
            <div className="svc-modal-path">
              {currentTab.label} <span className="path-sep">&gt;</span> {selectedService.name}
            </div>
            <h2 className="svc-modal-title">{selectedService.name}</h2>
            <p className="svc-modal-desc">{selectedService.desc}</p>
            
            <div className="svc-modal-highlights">
              <h4>Key Features &amp; Delivery Standards</h4>
              <div className="svc-modal-bullet">
                <span className="bullet-check">✓</span>
                <div>
                  <strong>Security-First Architecture</strong>
                  <p>Engineered with zero-trust principles and robust vulnerability protection layers.</p>
                </div>
              </div>
              <div className="svc-modal-bullet">
                <span className="bullet-check">✓</span>
                <div>
                  <strong>High Scalability &amp; Clean Code</strong>
                  <p>Modular, reusable code written to standard guidelines and optimized for performance.</p>
                </div>
              </div>
              <div className="svc-modal-bullet">
                <span className="bullet-check">✓</span>
                <div>
                  <strong>Enterprise Readiness</strong>
                  <p>Includes full documentation, automated deployments, and continuous system monitoring.</p>
                </div>
              </div>
            </div>

            <div className="svc-modal-actions">
              <a 
                href="#svc-contact" 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedService(null);
                  // Auto fill service field in Contact Form
                  const selectEl = document.querySelector('select[name="service"]');
                  if (selectEl) {
                    selectEl.value = 'General Inquiry'; // standard options
                  }
                  document.getElementById('svc-contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Inquire About This Service →
              </a>
              <button className="btn btn-outline" onClick={() => setSelectedService(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="divider" />

      {/* ── Contact Section ── */}
      <section className="section" id="svc-contact">
        <div className="container">
          <div className="svc-contact-layout">
            <div>
              <p className="section-label">Get Started</p>
              <h2 className="section-title">Ready to Begin?</h2>
              <p className="section-subtitle">Tell us about your project and we'll put together a tailored solution for you.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
