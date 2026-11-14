import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Brain, Database, Cpu, Bot, Shield, Lock, Terminal, Server, Smartphone, 
  Cloud, Layers, Code2, ShoppingBag, Globe, Repeat, Settings, Zap,
  ShieldCheck, AlertTriangle, Users
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';
import './Services.css';

const tabs = [
  {
    id: 'cybersecurity',
    label: '🛡️ Cybersecurity & Compliance',
    title: 'Cybersecurity & Compliance',
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
    id: 'software-engineering',
    label: '💻 Web, Mobile & Software',
    title: 'Web, Mobile & Software Development',
    services: [
      { name: 'Web Development', desc: 'Premium, fast web apps built on React, Next.js, and modern single-page architectures.' },
      { name: 'Mobile Development', desc: 'High-performance native Swift (iOS), Kotlin (Android), and cross-platform Flutter/React Native apps.' },
      { name: 'Front-End Engineering', desc: 'Pixel-perfect, accessible, and responsive user interface components and Figma prototyping.', link: '/front-end-development' },
      { name: 'Back-End Engineering', desc: 'Secure, reliable RESTful & GraphQL APIs, server orchestration, and custom logic layers.', link: '/back-end-development-services' },
      { name: '.NET Development', desc: 'Enterprise-grade backends and desktop solutions engineered with Microsoft\'s robust C# framework.' },
      { name: 'Python Development', desc: 'Scalable data structures, RESTful and GraphQL APIs, and intelligent data pipelines.' },
      { name: 'Node.js Development', desc: 'High-concurrency event-driven backend systems for real-time data sync and messaging.' },
      { name: 'PHP Development', desc: 'Highly functional websites and custom web portals leveraging modern Laravel and Symfony.' },
      { name: 'C++ Development', desc: 'Bare-metal performance for low-level systems, high-frequency apps, and embedded platforms.' },
      { name: 'E-Commerce Solutions (Magento, WooCommerce)', desc: 'Robust digital storefronts capable of handling high transaction volumes with payment gateways.' },
      { name: 'ERP & Systems Integration', desc: 'Unify inventory, sales, purchasing, and siloed business software into a single cohesive platform.' },
    ],
  },
  {
    id: 'cloud',
    label: '☁️ Cloud & Infrastructure',
    title: 'Cloud & Infrastructure Services',
    services: [
      { name: 'Cloud Development', desc: 'Cloud-native architecture design with microservices, Kubernetes, and resilient serverless infrastructure.' },
      { name: 'Cloud & Legacy Migration', desc: 'Safe, zero-downtime workload migrations from aging on-premise servers to AWS, Azure, or private clouds.' },
      { name: 'AWS & Azure Engineering', desc: 'Full-spectrum cloud design, auto-scaling, Infrastructure as Code (Terraform), and active monitoring.' },
      { name: 'Database Creation & Management', desc: 'Secure, optimized PostgreSQL, MySQL, Oracle, and NoSQL setups with high availability.' },
    ],
  },
  {
    id: 'ai-data',
    label: '🤖 AI & Process Automation',
    title: 'AI, Data & Process Automation',
    services: [
      { name: 'Artificial Intelligence', desc: 'Deploy smart systems, LLM integrations, and machine learning pipelines for automated business tasks.' },
      { name: 'Business Process Automation', desc: 'Eliminate repetitive manual bottlenecks with custom workflow engines and intelligent scripts.' },
      { name: 'Data Science & Analytics', desc: 'Deep analytics, custom predictive modelling, and executive insights for data-driven growth.' },
      { name: 'AI Consulting Services', desc: 'Expert strategy, technical analysis, and roadmapping to integrate AI into your operations safely.' },
    ],
  },
];

const TAB_ALIASES = {
  'app-dev': 'software-engineering',
  'enterprise-applications': 'software-engineering',
  'digital-transformation': 'ai-data',
};

function resolveTabId(tabParam) {
  if (!tabParam) return 'cybersecurity';
  const mapped = TAB_ALIASES[tabParam] || tabParam;
  return tabs.some(t => t.id === mapped) ? mapped : 'cybersecurity';
}

function getServiceIcon(name, tabId) {
  const n = name.toLowerCase();
  if (n.includes('artificial intelligence') || n.includes('ai consulting') || n.includes('generative ai')) return <Brain size={22} />;
  if (n.includes('database') || n.includes('data science')) return <Database size={22} />;
  if (n.includes('robotics') || n.includes('bot') || n.includes('automation')) return <Bot size={22} />;
  if (n.includes('mobile') || n.includes('cross-platform')) return <Smartphone size={22} />;
  if (n.includes('web') || n.includes('pwa') || n.includes('front-end') || n.includes('cms')) return <Globe size={22} />;
  if (n.includes('cloud') || n.includes('aws') || n.includes('oracle')) return <Cloud size={22} />;
  if (n.includes('penetration') || n.includes('pentest')) return <Lock size={22} />;
  if (n.includes('compliance') || n.includes('auditing') || n.includes('soc 2') || n.includes('policy')) return <ShieldCheck size={22} />;
  if (n.includes('incident') || n.includes('remediation')) return <AlertTriangle size={22} />;
  if (n.includes('awareness') || n.includes('training')) return <Users size={22} />;
  if (n.includes('legacy') || n.includes('migration')) return <Repeat size={22} />;
  if (n.includes('integration') || n.includes('systems')) return <Layers size={22} />;
  if (n.includes('workflow') || n.includes('engine') || n.includes('process')) return <Settings size={22} />;
  if (n.includes('.net') || n.includes('c#')) return <Code2 size={22} />;
  if (n.includes('php') || n.includes('laravel')) return <Layers size={22} />;
  if (n.includes('python')) return <Terminal size={22} />;
  if (n.includes('node')) return <Zap size={22} />;
  if (n.includes('c++')) return <Cpu size={22} />;
  if (n.includes('back-end') || n.includes('server')) return <Server size={22} />;
  if (n.includes('e-commerce') || n.includes('magento') || n.includes('woo')) return <ShoppingBag size={22} />;
  if (n.includes('erp')) return <Settings size={22} />;
  if (n.includes('performance') || n.includes('iot')) return <Cpu size={22} />;
  
  // Fallbacks by category
  if (tabId === 'ai-data') return <Brain size={22} />;
  if (tabId === 'app-dev') return <Globe size={22} />;
  if (tabId === 'cloud') return <Cloud size={22} />;
  if (tabId === 'cybersecurity') return <Shield size={22} />;
  if (tabId === 'digital-transformation') return <Repeat size={22} />;
  if (tabId === 'software-engineering') return <Code2 size={22} />;
  if (tabId === 'enterprise-applications') return <Settings size={22} />;
  
  return <Code2 size={22} />;
}

function getServiceTag(name) {
  const n = name.toLowerCase();
  if (n.includes('compliance') || n.includes('auditing') || n.includes('policy')) return 'Compliance';
  if (n.includes('penetration') || n.includes('incident response') || n.includes('security management')) return 'Cyber Ops';
  if (n.includes('artificial intelligence') || n.includes('bot') || n.includes('robotics')) return 'AI & Data';
  if (n.includes('.net') || n.includes('c++') || n.includes('performance-critical')) return 'High Perf';
  if (n.includes('aws') || n.includes('cloud') || n.includes('migration')) return 'Cloud Native';
  if (n.includes('mobile') || n.includes('cross-platform')) return 'Mobile App';
  if (n.includes('e-commerce') || n.includes('magento') || n.includes('woo') || n.includes('erp')) return 'Enterprise';
  if (n.includes('data science') || n.includes('database')) return 'Analytics';
  return 'Modern Dev';
}

export default function Services() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const serviceParam = searchParams.get('service');

  const initialTab = resolveTabId(tabParam);
  const [active, setActive] = useState(initialTab);
  const [selectedService, setSelectedService] = useState(null);

  const closeModal = useCallback(() => setSelectedService(null), []);

  // ── Portal modal: body scroll-lock + Escape key dismiss ──
  useEffect(() => {
    if (!selectedService) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [selectedService, closeModal]);

  useEffect(() => {
    if (tabParam) {
      const resolved = resolveTabId(tabParam);
      setActive(resolved);
      
      if (serviceParam) {
        const foundTab = tabs.find(t => t.id === resolved);
        const foundService = foundTab?.services.find(
          s => s.name.toLowerCase() === serviceParam.toLowerCase()
        );
        if (foundService) {
          const timer = setTimeout(() => {
            setSelectedService(foundService);
          }, 100);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [tabParam, serviceParam]);

  const currentTab = tabs.find(t => t.id === active) || tabs[0];

  return (
    <main className="svc-page-root">
      <SEO 
        title="Enterprise IT & Security Services" 
        description="Explore SecureStack's professional services: Penetration Testing, Secure Software Engineering, Compliance Hardening, and Cloud DevOps Solutions."
        keywords="pentesting Zimbabwe, custom software development, secure cloud architecture, cybersecurity services Zimbabwe"
        path="/services"
      />
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
                  <div className="svc-card-header">
                    <div className="svc-card-icon-wrapper">
                      {getServiceIcon(s.name, currentTab.id)}
                    </div>
                    <span className="svc-card-badge">{getServiceTag(s.name)}</span>
                  </div>
                  <div className="svc-card-body">
                    <h3 className="svc-card-title">{s.name}</h3>
                    <p className="svc-card-desc-preview">{s.desc}</p>
                  </div>
                  <div className="svc-card-footer">
                    <span className="svc-card-action">Learn more</span>
                    <span className="svc-card-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Drawer — rendered via Portal onto #modal-root ── */}
      {selectedService && createPortal(
        <>
          {/* Backdrop — click to close */}
          <div
            className="svc-drawer-backdrop"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside
            className="svc-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={selectedService.name}
          >
            {/* ── Header ── */}
            <div className="svc-drawer-header">
              <div className="svc-drawer-meta">
                <div className="svc-drawer-path">
                  {currentTab.label}
                  <span className="path-sep"> / </span>
                  {selectedService.name}
                </div>
                <h2 className="svc-drawer-title">{selectedService.name}</h2>
              </div>
              <button
                className="svc-drawer-close"
                onClick={closeModal}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="svc-drawer-body">
              <p className="svc-drawer-desc">{selectedService.desc}</p>

              <div className="svc-drawer-highlights">
                <p className="svc-drawer-highlights-label">Key Delivery Standards</p>
                <div className="svc-drawer-bullet">
                  <span className="svc-bullet-icon">✓</span>
                  <div>
                    <strong>Security-First Architecture</strong>
                    <p>Engineered with zero-trust principles and robust vulnerability protection layers.</p>
                  </div>
                </div>
                <div className="svc-drawer-bullet">
                  <span className="svc-bullet-icon">✓</span>
                  <div>
                    <strong>High Scalability &amp; Clean Code</strong>
                    <p>Modular, reusable code written to standard guidelines and optimized for performance.</p>
                  </div>
                </div>
                <div className="svc-drawer-bullet">
                  <span className="svc-bullet-icon">✓</span>
                  <div>
                    <strong>Enterprise Readiness</strong>
                    <p>Full documentation, automated deployments, and continuous system monitoring.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sticky Footer CTAs ── */}
            <div className="svc-drawer-footer">
              <button
                className="btn btn-primary svc-drawer-cta-primary"
                onClick={() => {
                  closeModal();
                  setTimeout(() => {
                    document.getElementById('svc-contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
              >
                Inquire About This Service →
              </button>
              {selectedService.link ? (
                <Link
                  to={selectedService.link}
                  className="btn btn-outline svc-drawer-cta-secondary"
                  onClick={closeModal}
                >
                  View Architecture &amp; Tech Stack →
                </Link>
              ) : (
                <Link
                  to="/contact"
                  className="btn btn-outline svc-drawer-cta-secondary"
                  onClick={closeModal}
                >
                  Estimate Project Cost →
                </Link>
              )}
            </div>
          </aside>
        </>,
        document.getElementById('modal-root')
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
