import os
import random
import requests
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.social.models import LinkedInCredential, SocialPost

class Command(BaseCommand):
    help = "Generates an engaging marketing post using Gemini AI and posts it to LinkedIn."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Generate the post using Gemini but do not post to LinkedIn (logs as DRAFT)',
        )
        parser.add_argument(
            '--topic',
            type=str,
            default=None,
            help='Force a specific topic (cybersecurity, software_engineering, securestack_promo)',
        )

    def safe_stdout(self, msg):
        """Helper to write messages to stdout safely, handling encoding errors on Windows."""
        try:
            self.stdout.write(msg)
        except UnicodeEncodeError:
            # Fallback for Windows command prompt which might not support unicode emojis
            self.stdout.write(msg.encode('ascii', errors='replace').decode('ascii'))

    def safe_stderr(self, msg):
        """Helper to write messages to stderr safely, handling encoding errors on Windows."""
        try:
            self.stderr.write(msg)
        except UnicodeEncodeError:
            self.stderr.write(msg.encode('ascii', errors='replace').decode('ascii'))

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        forced_topic = options['topic']

        self.safe_stdout("Starting SecureStack Social Media Bot...")

        # 1. Fetch Gemini API Key
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        use_fallback = False
        if not gemini_api_key:
            self.safe_stdout("WARNING: GEMINI_API_KEY environment variable is not set. Falling back to local templates...")
            use_fallback = True

        # 2. Retrieve LinkedIn Credentials (unless dry-running without config)
        cred = LinkedInCredential.objects.first()
        if not dry_run and not cred:
            self.safe_stderr("ERROR: LinkedIn Credentials not found in database. Please run the OAuth flow first.")
            return

        # 3. Select topic and formulate content
        topics = {
            "cybersecurity": "A detailed security tip (e.g., DNS security, email spoofing protection, SSL/TLS certificates, HSTS, clickjacking, etc.) explaining why it matters and how to prevent it.",
            "software_engineering": "A software development/engineering best practice (e.g. clean code, secure coding principles, CI/CD pipeline security, secure dependency management, or devops security).",
            "securestack_promo": "A promotional post highlights SecureStack's services (especially our free instant domain scanner at securestack.co.zw, enterprise cybersecurity auditing, or email safety audits) showing how businesses can secure their web assets in seconds."
        }

        selected_topic_key = forced_topic if forced_topic in topics else random.choice(list(topics.keys()))
        self.safe_stdout(f"Selected Topic Category: {selected_topic_key.upper()}")

        fallback_templates = {
            "cybersecurity": (
                "🔒 Cybersecurity Tip: Auditing your domain security is crucial to protect your brand.\n\n"
                "DNS records like SPF (Sender Policy Framework), DKIM, and DMARC prevent attackers from spoofing your domain and impersonating your emails. Without them, phishing emails can easily be sent using your address, damaging client trust.\n\n"
                "👉 Audit your domain security headers and DNS setup in 10 seconds at: securestack.co.zw\n\n"
                "#Cybersecurity #WebSecurity #SecureStack #EmailSecurity #DNS"
            ),
            "software_engineering": (
                "💻 Software Engineering Best Practice: Secure your transport layer headers.\n\n"
                "Implementing security headers like HSTS (HTTP Strict Transport Security), CSP (Content Security Policy), and X-Frame-Options is simple yet highly effective in stopping XSS, Clickjacking, and packet sniffing attacks.\n\n"
                "Are your web apps secure? Verify your setup instantly at securestack.co.zw\n\n"
                "#SoftwareEngineering #WebDev #SecureStack #DevOps #SecurityHeaders"
            ),
            "securestack_promo": (
                "🚀 Audit your business cybersecurity posture instantly with SecureStack!\n\n"
                "We provide comprehensive automated analysis of SSL certificates, domain health, and email vulnerability indicators to keep your organization safe.\n\n"
                "🛡️ Start for free today at securestack.co.zw\n\n"
                "#SecureStack #Cybersecurity #SoftwareDevelopment #TechZimbabwe #EnterpriseSolutions"
            )
        }

        if use_fallback:
            post_content = fallback_templates[selected_topic_key]
            self.safe_stdout("Content generated from local fallback templates.")
        else:
            # Get last 5 posts to avoid repetition
            recent_posts = SocialPost.objects.filter(status='PUBLISHED')[:5]
            recent_texts = "\n".join([f"- {post.content[:100]}..." for post in recent_posts])

            selected_topic_desc = topics[selected_topic_key]
            prompt = f"""
You are the Lead Developer and Cybersecurity Advocate for "SecureStack Enterprise Solutions" (website: https://securestack.co.zw).
Write an engaging, professional, and high-impact LinkedIn post.

Topic: {selected_topic_desc}

Guidelines:
1. Make it informative, practical, and punchy.
2. Use bullet points or numbered lists where appropriate for readability.
3. Keep the tone professional, authoritative, yet approachable and developer-friendly.
4. Include 3-5 relevant hashtags (e.g., #Cybersecurity, #SoftwareEngineering, #WebSecurity, #SecureStack, #DevOps).
5. Always conclude with a clear Call To Action (CTA) pointing to SecureStack (e.g., "Scan your domain for vulnerabilities in seconds at securestack.co.zw" or "Secure your enterprise with us at securestack.co.zw").
6. Use subtle, professional emojis to make the layout clean and visually appealing.
7. Keep it under 2000 characters.

Here are the topics of recent posts we published (DO NOT repeat these specific points or copy their wording):
{recent_texts if recent_texts else "None (this is the first post)."}

Output ONLY the final post text. Do not include any intro, outro, markdown code block backticks, or explanations.
"""

            # 4. Generate post content with Gemini API
            self.safe_stdout("Generating content using Gemini AI...")
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            }
            headers = {"Content-Type": "application/json"}

            try:
                res = requests.post(gemini_url, json=payload, headers=headers, timeout=15)
                if res.status_code != 200:
                    self.safe_stderr(f"Gemini API returned error code {res.status_code}: {res.text}")
                    return
                
                res_data = res.json()
                post_content = res_data['candidates'][0]['content']['parts'][0]['text'].strip()
                
                # Clean markdown code blocks if Gemini accidentally wraps it
                if post_content.startswith("```"):
                    lines = post_content.split("\n")
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines[-1].startswith("```"):
                        lines = lines[:-1]
                    post_content = "\n".join(lines).strip()

            except Exception as e:
                self.safe_stderr(f"Error calling Gemini API: {str(e)}")
                return

        self.safe_stdout("\nGenerated Post Content:\n" + "="*40 + f"\n{post_content}\n" + "="*40 + "\n")

        # 5. Handle Dry Run
        if dry_run:
            SocialPost.objects.create(
                platform='linkedin',
                content=post_content,
                status='DRAFT'
            )
            self.safe_stdout("Dry run complete. Post saved as DRAFT in database.")
            return

        # 6. Publish to LinkedIn
        self.safe_stdout("Publishing to LinkedIn...")
        
        # Determine Author URN
        author_urn = cred.organization_id
        if not author_urn:
            self.safe_stderr("ERROR: LinkedIn Target URN (organization_id) is not set in credentials. Please authenticate again or configure it in the admin portal.")
            SocialPost.objects.create(
                platform='linkedin',
                content=post_content,
                status='FAILED',
                error_message="Missing Target URN (organization_id) in LinkedIn credentials."
            )
            return
            
        if not author_urn.startswith("urn:li:"):
            # If numerical, assume organization
            if author_urn.isdigit():
                author_urn = f"urn:li:organization:{author_urn}"
            else:
                author_urn = f"urn:li:organization:{author_urn}"

        # Get valid access token (handles refresh internally if expired)
        try:
            access_token = cred.get_valid_access_token()
        except Exception as e:
            self.safe_stderr(f"Failed to obtain valid access token: {str(e)}")
            # Log failure
            SocialPost.objects.create(
                platform='linkedin',
                content=post_content,
                status='FAILED',
                error_message=f"Access token error: {str(e)}"
            )
            return

        # LinkedIn Posts API
        linkedin_url = "https://api.linkedin.com/rest/posts"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "LinkedIn-Version": "202401",
            "X-Restli-Protocol-Version": "2.0.0"
        }
        
        payload = {
            "author": author_urn,
            "commentary": post_content,
            "visibility": "PUBLIC",
            "distribution": {
                "feedDistribution": "MAIN_FEED",
                "targetEntities": [],
                "thirdPartyDistributionChannels": []
            }
        }

        try:
            response = requests.post(linkedin_url, json=payload, headers=headers, timeout=15)
            
            if response.status_code in [200, 201]:
                # In some versions, the post URN is returned in the x-linkedin-id header or json
                post_urn = response.headers.get("x-linkedin-id", "")
                if not post_urn and response.text:
                    try:
                        post_urn = response.json().get("id", "")
                    except:
                        pass
                
                SocialPost.objects.create(
                    platform='linkedin',
                    content=post_content,
                    status='PUBLISHED',
                    published_time=timezone.now(),
                    linkedin_post_urn=post_urn
                )
                self.safe_stdout(f"SUCCESS: Post successfully published to LinkedIn! URN: {post_urn}")
            else:
                error_text = response.text
                self.safe_stderr(f"LinkedIn API error {response.status_code}: {error_text}")
                SocialPost.objects.create(
                    platform='linkedin',
                    content=post_content,
                    status='FAILED',
                    error_message=f"LinkedIn API {response.status_code}: {error_text}"
                )
        except Exception as e:
            self.safe_stderr(f"Error publishing to LinkedIn: {str(e)}")
            SocialPost.objects.create(
                platform='linkedin',
                content=post_content,
                status='FAILED',
                error_message=f"Network error: {str(e)}"
            )
