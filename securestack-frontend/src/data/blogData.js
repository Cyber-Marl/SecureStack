/**
 * blogData.js
 * 
 * Static JSON-based database for SecureStack resources & insights.
 * Used to power the Blog and Blog Detail views.
 */

export const blogPosts = [
  {
    slug: 'demystifying-dmarc-spf-dkim-email-security',
    title: 'Demystifying DMARC, SPF, and DKIM: The Core Pillars of Domain Security',
    excerpt: 'Is your business domain protected against email spoofing? Learn how DMARC, SPF, and DKIM work together to shield your brand from phishing campaigns and logical domain abuse.',
    date: 'June 01, 2026',
    author: 'T. Mandizha, Lead Security Researcher',
    readTime: '6 min read',
    category: 'Cybersecurity',
    tags: ['Email Security', 'DMARC', 'Compliance'],
    seoTitle: 'What is DMARC, SPF, and DKIM? Email Security Guide',
    seoDesc: 'Complete guide explaining DMARC, SPF, and DKIM DNS records. Learn how domain verification stops email spoofing and phishing attacks on your business domain.',
    keywords: 'DMARC record, SPF email security, DKIM explanation, domain spoofing prevention, email phishing Harare',
    content: `
      <h2>The Rising Threat of Domain Spoofing</h2>
      <p>Email remains the primary vector for cyberattacks, accounting for over 90% of initial access points in corporate breaches. One of the most dangerous forms of email abuse is <strong>domain spoofing</strong>—when an attacker sends an email that appears to originate from your exact corporate domain (e.g., <code>ceo@yourcompany.com</code>).</p>
      <p>Without proper DNS authentication protocols, receiving email servers cannot verify if an email actually came from your authorized servers or an external attacker. This is where <strong>SPF</strong>, <strong>DKIM</strong>, and <strong>DMARC</strong> come in.</p>

      <h2>1. SPF (Sender Policy Framework): The Guest List</h2>
      <p>Think of SPF as a guest list for your domain. It is a text (TXT) record published in your DNS that specifies exactly which IP addresses and mail servers are authorized to send emails on your domain's behalf.</p>
      <p>When an email server receives a message claiming to be from your domain, it looks up your SPF record. If the sending IP address isn't on the guest list, the SPF check fails.</p>
      <p><strong>Limit of SPF:</strong> SPF only checks the "Return-Path" address, not the "From" address visible to the end user. Furthermore, SPF records can easily break when emails are forwarded.</p>

      <h2>2. DKIM (DomainKeys Identified Mail): The Digital Seal</h2>
      <p>DKIM adds a cryptographic signature to the header of every outbound email. This signature acts as a tamper-proof wax seal. The signature is created using a private key on your outbound mail server, and receiving servers verify it using a public key published in your DNS.</p>
      <p>If the message content is altered in transit, the cryptographic signature becomes invalid, failing the DKIM verification check.</p>

      <h2>3. DMARC (Domain-based Message Authentication, Reporting, and Conformance): The Guard</h2>
      <p>DMARC is the policy controller that binds SPF and DKIM together. It tells receiving servers exactly what to do if an email fails SPF or DKIM checks. A DMARC record specifies one of three policies:</p>
      <ul>
        <li><strong>p=none (Monitoring):</strong> The email is delivered normally, but reports are sent to the domain owner. Ideal for initial audits.</li>
        <li><strong>p=quarantine (Soft Reject):</strong> The email is accepted but flagged and sent directly to the recipient's Spam/Junk folder.</li>
        <li><strong>p=reject (Hard Reject):</strong> The email is completely blocked at the server level, never reaching the recipient. This is the gold standard of domain protection.</li>
      </ul>

      <h2>Why This Matters for Zimbabwe Businesses</h2>
      <p>Major email providers (like Google and Yahoo) now strictly enforce DMARC. Domains sending bulk email without valid SPF/DMARC authentication are automatically blocked or marked as spam. Hardening your DNS records is no longer optional—it is a critical requirement for both email deliverability and brand reputation.</p>
      
      <div class="blog-callout">
        <h4>Audit Your Domain Instantly</h4>
        <p>Want to see if your domain is properly configured? Head over to our <a href="/security-compliance">Security & Compliance scanner</a> to run a free audit of your SPF, DMARC, and MX records in seconds.</p>
      </div>
    `
  },
  {
    slug: 'owasp-top-10-web-development-pitfalls',
    title: 'OWASP Top 10: Designing and Building Secure Web Applications from Day One',
    excerpt: 'Security is not an afterthought. Explore the most common web application vulnerabilities—including SQL injection, XSS, and broken access controls—and how to write code to prevent them.',
    date: 'May 25, 2026',
    author: 'K. Sibanda, Senior Software Engineer',
    readTime: '8 min read',
    category: 'Development',
    tags: ['Secure Coding', 'Web Dev', 'OWASP'],
    seoTitle: 'OWASP Top 10 Web Security & Mitigation Guide',
    seoDesc: 'Learn how to protect your custom web applications against the OWASP Top 10 vulnerabilities. Secure coding guidelines for secure software engineering.',
    keywords: 'OWASP Top 10, web application security, SQL injection fix, XSS prevention, secure software development Zimbabwe',
    content: `
      <h2>Security-First Engineering: Beyond Firewalls</h2>
      <p>Historically, software developers wrote code and left security to network administrators to handle via firewalls and intrusion prevention systems. Today, with complex APIs and cloud microservices, this perimeter-only defense is obsolete. Applications must be self-securing, built on secure software engineering principles.</p>
      <p>The <strong>OWASP (Open Web Application Security Project) Top 10</strong> is the definitive list of the most critical security risks to web applications. Let's look at the top three vulnerabilities and how to fix them.</p>

      <h2>1. Broken Access Control</h2>
      <p>Access control ensures users cannot act outside their intended permissions. Broken access control leads to unauthorized disclosure, modification, or destruction of data.</p>
      <p><strong>The Flaw:</strong> Trusting client-side parameters. For example, assuming a user cannot view someone else's account details by simply changing the account ID parameter in the URL from <code>/api/accounts/12</code> to <code>/api/accounts/13</code>.</p>
      <p><strong>The Fix:</strong> Always perform authorization checks server-side on every request, verifying that the authenticated user session actually owns the requested resource.</p>

      <h2>2. Cryptographic Failures</h2>
      <p>Previously known as "Sensitive Data Exposure," this involves failing to properly protect data at rest and in transit.</p>
      <p><strong>The Flaw:</strong> Using weak encryption algorithms (like MD5 or SHA1 for passwords) or failing to enforce HTTPS, allowing attackers to sniff cleartext credentials on public Wi-Fi networks.</p>
      <p><strong>The Fix:</strong> Enforce TLS 1.3 for all HTTP traffic. Hash passwords using strong adaptive hashing functions (like <code>bcrypt</code> or <code>Argon2</code>) with unique salts, and never store secrets or database credentials in public source code repositories.</p>

      <h2>3. Injection (SQLi & XSS)</h2>
      <p>Injection occurs when untrusted user input is directly concatenated into an interpreter (such as a database query or browser rendering block) without sanitization.</p>
      <ul>
        <li><strong>SQL Injection:</strong> When an attacker injects SQL commands into input fields to read or drop databases.</li>
        <li><strong>Cross-Site Scripting (XSS):</strong> When an attacker injects malicious JavaScript into user inputs that are subsequently rendered and executed in other users' browsers.</li>
      </ul>
      <p><strong>The Fix:</strong> Never use string concatenation to build database queries. Always use <strong>Parameterized Queries / Prepared Statements</strong> (using modern ORMs like Django ORM or Entity Framework). For XSS, context-aware input escaping and a strict Content Security Policy (CSP) are your best defenses.</p>

      <h2>Secure SDLC: The Ultimate Remedy</h2>
      <p>The cost of fixing a vulnerability in production is up to 100 times higher than catching it during the design phase. By adopting a Secure Software Development Life Cycle (SDLC) that embeds security threat modeling, static testing (SAST), and penetration tests into your pipeline, you construct resilient systems that stand up to attackers.</p>
    `
  },
  {
    slug: 'aws-cloud-security-checklist-african-enterprises',
    title: 'Migrating to AWS Safely: A Cloud Security Checklist for African Enterprises',
    excerpt: 'Migrating workloads to AWS or Azure? Discover the Shared Responsibility Model and our step-by-step checklist to avoid leaky storage buckets and misconfigured credentials.',
    date: 'May 14, 2026',
    author: 'A. Nyoni, Lead Cloud Solutions Architect',
    readTime: '7 min read',
    category: 'Cloud & DevOps',
    tags: ['AWS', 'Cloud Security', 'DevOps'],
    seoTitle: 'AWS Cloud Security Checklist for Secure Migrations',
    seoDesc: 'Ensure a secure cloud migration with our AWS security checklist. Learn the Shared Responsibility Model, IAM hardening, and VPC isolating practices.',
    keywords: 'AWS cloud security, cloud migration checklist, IAM roles, secure cloud hosting Zimbabwe, Terraform DevOps',
    content: `
      <h2>The Promise and Peril of the Cloud</h2>
      <p>Cloud migration offers Zimbabwean and African enterprises unprecedented agility, scaling, and redundancy. However, moving to the cloud without adjusting security practices leads to disastrous misconfigurations—the #1 source of cloud breaches globally.</p>
      <p>Before launching a single virtual server, it is vital to understand the <strong>AWS Shared Responsibility Model</strong>:</p>
      <blockquote>
        AWS is responsible for the security <strong>of</strong> the cloud (physical infrastructure, power, virtualization layer). You are responsible for the security of data <strong>in</strong> the cloud (OS patches, firewall configurations, IAM policies, and access controls).
      </blockquote>

      <h2>Cloud Hardening: The Initial Deployment Checklist</h2>
      
      <h3>1. Harden Identity & Access Management (IAM)</h3>
      <p>Identity is the new security perimeter in the cloud. The AWS root account should never be used for daily tasks.</p>
      <ul>
        <li><strong>Enable MFA:</strong> Enforce Multi-Factor Authentication on all administrative and IAM user accounts immediately.</li>
        <li><strong>Least Privilege:</strong> Assign granular IAM roles. Developers should only have access to resources they require for execution, preventing accidental broad overrides.</li>
        <li><strong>Disable Static Access Keys:</strong> Use AWS IAM Identity Center or temporary short-term credentials instead of long-lived access keys in codebases.</li>
      </ul>

      <h3>2. Secure Your Virtual Private Cloud (VPC)</h3>
      <p>Never expose database instances directly to the public internet.</p>
      <ul>
        <li><strong>Decouple Network Layers:</strong> Structure your VPC with isolated public and private subnets. Place web routers in public subnets, and database systems in private subnets with no public IP routes.</li>
        <li><strong>Lock Security Groups:</strong> Set firewall-like Security Groups to restrict traffic to specific ports and source IPs (e.g., database port 5432 should only accept connections from the application server's security group).</li>
      </ul>

      <h3>3. Encrypt and Audit Everything</h3>
      <p>AWS provides built-in encryption mechanisms that should be turned on by default.</p>
      <ul>
        <li><strong>Enable Storage Encryption:</strong> Encrypt all EBS volumes, RDS databases, and S3 buckets at rest using AWS KMS (Key Management Service).</li>
        <li><strong>Audit Logging:</strong> Enable <strong>AWS CloudTrail</strong> to record all API actions across your accounts, and configure Amazon GuardDuty for automated threat detection logs.</li>
      </ul>

      <h2>Automation: The DevOps Solution</h2>
      <p>Managing cloud security manually via the AWS Console is prone to human error. Enterprises should adopt <strong>Infrastructure as Code (IaC)</strong> using tools like <strong>Terraform</strong>. By writing your servers, VPCs, and IAM groups as code, security configurations are version-controlled, testable, and consistently deployed, eliminating manual security misconfigurations.</p>
    `
  },
  {
    slug: 'fortify-your-web-assets-a-deep-dive-into-hsts-for-unwavering-security',
    title: 'Fortify Your Web Assets: A Deep Dive into HSTS for Unwavering Security',
    excerpt: 'HTTP Strict Transport Security (HSTS) is a critical security policy that forces web browsers to interact with your website using only secure HTTPS connections, eliminating an entire class of man-in-the-middle attacks. Learn how to implement it effectively to safeguard your users.',
    date: 'June 22, 2026',
    author: 'SecureStack Research Team',
    readTime: '8 min read',
    category: 'Cybersecurity',
    tags: ['HSTS', 'Web Security', 'HTTPS', 'SSL/TLS', 'Cybersecurity'],
    seoTitle: 'Implement HSTS: Force HTTPS & Prevent MITM | SecureStack',
    seoDesc: 'Learn to implement HTTP Strict Transport Security (HSTS) with Nginx & Apache examples. Force HTTPS, prevent SSL stripping, and boost your website\'s security.',
    keywords: 'HSTS, HTTPS security, SSL stripping, web security, Nginx HSTS, Apache HSTS',
    content: `
      <h2>The Unseen Threat: Why HTTP is Not Enough</h2>
      <p>In today's interconnected digital landscape, the security of web communication is paramount. We all know that <a href="https://securestack.co.zw/services/ssl-tls-implementation">HTTPS</a>, the secure version of HTTP, is essential. It encrypts data, verifies server identity, and protects against eavesdropping and tampering. However, simply having an SSL/TLS certificate and serving your website over HTTPS isn't a complete solution on its own. The initial connection from a user's browser to your server often starts as plain HTTP before being redirected to HTTPS — and that brief window of vulnerability is precisely where attackers strike.</p>
      <p>This attack vector, known as <strong>SSL Stripping</strong> or an <strong>HTTP Downgrade Attack</strong>, allows a malicious actor positioned between the user and server (a classic Man-in-the-Middle attack) to intercept the initial unencrypted HTTP request and silently relay plain HTTP between the user and the actual HTTPS server. The user believes they are on a secure connection, but their data is being transmitted in plaintext. Enter <strong>HTTP Strict Transport Security (HSTS)</strong>.</p>

      <h2>What is HSTS?</h2>
      <p>HSTS is a web security policy mechanism that helps protect websites against protocol downgrade attacks and cookie hijacking. It allows web servers to declare that web browsers (or other complying user agents) should only interact with it using secure HTTPS connections, and <em>never</em> via the insecure HTTP protocol.</p>
      <p>HSTS is implemented via an HTTP response header: <code>Strict-Transport-Security</code>. When a browser receives this header from a website, it records the policy and, for a specified period, will automatically upgrade all future requests to that domain from HTTP to HTTPS before even sending them — completely bypassing any potential Man-in-the-Middle interception point.</p>

      <h2>Anatomy of the HSTS Header</h2>
      <p>The <code>Strict-Transport-Security</code> header has three key directives:</p>
      <ul>
        <li><code>max-age</code>: (Required) The duration in seconds for which the browser should remember and enforce this HSTS policy. A common value is <code>31536000</code> seconds (1 year).</li>
        <li><code>includeSubDomains</code>: An optional directive. If present, the HSTS policy applies to all subdomains of the current domain as well. This is highly recommended for comprehensive protection.</li>
        <li><code>preload</code>: Another optional directive. This signifies your consent for your domain to be included in the HSTS Preload List — a hardcoded list of HSTS-enabled websites built directly into major web browsers.</li>
      </ul>
      <pre><code>Strict-Transport-Security: max-age=31536000; includeSubDomains; preload</code></pre>

      <h2>Why HSTS is Non-Negotiable for Modern Web Security</h2>
      <ul>
        <li><strong>Eliminates SSL Stripping Attacks:</strong> Without HSTS, an attacker can downgrade a user's HTTPS connection to plain HTTP, intercepting sensitive data. HSTS prevents this by forcing all communication to be HTTPS.</li>
        <li><strong>Prevents Cookie Hijacking:</strong> By ensuring all communication is encrypted, HSTS makes it significantly harder for attackers to capture session cookies over insecure HTTP connections.</li>
        <li><strong>Guards Against Unintended HTTP Fallback:</strong> HSTS ensures legacy HTTP links are immediately converted to HTTPS.</li>
        <li><strong>Enhances Trust and User Experience:</strong> The browser handles the upgrade automatically and securely.</li>
      </ul>

      <h2>Implementing HSTS: Practical Configuration Examples</h2>
      <p>Before implementing HSTS, ensure your website has a valid SSL/TLS certificate and is fully functional over HTTPS.</p>

      <h3>Nginx Configuration</h3>
      <pre><code class="language-nginx">server {
    listen 443 ssl;
    server_name yourwebsite.com www.yourwebsite.com;

    # Add the HSTS header
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
}

# Ensure all HTTP traffic redirects to HTTPS
server {
    listen 80;
    server_name yourwebsite.com www.yourwebsite.com;
    return 301 https://$host$request_uri;
}</code></pre>

      <h3>Apache Configuration</h3>
      <pre><code class="language-apache">&lt;VirtualHost *:443&gt;
    ServerName yourwebsite.com
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
&lt;/VirtualHost&gt;

&lt;VirtualHost *:80&gt;
    ServerName yourwebsite.com
    Redirect permanent / https://yourwebsite.com/
&lt;/VirtualHost&gt;</code></pre>

      <h2>Understanding the HSTS Preload List</h2>
      <p>The <code>preload</code> directive is for domains that wish to be included in the HSTS Preload List — a list distributed with major browsers so they always connect to preloaded domains via HTTPS, even on the very first visit. This eliminates the "trust on first use" problem entirely. Only consider preloading after your HSTS policy has been stable with a high <code>max-age</code> and <code>includeSubDomains</code> for an extended period.</p>

      <div class="blog-callout">
        <h4>Secure Your Stack with SecureStack</h4>
        <p>Implementing HSTS is a fundamental step, but just one piece of the puzzle. Visit <a href="https://securestack.co.zw">securestack.co.zw</a> to explore how our expert team can conduct a comprehensive domain security audit and help you build an impregnable online fortress for your business.</p>
      </div>
    `
  }
];
