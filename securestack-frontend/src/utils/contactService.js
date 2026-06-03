/**
 * contactService.js
 * 
 * A clean client-side contact submission utility.
 * Supports Web3Forms, EmailJS, and a smooth Mock fallback for offline/demo use.
 */

import axios from 'axios';

// Get credentials from environment variables
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Submits contact form data client-side.
 * 
 * @param {Object} data Form fields
 * @param {string} data.name Sender's name
 * @param {string} data.email Sender's email
 * @param {string} data.phone Sender's phone (optional)
 * @param {string} data.service Service requested
 * @param {string} data.message Message/requirements
 * @param {Array<File>} data.files Optional attached files
 * @param {boolean} data.nda Whether NDA was requested
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitContactForm({ name, email, phone = '', service = '', message = '', files = [], nda = false }) {
  // 1. Identify which service is configured
  const hasWeb3Forms = WEB3FORMS_KEY && WEB3FORMS_KEY !== 'your_key_here';
  const hasEmailJS = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY &&
                     EMAILJS_SERVICE_ID !== 'your_service_id_here';

  console.log('[ContactService] Initiating submission...', {
    hasWeb3Forms,
    hasEmailJS,
    name,
    email,
    phone,
    service,
    nda,
    attachmentsCount: files.length
  });

  // --- PATH A: WEB3FORMS ---
  if (hasWeb3Forms) {
    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone || 'Not Provided');
      formData.append('subject', `SecureStack - Inquiry from ${name} (${service})`);
      formData.append('service', service);
      formData.append('nda_requested', nda ? 'Yes' : 'No');
      formData.append('message', message);
      formData.append('from_name', 'SecureStack B2B Portal');

      // Attach files if any
      files.slice(0, 3).forEach((file, index) => {
        formData.append(`attachment_${index + 1}`, file);
      });

      const response = await axios.post('https://api.web3forms.com/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.success) {
        return { success: true, message: 'Message sent successfully via Web3Forms!' };
      } else {
        throw new Error(response.data?.message || 'Web3Forms submission failed');
      }
    } catch (err) {
      console.error('[ContactService] Web3Forms error:', err);
      throw new Error(err.message || 'Failed to deliver message via Web3Forms. Please try again.');
    }
  }

  // --- PATH B: EMAILJS ---
  if (hasEmailJS) {
    try {
      // EmailJS REST API
      const payload = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: name,
          from_email: email,
          phone: phone || 'Not Provided',
          service: service,
          nda: nda ? 'Yes' : 'No',
          message: message
        }
      };

      const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload);
      if (response.status === 200 || response.data === 'OK') {
        return { success: true, message: 'Message sent successfully via EmailJS!' };
      } else {
        throw new Error(typeof response.data === 'string' ? response.data : 'EmailJS submission failed');
      }
    } catch (err) {
      console.error('[ContactService] EmailJS error:', err);
      throw new Error(err.response?.data || err.message || 'Failed to deliver message via EmailJS. Please try again.');
    }
  }

  // --- PATH C: MOCK FALLBACK (Demo/Dev mode) ---
  console.warn(
    '[ContactService] No contact email provider keys configured (VITE_WEB3FORMS_KEY or VITE_EMAILJS_*).\n' +
    'Falling back to secure client-side Mock submission for demonstration purposes.'
  );

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Log receipt for testing/verification
  console.log('%c[MOCK CONTACT SUBMISSION RECEIVED]', 'color: #00ffcc; font-weight: bold;', {
    name,
    email,
    phone,
    service,
    nda,
    message,
    files: files.map(f => ({ name: f.name, size: `${(f.size / 1024 / 1024).toFixed(2)}MB` }))
  });

  return {
    success: true,
    message: 'Demo Mode: Submission processed successfully. Set VITE_WEB3FORMS_KEY in .env to receive live emails!'
  };
}
