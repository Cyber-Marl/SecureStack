import os
import json
import re
import random
import requests
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.utils import timezone
from apps.social.models import BlogPost


def parse_gemini_json(raw_text):
    """
    Safely parse a JSON string from Gemini that may contain unescaped
    control characters (e.g. literal newlines) inside string values.
    Uses two strategies:
      1. Try standard json.loads with strict=False first.
      2. If that fails, use a regex to find the outermost JSON object
         and replace bare newline/tab characters inside string literals.
    """
    # Strategy 1: Try permissive parse (handles most cases)
    try:
        return json.loads(raw_text, strict=False)
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract and sanitize the JSON object
    # Find the first '{' and last '}' to isolate the JSON block
    start = raw_text.find('{')
    end = raw_text.rfind('}')
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in Gemini response.")
    json_str = raw_text[start:end + 1]

    # Replace unescaped control characters inside string values
    # This replaces literal \n, \r, \t within JSON string contexts
    def fix_control_chars(match):
        s = match.group(0)
        s = s.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
        return s

    # Match JSON string values (between quotes, not escaped)
    json_str = re.sub(r'"(?:[^"\\]|\\.)*"', fix_control_chars, json_str, flags=re.DOTALL)
    return json.loads(json_str)

class Command(BaseCommand):
    help = "Generates a detailed, SEO-optimized cybersecurity or software engineering blog post using Gemini AI."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Generate the post using Gemini but do not save to the database',
        )
        parser.add_argument(
            '--topic',
            type=str,
            default=None,
            help='Force a specific topic key',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        forced_topic = options['topic']

        self.stdout.write("Starting SecureStack AI Blog Post Generator...")

        # Fetch Gemini API Key
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            self.stderr.write("ERROR: GEMINI_API_KEY environment variable is not set. Cannot run generator.")
            return

        # Select topic category
        topics = {
            "cybersecurity": "A detailed article explaining a security vulnerability or defensive strategy (e.g., DNSSEC, email security spoofing, cross-site scripting (XSS) prevention, database encryption, SSL handshake, HSTS, secure cookie management).",
            "development": "An article detailing modern software development best practices (e.g. building scalable REST APIs, writing clean/maintainable code, secure coding principles in Django/React, managing third-party dependency risks).",
            "cloud_devops": "An article detailing cloud security, server virtualization, or automation (e.g. securing Docker container deployments, writing secure Terraform files, setting up safe CI/CD pipelines, IAM architecture on AWS)."
        }

        selected_topic = forced_topic if forced_topic in topics else random.choice(list(topics.keys()))
        self.stdout.write(f"Selected Topic Area: {selected_topic.upper()}")

        prompt = f"""
You are the Lead Developer and Cybersecurity Advocate for "SecureStack Enterprise Solutions" (website: https://securestack.co.zw).
Write a high-quality, comprehensive, and highly engaging technical blog post.

Topic details: {topics[selected_topic]}

Requirements:
1. Make it detailed, clear, and extremely practical. It should include actionable code examples or config blocks where appropriate.
2. Structure the body content using valid clean HTML tags: <h2>, <h3>, <p>, <ul>, <li>, and <code> or <pre> for code snippets. Do not use <h1>.
3. The content must be professional, authoritative, and developer-friendly.
4. Conclude the post with a brief call to action pointing to SecureStack's services (e.g. domain audits, security consultations at securestack.co.zw).
5. Generate appropriate SEO metadata: a custom SEO Title, a short excerpt (1-2 sentences), a meta description (under 160 characters), and relevant keywords.

You MUST format your response as a valid JSON object. Do not wrap the JSON output in markdown block backticks (like ```json ... ```). Output ONLY the raw JSON string.

The JSON object must have exactly the following structure:
{{
  "title": "A compelling, SEO-friendly title of the blog post",
  "excerpt": "A short 1-2 sentence excerpt summarizing the post for listing cards",
  "category": "One of: 'Cybersecurity', 'Development', or 'Cloud & DevOps'",
  "tags": "3-4 comma-separated tags relevant to the post",
  "read_time": "Estimated reading time (e.g., '5 min read')",
  "seo_title": "SEO Title tag (e.g. 'How to Secure X | SecureStack')",
  "seo_desc": "SEO Meta Description (under 160 characters)",
  "keywords": "3-5 comma-separated keywords",
  "content": "Full body content of the blog post using valid HTML tags (h2, h3, p, ul, li, pre, code)"
}}
"""

        self.stdout.write("Generating content using Gemini AI...")
        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        headers = {"Content-Type": "application/json"}

        try:
            res = requests.post(gemini_url, json=payload, headers=headers, timeout=60)
            if res.status_code != 200:
                self.stderr.write(f"Gemini API returned error code {res.status_code}: {res.text}")
                return

            res_data = res.json()
            raw_text = res_data['candidates'][0]['content']['parts'][0]['text'].strip()

            # Clean markdown JSON wrapping if present
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            # Parse JSON with robust helper that handles Gemini's literal newlines
            post_data = parse_gemini_json(raw_text)

            # Resolve publication date
            post_data['date'] = timezone.now().strftime("%B %d, %Y")
            post_data['status'] = 'PUBLISHED'

            self.stdout.write("\nGenerated Blog Post Details:\n" + "="*40)
            self.stdout.write(f"Title: {post_data.get('title')}")
            self.stdout.write(f"Category: {post_data.get('category')}")
            self.stdout.write(f"Read Time: {post_data.get('read_time')}")
            self.stdout.write(f"Excerpt: {post_data.get('excerpt')}")
            self.stdout.write("="*40 + "\n")

            if dry_run:
                self.stdout.write("Dry run complete. Post not saved to database.")
                return

            # Save to Database
            slug = slugify(post_data.get('title'))
            blog_post, created = BlogPost.objects.update_or_create(
                slug=slug,
                defaults=post_data
            )
            status_text = "created" if created else "updated"
            self.stdout.write(f"SUCCESS: Blog post successfully {status_text} and published! Slug: {slug}")

        except Exception as e:
            self.stderr.write(f"Error executing blog generator command: {str(e)}")
