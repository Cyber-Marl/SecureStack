import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import { triggerContactModal } from '../components/ContactModal';
import ParticleCanvas from '../components/ParticleCanvas';
import HowWeWork from '../components/HowWeWork';
import Testimonials from '../components/Testimonials';
import { useScrollReveal, useCountUp } from '../hooks/useAnimations';
import { 
  Shield, 
  Braces, 
  Layers, 
  Terminal, 
  Zap, 
  Cpu, 
  Cloud, 
  Lock, 
  Smartphone, 
  Palette, 
  Brain,
  Landmark,
  HeartPulse,
  Building2,
  GraduationCap,
  ShoppingBag,
  Factory
} from 'lucide-react';
import './Home.css';

const services = [
  { 
    icon: <Shield size={24} strokeWidth={2} />, 
    title: 'IT Security Management', 
    desc: 'Security policy development, vulnerability assessments, and awareness training to protect your entire IT ecosystem.', 
    to: '/services' 
  },
  { 
    icon: <Braces size={24} strokeWidth={2} />, 
    title: '.NET Development', 
    desc: 'Robust, cross-platform .NET solutions with consulting, project planning, and end-to-end software development & QA.', 
    to: '/services' 
  },
  { 
    icon: <Layers size={24} strokeWidth={2} />, 
    title: 'PHP Development', 
    desc: 'Top-performance PHP applications with seamless integrations and enhanced compatibility by skilled engineers.', 
    to: '/services' 
  },
  { 
    icon: <Terminal size={24} strokeWidth={2} />, 
    title: 'Python Development', 
    desc: 'Scalable Python solutions for data processing, automation, web APIs, and AI/ML integrations.', 
    to: '/services' 
  },
  { 
    icon: <Zap size={24} strokeWidth={2} />, 
    title: 'Node.js Development', 
    desc: 'Fast, event-driven Node.js backends for real-time applications, REST APIs and microservices architectures.', 
    to: '/services' 
  },
  { 
    icon: <Cpu size={24} strokeWidth={2} />, 
    title: 'C++ Development', 
    desc: 'High-performance C++ systems programming for embedded systems, game engines, and performance-critical software.', 
    to: '/services' 
  },
  {
    icon: <Cloud size={24} strokeWidth={2} />,
    title: 'Cloud & DevOps Engineering',
    desc: 'Bespoke AWS/Azure setup, containerization (Kubernetes), infrastructure as code (Terraform), and secure CI/CD automation.',
    to: '/services'
  },
  {
    icon: <Lock size={24} strokeWidth={2} />,
    title: 'Penetration Testing & Compliance',
    desc: 'Bespoke web application pentesting, SOC 2/ISO 27001 audit prep, and offensive security analysis.',
    to: '/services'
  },
  {
    icon: <Smartphone size={24} strokeWidth={2} />,
    title: 'Mobile App Development',
    desc: 'High-performance native Swift/Kotlin applications and responsive cross-platform (React Native/Flutter) products.',
    to: '/services'
  },
  {
    icon: <Palette size={24} strokeWidth={2} />,
    title: 'UI/UX Design & Prototyping',
    desc: 'Research-driven Figma wireframing, high-fidelity prototypes, user journey mapping, and comprehensive testing.',
    to: '/services'
  },
  {
    icon: <Brain size={24} strokeWidth={2} />,
    title: 'AI, Machine Learning & Data',
    desc: 'Intelligent LLM integrations, customized machine learning pipelines, predictive modeling, and analytics.',
    to: '/services'
  },
];

const techStack = [
  { category: 'Front-End', items: ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Back-End', items: ['Django', 'Node.js', '.NET Core', 'PHP Laravel', 'Python FastAPI', 'Ruby on Rails'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform'] },
  { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase'] },
];

const industries = [
  { 
    icon: <Landmark size={32} strokeWidth={1.8} />, 
    title: 'Finance & Banking', 
    desc: 'Secure fintech platforms, digital banking, and payment systems.' 
  },
  { 
    icon: <HeartPulse size={32} strokeWidth={1.8} />, 
    title: 'Healthcare', 
    desc: 'HIPAA-compliant health data systems and telemedicine platforms.' 
  },
  { 
    icon: <Building2 size={32} strokeWidth={1.8} />, 
    title: 'Government', 
    desc: 'Mission-critical systems with the highest security standards.' 
  },
  { 
    icon: <GraduationCap size={32} strokeWidth={1.8} />, 
    title: 'Education', 
    desc: 'E-learning platforms, student management, and LMS solutions.' 
  },
  { 
    icon: <ShoppingBag size={32} strokeWidth={1.8} />, 
    title: 'Retail & E-Commerce', 
    desc: 'Scalable online stores, POS systems, and inventory management.' 
  },
  { 
    icon: <Factory size={32} strokeWidth={1.8} />, 
    title: 'Manufacturing', 
    desc: 'ERP systems, IoT integrations, and supply chain management.' 
  },
];

const stats = [
  { value: '99%', label: 'Uptime SLA' },
  { value: '100%', label: 'OWASP Aligned' },
  { value: '24', label: 'Threat Protection' },
  { value: '10+', label: 'Sectors Supported' },
];

function StatItem({ value, label }) {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp(value, active);

  return (
    <div ref={ref} className="stat">
      <span className="stat-value">{count}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Home() {
  const [aboutRef, aboutRevealed] = useScrollReveal();
  const [servicesRef, servicesRevealed] = useScrollReveal();
  const [techRef, techRevealed] = useScrollReveal();
  const [industriesRef, industriesRevealed] = useScrollReveal();
  const [contactRef, contactRevealed] = useScrollReveal();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <ParticleCanvas />
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-text-wrapper">
            <div className="tag" style={{ marginBottom: 24 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--orange)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Cybersecurity &amp; Software Development
              </span>
            </div>
            <h1 className="hero-title">
              Empowering Your Business Through{' '}
              <span className="gradient-text">Secure Development</span>{' '}
              and Cloud Solutions
            </h1>
            <p className="hero-sub">
              Innovative software development, robust cybersecurity, and cloud services
              tailored to your unique business needs across Africa and beyond.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={triggerContactModal}>
                Let's Discuss Your Project →
              </button>
              <Link to="/services" className="btn btn-outline">View Our Services</Link>
            </div>
          </div>
          <div className="hero-stats">
            {stats.map(s => (
              <StatItem key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section ref={aboutRef} className={`section reveal-section ${aboutRevealed ? 'revealed' : ''}`} id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <p className="section-label">About Us</p>
              <h2 className="section-title">Who We Are</h2>
              <p className="about-body">
                As a leading provider of software development, cybersecurity, and cloud solutions,
                <strong> Secure Stack Enterprise Solutions</strong> has built a reputation for excellence
                across various industries. Our dedicated team takes the time to analyze and understand
                your unique business needs, ensuring we deliver tailored, industry-focused IT solutions.
              </p>
              <p className="about-body">
                With a commitment to innovation and security, we leverage the latest technologies to empower
                organizations in achieving their goals. Our proven track record, positive client testimonials,
                and skilled professionals serve as your assurance of success in navigating the digital landscape.
              </p>
              <p className="about-body">
                Partner with Secure Stack Enterprise Solutions to enhance your operational efficiency and safeguard
                your business. <strong>Your success is our priority.</strong>
              </p>
              <div className="about-actions">
                <a href="#contact" className="btn btn-primary" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Work With Us
                </a>
                <Link to="/services" className="btn btn-outline">Our Services</Link>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-card">
                <div className="about-card-item">
                  <span className="about-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div>
                    <strong>Proven Track Record</strong>
                    <p>Delivering successful projects across multiple industries</p>
                  </div>
                </div>
                <div className="about-card-item">
                  <span className="about-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <div>
                    <strong>Security-First Approach</strong>
                    <p>Every solution built with cybersecurity at its core</p>
                  </div>
                </div>
                <div className="about-card-item">
                  <span className="about-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </span>
                  <div>
                    <strong>Local Expertise, Global Standards</strong>
                    <p>Serving clients across Africa with world-class quality</p>
                  </div>
                </div>
                <div className="about-card-item">
                  <span className="about-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </span>
                  <div>
                    <strong>Innovation &amp; Agility</strong>
                    <p>Leveraging the latest technologies for your advantage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Services ── */}
      <section ref={servicesRef} className={`section reveal-section ${servicesRevealed ? 'revealed' : ''}`} id="services">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <p className="section-label">What We Do</p>
            <h2 className="section-title">Our Core Services</h2>
            <p className="section-subtitle">
              From cybersecurity to full-stack development — we deliver tailored solutions that protect and grow your business.
            </p>
          </div>
          <div className="grid-3">
            {services.map(s => (
              <Link to={s.to} key={s.title} className="service-card card">
                <div className="icon-box">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="card-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Tech Stack ── */}
      <section ref={techRef} className={`section reveal-section ${techRevealed ? 'revealed' : ''}`} id="tech">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <p className="section-label">Technologies</p>
            <h2 className="section-title">Our Tech Stack</h2>
            <p className="section-subtitle">We work with industry-leading technologies to build scalable, secure, and modern solutions.</p>
          </div>
          <div className="grid-4">
            {techStack.map(t => (
              <div key={t.category} className="tech-card card">
                <h4 className="tech-category">{t.category}</h4>
                <ul className="tech-list">
                  {t.items.map(item => (
                    <li key={item}><span className="tech-dot" />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="tech-cta">
            <Link to="/front-end-development" className="btn btn-outline">Front-End Development →</Link>
            <Link to="/back-end-development-services" className="btn btn-outline">Back-End Development →</Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── How We Work (Process) ── */}
      <HowWeWork />

      <div className="divider" />

      {/* ── Industries ── */}
      <section ref={industriesRef} className={`section reveal-section ${industriesRevealed ? 'revealed' : ''}`} id="industries">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <p className="section-label">Sectors We Serve</p>
            <h2 className="section-title">Industries We Work In</h2>
            <p className="section-subtitle">Delivering tailored IT solutions across high-impact sectors with deep domain expertise.</p>
          </div>
          <div className="grid-3">
            {industries.map(i => (
              <div key={i.title} className="industry-card card">
                <span className="industry-icon">{i.icon}</span>
                <h3>{i.title}</h3>
                <p>{i.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/industries" className="btn btn-primary">View All Industries →</Link>
          </div>
        </div>
      </section>



      {/* ── Contact ── */}
      <section ref={contactRef} className={`section reveal-section ${contactRevealed ? 'revealed' : ''}`} id="contact">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <h2 className="contact-main-title">Contact us</h2>
              
              <div className="contact-timeline-section">
                <h3 className="contact-timeline-subtitle">What happens next?</h3>
                
                <div className="contact-timeline">
                  <div className="contact-timeline-item">
                    <div className="timeline-badge">1</div>
                    <div className="timeline-content">
                      <p>An expert contacts you after having analyzed your requirements;</p>
                    </div>
                  </div>
                  <div className="contact-timeline-item">
                    <div className="timeline-badge">2</div>
                    <div className="timeline-content">
                      <p>If needed, we sign an NDA to ensure the highest privacy level;</p>
                    </div>
                  </div>
                  <div className="contact-timeline-item">
                    <div className="timeline-badge">3</div>
                    <div className="timeline-content">
                      <p>We submit a comprehensive project proposal with estimates, timelines, CVs, etc.</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
