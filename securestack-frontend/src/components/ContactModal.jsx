import { useState, useEffect } from 'react';
import ProjectEstimator from './ProjectEstimator';
import './ContactModal.css';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-contact-modal', handleOpen);
    return () => window.removeEventListener('open-contact-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="modal-card card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsOpen(false)}>×</button>
        <div className="modal-body-content">
          <div className="modal-left-info">
            <h2 className="modal-main-title">Let's discuss your project</h2>
            <p className="modal-subtitle">
              Tell us about your software development, cloud migration, or penetration testing needs and we'll engineer a custom secure solution.
            </p>
            
            {/* Timeline */}
            <div className="modal-timeline">
              <div className="timeline-item">
                <span className="badge">1</span>
                <p>Expert analysis of your system specifications;</p>
              </div>
              <div className="timeline-item">
                <span className="badge">2</span>
                <p>NDA signing for guaranteed enterprise privacy;</p>
              </div>
              <div className="timeline-item">
                <span className="badge">3</span>
                <p>Tailored proposal with detailed estimations.</p>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="modal-contact-details">
              <div className="detail-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>info@securestack.co.zw</span>
              </div>
              <div className="detail-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <span>+263 77 563 4182</span>
              </div>
            </div>
          </div>

          <div className="modal-right-form">
            <ProjectEstimator isModal={true} onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Global utility helper to trigger the modal from any component
export const triggerContactModal = (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  window.dispatchEvent(new CustomEvent('open-contact-modal'));
};
