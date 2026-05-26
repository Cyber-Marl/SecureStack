import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

const techs = ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3', 'Webpack / Vite'];
const features = [
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, 
    title: 'Performance Optimized', 
    desc: 'Lazy loading, code splitting, and CDN strategies for sub-second load times.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, 
    title: 'Responsive Design', 
    desc: 'Pixel-perfect layouts that work flawlessly on all screen sizes and devices.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>, 
    title: 'Accessibility (WCAG)', 
    desc: 'Inclusive interfaces built to WCAG 2.1 AA standards.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, 
    title: 'SEO-Friendly', 
    desc: 'Server-side rendering and meta optimization for maximum search visibility.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 16V12M12 8H12.01"/></svg>, 
    title: 'Modern UI/UX', 
    desc: 'Stunning interfaces designed to convert visitors into customers.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>, 
    title: 'API Integration', 
    desc: 'Seamless integration with REST APIs, GraphQL, and third-party services.' 
  },
];

export default function FrontEnd() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Tech Stack → Front-End</p>
          <h1 className="section-title">Front-End Development</h1>
          <p className="section-subtitle">We build stunning, high-performance front-end applications using modern frameworks and best practices that delight users and drive results.</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <a href="#fe-contact" className="btn btn-primary" onClick={e => { e.preventDefault(); document.getElementById('fe-contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Start Your Project →</a>
            <Link to="/back-end-development-services" className="btn btn-outline">View Back-End Services</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p className="section-label">Technologies</p>
            <h2 className="section-title">Front-End Technologies We Use</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 64 }}>
            {techs.map(t => (
              <span key={t} className="tag" style={{ fontSize: 14, padding: '8px 18px' }}>{t}</span>
            ))}
          </div>

          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p className="section-label">What We Deliver</p>
            <h2 className="section-title">Our Front-End Capabilities</h2>
          </div>
          <div className="grid-3">
            {features.map(f => (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="icon-box">{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="fe-contact">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p className="section-label">Get Started</p>
            <h2 className="section-title">Ready to Build?</h2>
            <p className="section-subtitle">Tell us about your front-end project and we'll craft a beautiful, performant solution.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
