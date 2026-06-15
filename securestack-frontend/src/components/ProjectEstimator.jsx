import { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from './ContactForm';
import './ProjectEstimator.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const projectTypes = [
  { id: 'web', label: 'Web Application', baseTime: 6, baseComplexity: 30, desc: 'SPAs, custom portals, high-performance dashboards.' },
  { id: 'mobile', label: 'Mobile Application', baseTime: 8, baseComplexity: 50, desc: 'Native iOS/Android or cross-platform products.' },
  { id: 'cloud', label: 'Cloud & DevOps', baseTime: 4, baseComplexity: 25, desc: 'IaC provisioning, CI/CD, Kubernetes setups.' },
  { id: 'cyber', label: 'Security & Pentesting', baseTime: 3, baseComplexity: 35, desc: 'Threat modeling, ethical hacking, logical audits.' },
  { id: 'ai', label: 'AI, ML & Data', baseTime: 8, baseComplexity: 60, desc: 'Generative AI tools, custom pipelines, analytics.' },
];

const stackOptions = {
  web: ['React.js', 'Next.js', 'FastAPI', 'Django', 'Node.js', 'PostgreSQL', 'Cloudflare WAF'],
  mobile: ['React Native', 'Flutter', 'Swift (iOS)', 'Kotlin (Android)', 'Firebase', 'Secure SQLite'],
  cloud: ['AWS Cloud', 'Microsoft Azure', 'Terraform (IaC)', 'Kubernetes', 'Docker Hub', 'GitHub Actions'],
  cyber: ['SAST/DAST Pipeline', 'WAF Hardening', 'STRIDE Modeling', 'Penetration Scan', 'IAM Policy Audit'],
  ai: ['OpenAI / LLM API', 'RAG Architecture', 'Python PyTorch', 'Pandas Data Pipeline', 'BI Analytics'],
};

const complianceOptions = [
  { id: 'soc2', label: 'SOC 2 Type II', timeAdded: 3, complexityAdded: 15 },
  { id: 'iso', label: 'ISO 27001 Standard', timeAdded: 4, complexityAdded: 20 },
  { id: 'gdpr', label: 'GDPR / Privacy Laws', timeAdded: 2, complexityAdded: 10 },
  { id: 'hipaa', label: 'HIPAA Health Security', timeAdded: 3, complexityAdded: 15 },
];

export default function ProjectEstimator({ isModal = false, onSuccess }) {
  const [mode, setMode] = useState('simple'); // 'simple' or 'wizard'
  const [step, setStep] = useState(1);
  const [project, setProject] = useState('web');
  const [selectedStack, setSelectedStack] = useState([]);
  const [selectedCompliance, setSelectedCompliance] = useState([]);
  
  // Contact details for wizard
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [extraMsg, setExtraMsg] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Calculation variables
  const [timeline, setTimeline] = useState(6);
  const [complexity, setComplexity] = useState(30);

  // Recalculate timeline & complexity on selections
  useEffect(() => {
    const activeProj = projectTypes.find(p => p.id === project);
    if (!activeProj) return;

    let totalWeeks = activeProj.baseTime;
    let totalComplexity = activeProj.baseComplexity;

    // Stack modifier: +0.5 weeks per stack item, +5 complexity
    totalWeeks += selectedStack.length * 0.5;
    totalComplexity += selectedStack.length * 5;

    // Compliance modifiers
    selectedCompliance.forEach(cId => {
      const comp = complianceOptions.find(o => o.id === cId);
      if (comp) {
        totalWeeks += comp.timeAdded;
        totalComplexity += comp.complexityAdded;
      }
    });

    setTimeline(Math.round(totalWeeks));
    setComplexity(Math.min(totalComplexity, 100));
  }, [project, selectedStack, selectedCompliance]);

  // Reset stack when project type changes
  const handleProjectSelect = (pId) => {
    setProject(pId);
    setSelectedStack([]);
  };

  const toggleStack = (tech) => {
    setSelectedStack(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleCompliance = (cId) => {
    setSelectedCompliance(prev =>
      prev.includes(cId) ? prev.filter(c => c !== cId) : [...prev, cId]
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name || !email) {
      setStatus({ type: 'error', msg: 'Please provide at least a name and email.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formattedMsg = `
=== INTERACTIVE ESTIMATOR SCOPE SHEET ===
Project Type: ${projectTypes.find(p => p.id === project)?.label}
Estimated Timeline: ${timeline} Weeks
Complexity Score: ${complexity}/100

Selected Tech Stack:
${selectedStack.length > 0 ? selectedStack.map(s => `- ${s}`).join('\n') : 'None selected (Non-technical / skipped)'}

Compliance Standard Needs:
${selectedCompliance.length > 0 ? selectedCompliance.map(c => `- ${complianceOptions.find(o => o.id === c)?.label}`).join('\n') : 'None required (Non-technical / skipped)'}

Prospect Message:
${extraMsg || 'No additional comments.'}
    `.trim();

    const referrer_code = localStorage.getItem('securestack_ref') || null;

    try {
      const response = await axios.post(`${API_URL}/contact/`, {
        name,
        email,
        phone: phone || 'N/A',
        service: `Estimator: ${projectTypes.find(p => p.id === project)?.label}`,
        message: formattedMsg,
        referrer_code: referrer_code,
      });

      if (response.status === 201) {
        setStatus({ type: 'success', msg: 'Estimate successfully submitted! Our team will reach out within 24 hours.' });
        
        setTimeout(() => {
          setName('');
          setEmail('');
          setPhone('');
          setExtraMsg('');
          setSelectedStack([]);
          setSelectedCompliance([]);
          setStep(1);
          if (onSuccess) onSuccess();
        }, 3500);
      } else {
        throw new Error('Unexpected response from server.');
      }

    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.detail || err.response?.data?.message;
      setStatus({
        type: 'error',
        msg: serverMsg || err.message || 'Server connection issue. Please verify your fields and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="est-wizard-card">
      {/* ── Mode Toggle at the very top ── */}
      <div className="est-mode-toggle">
        <button
          type="button"
          className={`est-toggle-btn${mode === 'simple' ? ' active' : ''}`}
          onClick={() => setMode('simple')}
        >
          💬 General Inquiry
        </button>
        <button
          type="button"
          className={`est-toggle-btn${mode === 'wizard' ? ' active' : ''}`}
          onClick={() => setMode('wizard')}
        >
          🧮 Project Scope Builder
        </button>
      </div>

      {mode === 'simple' ? (
        /* 💬 General/Non-technical Inquiry Path */
        <div className="est-simple-container">
          <div className="est-wizard-body" style={{ minHeight: 'auto', paddingBottom: 0 }}>
            <div className="est-step-container">
              <h3>Send a Quick Message</h3>
              <p className="est-step-subtext">Ideal if you want to ask a general question or schedule a standard discovery call.</p>
            </div>
          </div>
          <div style={{ padding: '0 32px 32px' }}>
            <ContactForm isModal={isModal} onSuccess={onSuccess} />
          </div>
        </div>
      ) : (
        /* 🧮 Scope Estimator Wizard Path */
        <>
          <div className="est-wizard-header">
            <span className="est-step-indicator">Step {step} of 4</span>
            <div className="est-progress-track">
              <div className="est-progress-bar" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          <div className="est-wizard-body">
            {/* Step 1: Project Type Selection */}
            {step === 1 && (
              <div className="est-step-container">
                <h3>Select Project Type</h3>
                <p className="est-step-subtext">Choose the primary structural focus of your new project.</p>
                <div className="est-choices-grid">
                  {projectTypes.map(p => (
                    <div
                      key={p.id}
                      className={`est-choice-card${project === p.id ? ' active' : ''}`}
                      onClick={() => handleProjectSelect(p.id)}
                    >
                      <span className="choice-dot" />
                      <div>
                        <strong>{p.label}</strong>
                        <p>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Tech Stack Config */}
            {step === 2 && (
              <div className="est-step-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Configure Tech Stack</h3>
                  <button 
                    type="button" 
                    className="est-skip-step-btn"
                    onClick={() => { setSelectedStack([]); setStep(3); }}
                  >
                    Skip Step ➔
                  </button>
                </div>
                <p className="est-step-subtext">Choose your stack tools. (Non-technical? Click "Skip Step" above!)</p>
                <div className="est-chips-grid">
                  {stackOptions[project].map(tech => (
                    <button
                      key={tech}
                      type="button"
                      className={`est-chip${selectedStack.includes(tech) ? ' active' : ''}`}
                      onClick={() => toggleStack(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                {selectedStack.length === 0 && (
                  <p className="est-info-alert">Tip: Select stack components to update timeline modifiers, or skip to compliance.</p>
                )}
              </div>
            )}

            {/* Step 3: Compliance Frameworks */}
            {step === 3 && (
              <div className="est-step-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Compliance Guard</h3>
                  <button 
                    type="button" 
                    className="est-skip-step-btn"
                    onClick={() => { setSelectedCompliance([]); setStep(4); }}
                  >
                    Skip Step ➔
                  </button>
                </div>
                <p className="est-step-subtext">Specify the compliance required, or skip straight to submission details.</p>
                <div className="est-choices-grid">
                  {complianceOptions.map(comp => (
                    <div
                      key={comp.id}
                      className={`est-choice-card${selectedCompliance.includes(comp.id) ? ' active' : ''}`}
                      onClick={() => toggleCompliance(comp.id)}
                    >
                      <span className="choice-checkbox" />
                      <div>
                        <strong>{comp.label}</strong>
                        <p>Adds security testing controls and regulatory hardening guardrails.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Contact Details Submission */}
            {step === 4 && (
              <div className="est-step-container">
                <h3>Request Secure Consultation</h3>
                <p className="est-step-subtext">Provide contact credentials to dispatch this formatted scope sheet.</p>
                
                <form onSubmit={handleSubmit} className="est-contact-form">
                  <div className="form-group">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="form-input"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      required
                      placeholder="Business Email"
                      className="form-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Phone Number (WhatsApp friendly)"
                      className="form-input"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      placeholder="Tell us more about your scope or specifications (optional)..."
                      className="form-input form-textarea"
                      value={extraMsg}
                      onChange={e => setExtraMsg(e.target.value)}
                    />
                  </div>

                  {status.msg && (
                    <div className={`status-alert ${status.type}`}>
                      {status.msg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary est-submit-btn"
                  >
                    {loading ? 'Submitting Scope Sheet...' : 'Request Formal Proposal →'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Calculations Dashboard */}
          <div className="est-calculation-dashboard">
            <div className="est-dashboard-stat">
              <span className="lbl">Estimated Delivery</span>
              <span className="val">{timeline} Weeks</span>
            </div>
            <div className="est-dashboard-divider" />
            <div className="est-dashboard-stat">
              <span className="lbl">Complexity Index</span>
              <div className="complexity-gauge-container">
                <span className="val">{complexity}/100</span>
                <div className="complexity-gauge-track">
                  <div 
                    className="complexity-gauge-fill" 
                    style={{ 
                      width: `${complexity}%`,
                      background: complexity > 70 ? 'var(--orange)' : complexity > 40 ? 'var(--orange)' : 'var(--blue)' 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="est-wizard-footer">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(prev => prev - 1)}
              >
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                className="btn btn-primary est-next-btn"
                onClick={() => setStep(prev => prev + 1)}
              >
                Next Step →
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
