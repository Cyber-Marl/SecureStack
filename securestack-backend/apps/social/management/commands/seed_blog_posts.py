from django.core.management.base import BaseCommand
from apps.social.models import BlogPost

class Command(BaseCommand):
    help = "Seeds initial blog posts from the static front-end dataset to shift the site to a dynamic CMS database."

    def handle(self, *args, **options):
        posts = [
            {
                'slug': 'demystifying-dmarc-spf-dkim-email-security',
                'title': 'Demystifying DMARC, SPF, and DKIM: The Core Pillars of Domain Security',
                'excerpt': 'Is your business domain protected against email spoofing? Learn how DMARC, SPF, and DKIM work together to shield your brand from phishing campaigns and logical domain abuse.',
                'date': 'June 01, 2026',
                'author': 'T. Mandizha, Lead Security Researcher',
                'read_time': '6 min read',
                'category': 'Cybersecurity',
                'tags': 'Email Security, DMARC, Compliance',
                'seo_title': 'What is DMARC, SPF, and DKIM? Email Security Guide',
                'seo_desc': 'Complete guide explaining DMARC, SPF, and DKIM DNS records. Learn how domain verification stops email spoofing and phishing attacks on your business domain.',
                'keywords': 'DMARC record, SPF email security, DKIM explanation, domain spoofing prevention, email phishing Harare',
                'content': """
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
                """
            },
            {
                'slug': 'owasp-top-10-web-development-pitfalls',
                'title': 'OWASP Top 10: Designing and Building Secure Web Applications from Day One',
                'excerpt': 'Security is not an afterthought. Explore the most common web application vulnerabilities—including SQL injection, XSS, and broken access controls—and how to write code to prevent them.',
                'date': 'May 25, 2026',
                'author': 'K. Sibanda, Senior Software Engineer',
                'read_time': '8 min read',
                'category': 'Development',
                'tags': 'Secure Coding, Web Dev, OWASP',
                'seo_title': 'OWASP Top 10 Web Security & Mitigation Guide',
                'seo_desc': 'Learn how to protect your custom web applications against the OWASP Top 10 vulnerabilities. Secure coding guidelines for secure software engineering.',
                'keywords': 'OWASP Top 10, web application security, SQL injection fix, XSS prevention, secure software development Zimbabwe',
                'content': """
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
                """
            },
            {
                'slug': 'aws-cloud-security-checklist-african-enterprises',
                'title': 'Migrating to AWS Safely: A Cloud Security Checklist for African Enterprises',
                'excerpt': 'Migrating workloads to AWS or Azure? Discover the Shared Responsibility Model and our step-by-step checklist to avoid leaky storage buckets and misconfigured credentials.',
                'date': 'May 14, 2026',
                'author': 'A. Nyoni, Lead Cloud Solutions Architect',
                'read_time': '7 min read',
                'category': 'Cloud & DevOps',
                'tags': 'AWS, Cloud Security, DevOps',
                'seo_title': 'AWS Cloud Security Checklist for Secure Migrations',
                'seo_desc': 'Ensure a secure cloud migration with our AWS security checklist. Learn the Shared Responsibility Model, IAM hardening, and VPC isolating practices.',
                'keywords': 'AWS cloud security, cloud migration checklist, IAM roles, secure cloud hosting Zimbabwe, Terraform DevOps',
                'content': """
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
                """
            }
        ]

        for post_data in posts:
            post_data['status'] = 'PUBLISHED'
            post, created = BlogPost.objects.update_or_create(
                slug=post_data['slug'],
                defaults=post_data
            )
            status_text = "created" if created else "updated"
            self.stdout.write(f"Successfully {status_text} post: {post.title}")

        self.stdout.write("Database seeding complete!")
