import { Link } from 'react-router-dom';
import ProjectEstimator from '../components/ProjectEstimator';
import SEO from '../components/SEO';
import { useScrollReveal } from '../hooks/useAnimations';
import './Contact.css';

export default function Contact() {
  const [secHeroRef, secHeroRevealed] = useScrollReveal();
  const [secFormRef, secFormRevealed] = useScrollReveal();

  return (
    <main className="contact-page-root">
      <SEO 
        title="Request a Secure Consultation" 
        description="Contact SecureStack to discuss your project requirements or build a project estimate. Request an NDA-protected cybersecurity or software development consultation."
        keywords="hire developers Zimbabwe, contact cybersecurity company Harare, project estimator"
        path="/contact"
      />
      {/* ── Breadcrumbs & Page Hero ── */}
      <section ref={secHeroRef} className={`contact-hero-section reveal-section ${secHeroRevealed ? 'revealed' : ''}`}>
        <div className="container">
          <div className="svc-breadcrumbs">
            <Link to="/">Home</Link>
            <span className="svc-breadcrumb-sep">&gt;</span>
            <span className="svc-breadcrumb-active">Contact Us</span>
          </div>
          <h1 className="svc-main-title">Let's build something secure together</h1>
          <p className="contact-hero-subtitle">
            Partner with us to create premium software and secure cloud systems engineered to elite cybersecurity standards.
          </p>
        </div>
      </section>

      {/* ── Main Contact Grid Segment ── */}
      <section ref={secFormRef} className={`section reveal-section ${secFormRevealed ? 'revealed' : ''}`} style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <h2 className="contact-main-title">Consultation</h2>
              
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

              {/* Direct Details */}
              <div className="contact-direct-info">
                <h4>Direct Connections</h4>
                <div className="contact-direct-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>info@securestack.co.zw</span>
                </div>
                <div className="contact-direct-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <span>+263 77 563 4182</span>
                </div>
                <div className="contact-direct-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Harare, Zimbabwe</span>
                </div>
              </div>


            </div>

            <ProjectEstimator />
          </div>
        </div>
      </section>
    </main>
  );
}
