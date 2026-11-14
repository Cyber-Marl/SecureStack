import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './PrivacyPolicy.css';

const LAST_UPDATED = 'October 11, 2026';

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service — Secure Stack Enterprise Solutions"
        description="Terms of Service governing the use of SecureStack software development, cybersecurity, and cloud engineering services."
        path="/terms-of-service"
      />
      <div className="pp-hero">
        <div className="container">
          <p className="section-label">Legal</p>
          <h1 className="pp-title">Terms of Service</h1>
          <p className="pp-meta">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="container pp-body">
        <section className="pp-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client", "User", or "you")
            and <strong>Secure Stack Enterprise Solutions</strong> ("SecureStack", "we", "our", or "us"), concerning your access
            to and use of the{' '}
            <a href="https://securestack.co.zw" target="_blank" rel="noreferrer">
              securestack.co.zw
            </a>{' '}
            website and any related consulting, software engineering, cybersecurity, or cloud infrastructure services (collectively, the "Services").
          </p>
          <p>
            By accessing our website or engaging our Services, you represent that you have read, understood, and agree to be bound
            by these Terms. If you do not agree, you must discontinue use of our site and Services immediately.
          </p>
        </section>

        <section className="pp-section">
          <h2>2. Services &amp; Scope of Work</h2>
          <p>
            SecureStack provides specialized IT solutions including, but not limited to:
          </p>
          <ul>
            <li>Custom software and web application engineering (.NET, Python, Node.js, PHP, React)</li>
            <li>Cybersecurity assessments, vulnerability audits, and ethical penetration testing</li>
            <li>Cloud migration, architecture optimization, and DevOps automation (AWS, Azure)</li>
            <li>IT compliance consulting and security policy roadmap development</li>
          </ul>
          <p>
            Specific deliverables, project milestones, pricing, and schedules for client projects are governed by a mutually
            executed Statement of Work (SOW) or Master Services Agreement (MSA), which incorporates these Terms by reference.
          </p>
        </section>

        <section className="pp-section">
          <h2>3. Intellectual Property Rights</h2>
          <p>
            <strong>Our Proprietary Materials:</strong> Unless otherwise agreed in writing, all pre-existing software libraries,
            proprietary frameworks, website content, trademarks, designs, and brand collateral remain the exclusive property of SecureStack.
          </p>
          <p>
            <strong>Client Work Product:</strong> Upon full and final settlement of all agreed fees specified in the governing SOW,
            custom code, bespoke designs, and project deliverables created specifically for the Client shall transfer to the Client,
            subject to standard open-source licensing terms for third-party dependencies utilized.
          </p>
        </section>

        <section className="pp-section">
          <h2>4. Confidentiality &amp; Non-Disclosure</h2>
          <p>
            We take confidentiality with utmost seriousness:
          </p>
          <ul>
            <li>Both parties agree to treat all proprietary technical specifications, source code, business data, and security audit findings as strictly confidential.</li>
            <li>At Client request, we enter into a bilateral Non-Disclosure Agreement (NDA) prior to reviewing sensitive source code or infrastructure.</li>
            <li>Confidentiality obligations survive termination of these Terms and any project engagement for a period of five (5) years.</li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>5. Cybersecurity Assessments &amp; Authorization</h2>
          <p>
            For any penetration testing, vulnerability assessment, or security review:
          </p>
          <ul>
            <li>The Client represents and warrants that they are the legal owner or authorized custodian of all systems, IP addresses, and domains submitted for evaluation.</li>
            <li>Client expressly authorizes SecureStack to conduct simulated security tests within agreed rules of engagement.</li>
            <li>Automated web scanner tools on our site provide indicative, non-exhaustive hygiene diagnostics and do not substitute for formal, authorized penetration tests.</li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>6. Warranties &amp; Disclaimers</h2>
          <p>
            We provide our website and exploratory tools on an "AS IS" and "AS AVAILABLE" basis. While we strive for uncompromising
            engineering rigor and security excellence, no digital system can be guaranteed 100% immune from zero-day threats or external vulnerabilities.
          </p>
          <p>
            To the maximum extent permitted by applicable law, SecureStack disclaims all other warranties, whether express, implied,
            statutory, or otherwise, including warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section className="pp-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall SecureStack, its directors, employees, or partners be liable for any indirect, consequential,
            punitive, or incidental damages, including loss of profits, data, or business interruption, arising out of the use
            or inability to use our services or website.
          </p>
          <p>
            Our aggregate liability under any contracted project shall be strictly capped at the total fees actually paid by the
            Client to SecureStack under the applicable Statement of Work during the three (3) months preceding the claim.
          </p>
        </section>

        <section className="pp-section">
          <h2>8. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms and any contractual disputes shall be governed by and construed in accordance with the laws of Zimbabwe,
            without regard to its conflict of law principles. Any dispute arising out of or in connection with these Terms shall
            be subject to the exclusive jurisdiction of the competent courts of Harare, Zimbabwe.
          </p>
        </section>

        <section className="pp-section">
          <h2>9. Privacy &amp; Data Protection</h2>
          <p>
            Your submission of personal information through the website or Services is governed by our{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>, which complies with applicable data protection legislation.
          </p>
        </section>

        <section className="pp-section">
          <h2>10. Contact Information</h2>
          <div className="pp-contact">
            <p>If you have any questions regarding these Terms of Service, please reach out to us:</p>
            <p>
              <strong>Secure Stack Enterprise Solutions</strong><br />
              Harare, Zimbabwe<br />
              Email: <a href="mailto:info@securestack.co.zw">info@securestack.co.zw</a><br />
              Phone: <a href="tel:+263775634182">+263 77 563 4182</a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
