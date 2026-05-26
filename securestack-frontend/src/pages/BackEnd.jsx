import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

const techs = ['Django REST', 'Node.js / Express', '.NET Core', 'PHP Laravel', 'Python FastAPI', 'PostgreSQL', 'Redis', 'Docker / Kubernetes'];
const features = [
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>, 
    title: 'Scalable APIs', 
    desc: 'RESTful and GraphQL APIs designed to handle millions of requests with low latency.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>, 
    title: 'Database Architecture', 
    desc: 'Optimized schema design, query tuning, and data modeling for relational and NoSQL databases.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, 
    title: 'Security-First', 
    desc: 'JWT authentication, OAuth2, rate limiting, and encryption built into every layer.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>, 
    title: 'Cloud-Native', 
    desc: 'Microservices, serverless functions, and containerized deployments on AWS, Azure, or GCP.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>, 
    title: 'DevOps & CI/CD', 
    desc: 'Automated testing, deployment pipelines, and infrastructure-as-code with Terraform.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, 
    title: 'Performance Monitoring', 
    desc: 'Real-time monitoring, logging, and alerting to keep your systems healthy 24/7.' 
  },
];

export default function BackEnd() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Tech Stack → Back-End</p>
          <h1 className="section-title">Back-End Development Services</h1>
          <p className="section-subtitle">We engineer powerful, secure, and scalable back-end systems that form the reliable foundation of your digital products.</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <a href="#be-contact" className="btn btn-primary" onClick={e => { e.preventDefault(); document.getElementById('be-contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Start Your Project →</a>
            <Link to="/front-end-development" className="btn btn-outline">View Front-End Services</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p className="section-label">Technologies</p>
            <h2 className="section-title">Back-End Technologies We Use</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 64 }}>
            {techs.map(t => (
              <span key={t} className="tag" style={{ fontSize: 14, padding: '8px 18px' }}>{t}</span>
            ))}
          </div>

          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p className="section-label">What We Deliver</p>
            <h2 className="section-title">Our Back-End Capabilities</h2>
          </div>
          <div className="grid-3">
            {features.map(f => (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="icon-box blue">{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="be-contact">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p className="section-label">Get Started</p>
            <h2 className="section-title">Let's Build Your Backend</h2>
            <p className="section-subtitle">Tell us about your infrastructure needs and we'll architect a robust, scalable solution.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
