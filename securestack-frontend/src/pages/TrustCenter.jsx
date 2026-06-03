import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import DomainScanner from '../components/DomainScanner';
import { useScrollReveal } from '../hooks/useAnimations';
import './TrustCenter.css';

const sdlcSteps = [
  {
    step: '01',
    phase: 'Threat Modeling & Design',
    desc: 'During scoping, we map attack surfaces, establish trust boundaries, and conduct rigorous STRIDE threat analysis to catch structural design flaws before coding begins.'
  },
  {
    step: '02',
    phase: 'Static Analysis (SAST)',
    desc: 'Our developer pipelines automatically run Static Application Security Testing scanners on every single commit, catching buffer overflows, injection points, and logic bugs instantly.'
  },
  {
    step: '03',
    phase: 'Dynamic Scans (DAST)',
    desc: 'Isolated sandbox and staging deployments undergo continuous automated grey-box attacks to test API boundary safeguards and token access mechanics under real-time simulated loads.'
  },
  {
    step: '04',
    phase: 'Ethical Pentesting',
    desc: 'Elite OSCP-certified security engineers perform comprehensive manual security reviews, targeting logic errors, access control failures, and advanced privilege escalations.'
  },
  {
    step: '05',
    phase: 'Continuous Monitoring',
    desc: 'Production applications are containerized, shielded by Cloudflare WAF, and continuously audited by automated configuration checks with 24/7 incident tracking.'
  }
];

const standards = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'SOC 2 Type II Readiness',
    desc: 'Strict access logging, database security controls, and standardized deployment protocols aligned with SOC 2 Trust Service Criteria.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'ISO 27001 ISMS Alignment',
    desc: 'Our information security management system maps directly to ISO/IEC 27001 clauses to secure operations, assets, and partner systems.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: 'GDPR & Privacy First',
    desc: 'Data protection by design. Strict data minimization, TLS 1.3/AES-256 encryption defaults, and compliance-ready privacy frameworks.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    title: 'OWASP Top 10 Audited',
    desc: 'Software built from scratch with absolute resilience against SQL injections, XSS attacks, broken auth, and path traversals.'
  }
];

const guardrails = [
  {
    area: 'Data Protection & Encryption',
    items: [
      { key: 'At Rest', value: 'AES-256 encryption with automated rotation via AWS Key Management Service (KMS).' },
      { key: 'In Transit', value: 'Forced TLS 1.3 with Perfect Forward Secrecy across all API gateways.' },
      { key: 'Database Protection', desc: 'Secure database clustering, encrypted tables, and automated offsite immutable back-ups.' }
    ]
  },
  {
    area: 'Network & Infrastructure Guard',
    items: [
      { key: 'WAF Setup', value: 'Enterprise-tier Cloudflare WAF shielding against HTTP floods and DDoS vectors.' },
      { key: 'Private VPCs', value: 'Decoupled application logic running within locked isolated virtual private clouds.' },
      { key: 'API Security', desc: 'FastAPI/Django backend setups equipped with strict CORS, rate-limiting, and OAuth2 security.' }
    ]
  },
  {
    area: 'Access Controls & Identity (IAM)',
    items: [
      { key: 'MFA Enforcement', value: 'Mandatory Multi-Factor Authentication across all administrative panels.' },
      { key: 'Least Privilege', value: 'Role-Based Access Control (RBAC) ensuring employees see only required assets.' },
      { key: 'Immutable Auditing', desc: 'Centralized database system logging all record changes with cryptographic validation.' }
    ]
  }
];

export default function TrustCenter() {
  const [activeStep, setActiveStep] = useState(0);
  const [secHeroRef, secHeroRevealed] = useScrollReveal();
  const [secSdlcRef, secSdlcRevealed] = useScrollReveal();
  const [secStdsRef, secStdsRevealed] = useScrollReveal();
  const [secGrdRef, secGrdRevealed] = useScrollReveal();
  const [secContactRef, secContactRevealed] = useScrollReveal();

  return (
    <main className="trust-page-root">
      {/* ── Breadcrumb & Hero ── */}
      <section ref={secHeroRef} className={`sec-hero-section reveal-section ${secHeroRevealed ? 'revealed' : ''}`}>
        <div className="container">
          <div className="svc-breadcrumbs">
            <Link to="/">Home</Link>
            <span className="svc-breadcrumb-sep">&gt;</span>
            <span className="svc-breadcrumb-active">Security &amp; Compliance</span>
          </div>
          <h1 className="svc-main-title">Security &amp; Trust Center</h1>
          <p className="sec-hero-subtitle">
            Enterprise-grade safety engineered directly into every system architecture. We maintain strict compliance, rigorous threat modeling, and state-of-the-art encryption standard procedures.
          </p>
        </div>
      </section>

      {/* ── Domain Scanner Section ── */}
      <DomainScanner />

      {/* ── Secure SDLC Timeline Section ── */}
      <section ref={secSdlcRef} className={`section reveal-section ${secSdlcRevealed ? 'revealed' : ''}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <p className="section-label">Engineering Integrity</p>
            <h2 className="section-title">Our Secure SDLC Pipeline</h2>
            <p className="section-subtitle">How we embed threat mitigation at every stage of the software development life cycle.</p>
          </div>

          <div className="sdlc-timeline-wrapper">
            <div className="sdlc-timeline-nav">
              {sdlcSteps.map((s, idx) => (
                <button
                  key={s.step}
                  className={`sdlc-nav-btn${activeStep === idx ? ' active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <span className="sdlc-nav-step">{s.step}</span>
                  <span className="sdlc-nav-label">{s.phase}</span>
                </button>
              ))}
            </div>

            <div className="sdlc-timeline-display card">
              <span className="sdlc-display-num">{sdlcSteps[activeStep].step}</span>
              <h3>{sdlcSteps[activeStep].phase}</h3>
              <p>{sdlcSteps[activeStep].desc}</p>
              
              <div className="sdlc-display-badge">
                <span className="badge-dot" /> Verified Compliance Guard
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Compliance Standards Grid ── */}
      <section ref={secStdsRef} className={`section reveal-section ${secStdsRevealed ? 'revealed' : ''}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <p className="section-label">Compliance</p>
            <h2 className="section-title">Global Security Frameworks</h2>
            <p className="section-subtitle">Aligned with strict international regulatory and architectural security mandates.</p>
          </div>

          <div className="grid-2">
            {standards.map(s => (
              <div key={s.title} className="sec-standard-card card">
                <div className="standard-icon-box">{s.icon}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Guardrails Tech Details ── */}
      <section ref={secGrdRef} className={`section reveal-section ${secGrdRevealed ? 'revealed' : ''}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <p className="section-label">Technical Controls</p>
            <h2 className="section-title">Bespoke Enterprise Guardrails</h2>
            <p className="section-subtitle">Our exact technical architecture mappings to prevent access breaches and secure databases.</p>
          </div>

          <div className="grid-3">
            {guardrails.map(g => (
              <div key={g.area} className="sec-guardrail-card card">
                <h3 className="guardrail-title">{g.area}</h3>
                <div className="guardrail-items-list">
                  {g.items.map((item, idx) => (
                    <div key={idx} className="guardrail-item">
                      {item.key ? (
                        <>
                          <span className="guardrail-key">{item.key}</span>
                          <span className="guardrail-val">{item.value}</span>
                        </>
                      ) : (
                        <p className="guardrail-desc">{item.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Contact Redirection ── */}
      <section ref={secContactRef} className={`section reveal-section ${secContactRevealed ? 'revealed' : ''}`} id="svc-contact">
        <div className="container">
          <div className="svc-contact-layout">
            <div>
              <p className="section-label">Enterprise Trust</p>
              <h2 className="section-title">Consult with Our Security Experts</h2>
              <p className="section-subtitle">Need to evaluate our SDLC, review audit reports, or sign a custom NDA? Let's align on your security standards.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
