import SEO from '../components/SEO';
import './PrivacyPolicy.css';

const LAST_UPDATED = 'June 13, 2025';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy — Secure Stack Enterprise Solutions"
        description="Privacy Policy for Secure Stack Enterprise Solutions. Learn how we collect, use, and protect your personal data."
        path="/privacy-policy"
      />
      <div className="pp-hero">
        <div className="container">
          <p className="section-label">Legal</p>
          <h1 className="pp-title">Privacy Policy</h1>
          <p className="pp-meta">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="container pp-body">

        <section className="pp-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Secure Stack Enterprise Solutions</strong> ("we", "our", or "us").
            We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website{' '}
            <a href="https://securestack.co.zw" target="_blank" rel="noreferrer">
              securestack.co.zw
            </a>{' '}
            or engage with our services.
          </p>
          <p>
            Please read this policy carefully. If you disagree with its terms, please discontinue
            use of our site. For questions, contact us at{' '}
            <a href="mailto:info@securestack.co.zw">info@securestack.co.zw</a>.
          </p>
        </section>

        <section className="pp-section">
          <h2>2. Information We Collect</h2>
          <p>We may collect the following categories of information:</p>
          <h3>2.1 Information You Provide Directly</h3>
          <ul>
            <li>Name, email address, phone number (via contact or inquiry forms)</li>
            <li>Company name and job title</li>
            <li>Project details and requirements submitted through our estimator tools</li>
            <li>Messages and communications sent to us</li>
          </ul>
          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>IP address and browser type</li>
            <li>Pages visited and time spent on our website</li>
            <li>Referring URLs and traffic sources</li>
            <li>Device type and operating system</li>
          </ul>
          <h3>2.3 Cookies &amp; Tracking Technologies</h3>
          <p>
            We use cookies and similar tracking technologies to improve your browsing experience,
            analyse site traffic, and understand where our visitors come from. You can instruct
            your browser to refuse all cookies or indicate when a cookie is being sent.
          </p>
        </section>

        <section className="pp-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your enquiries and provide requested services</li>
            <li>Send project proposals, quotes, and service information</li>
            <li>Improve and optimise our website and services</li>
            <li>Monitor website analytics and user behaviour patterns</li>
            <li>Comply with legal obligations</li>
            <li>Send periodic marketing communications (only with your consent)</li>
            <li>Detect and prevent fraudulent or malicious activity</li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>4. Sharing Your Information</h2>
          <p>
            We do <strong>not</strong> sell, trade, or rent your personal information to third
            parties. We may share your data only in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Trusted third-party vendors who assist in
              operating our website (e.g. hosting, analytics, email delivery) — bound by
              confidentiality agreements.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law, court order, or
              governmental authority.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale
              of company assets.
            </li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>5. Data Security</h2>
          <p>
            As a cybersecurity company, we apply industry-leading security practices to protect
            your personal data. These include:
          </p>
          <ul>
            <li>SSL/TLS encryption for all data in transit</li>
            <li>Secure servers with restricted access controls</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Staff training on data handling and protection</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. While we strive
            to use commercially acceptable means to protect your data, we cannot guarantee its
            absolute security.
          </p>
        </section>

        <section className="pp-section">
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfil the purposes
            outlined in this policy, unless a longer retention period is required by law. When
            data is no longer needed, it is securely deleted or anonymised.
          </p>
        </section>

        <section className="pp-section">
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent at any time (where processing is based on consent)</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:info@securestack.co.zw">info@securestack.co.zw</a>.
          </p>
        </section>

        <section className="pp-section">
          <h2>8. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for
            the privacy practices or content of those sites. We encourage you to review the
            privacy policies of any external sites you visit.
          </p>
        </section>

        <section className="pp-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not
            knowingly collect personal information from children. If you believe we have
            inadvertently collected such information, please contact us immediately.
          </p>
        </section>

        <section className="pp-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            significant changes by updating the "Last updated" date at the top of this page.
            We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="pp-section pp-contact">
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <div className="pp-contact-grid">
            <div>
              <strong>Secure Stack Enterprise Solutions</strong><br />
              Harare, Zimbabwe<br />
              <a href="https://securestack.co.zw" target="_blank" rel="noreferrer">www.securestack.co.zw</a>
            </div>
            <div>
              <a href="mailto:info@securestack.co.zw">info@securestack.co.zw</a><br />
              <a href="tel:+263775634182">+263 775 634 182</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
