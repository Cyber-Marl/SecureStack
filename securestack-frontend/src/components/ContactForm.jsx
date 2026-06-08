import { useState, useRef } from 'react';
import axios from 'axios';
import './ContactForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [nda, setNda] = useState(false);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files);
    // Limit to max 3 files, each under 3MB
    const validFiles = selectedFiles.filter(f => f.size <= 3 * 1024 * 1024).slice(0, 3);
    setFiles(validFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    
    const referrer_code = localStorage.getItem('securestack_ref') || null;

    // Build submit form payload (standard JSON)
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: nda ? 'NDA Requested' : 'General Inquiry',
      message: form.message,
      referrer_code: referrer_code,
    };

    try {
      await axios.post(`${API_URL}/contact/`, payload);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setFiles([]);
      setNda(false);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="cf-card cf-success-state">
        <div className="cf-success-icon">✓</div>
        <h3>Request Sent Successfully!</h3>
        <p>Thank you for reaching out to SecureStack. An expert will analyze your requirements and contact you within 24 hours.</p>
        <button className="btn btn-primary cf-cta-reset" onClick={() => setStatus('idle')}>Send Another Request</button>
      </div>
    );
  }

  return (
    <div className="cf-card">
      <form onSubmit={handleSubmit} className="cf-premium-form">
        <div className="cf-field">
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            placeholder=" " 
            className="cf-underline-input"
            id="cf-name"
          />
          <label htmlFor="cf-name" className="cf-floating-label">* Name</label>
        </div>

        <div className="cf-field">
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            placeholder=" " 
            className="cf-underline-input"
            id="cf-email"
          />
          <label htmlFor="cf-email" className="cf-floating-label">* Corporate E-mail</label>
        </div>

        <div className="cf-field">
          <input 
            type="tel" 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder=" " 
            className="cf-underline-input"
            id="cf-phone"
          />
          <label htmlFor="cf-phone" className="cf-floating-label">Phone number</label>
        </div>

        <div className="cf-field">
          <textarea 
            name="message" 
            value={form.message} 
            onChange={handleChange} 
            required 
            placeholder=" " 
            className="cf-underline-textarea"
            id="cf-message"
            rows={1}
          />
          <label htmlFor="cf-message" className="cf-floating-label">* Describe your project requirements</label>
        </div>

        {/* Attach File Block */}
        <div className="cf-file-wrapper">
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            ref={fileInputRef} 
            style={{ display: 'none' }}
            accept=".doc,.docx,.pdf,.ppt,.pptx"
          />
          <button type="button" className="cf-attach-btn" onClick={triggerFileSelect}>
            <span className="cf-paperclip">📎</span> Attach file
          </button>
          
          {files.length > 0 ? (
            <div className="cf-file-list">
              {files.map(f => (
                <span key={f.name} className="cf-file-tag">{f.name} ({(f.size / 1024 / 1024).toFixed(2)}MB)</span>
              ))}
            </div>
          ) : (
            <p className="cf-file-caption">
              No more than 3 files may be attached up to 3MB each. <br/>
              Formats: doc, docx, pdf, ppt, pptx.
            </p>
          )}
        </div>

        {/* NDA Checkbox */}
        <div className="cf-nda-wrapper">
          <label className="cf-checkbox-label">
            <input 
              type="checkbox" 
              checked={nda} 
              onChange={e => setNda(e.target.checked)} 
              className="cf-checkbox"
            />
            <span className="cf-checkbox-text">
              I want to protect my data by signing an NDA. <span className="cf-info-icon" title="Non-Disclosure Agreement ensures strict confidentiality.">ⓘ</span>
            </span>
          </label>
        </div>

        {status === 'error' && <p className="cf-error">{error}</p>}

        {/* Submit Block */}
        <div className="cf-submit-row">
          <button type="submit" className="cf-submit-btn" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send request'}
          </button>
          <div className="cf-privacy-badge">
            <span className="cf-shield-check">✓</span> Your privacy is protected
          </div>
        </div>
      </form>
    </div>
  );
}
