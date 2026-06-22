import datetime
import requests
from django.db import models
from django.utils import timezone

class LinkedInCredential(models.Model):
    client_id = models.CharField(max_length=255, help_text="LinkedIn Developer App Client ID")
    client_secret = models.CharField(max_length=255, help_text="LinkedIn Developer App Client Secret")
    organization_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="LinkedIn Organization ID (e.g. 12345678) or Person URN (e.g. urn:li:person:XXXX). If empty, the system will use the authenticated user's profile URN."
    )
    
    access_token = models.TextField(blank=True, null=True, help_text="OAuth Access Token")
    refresh_token = models.TextField(blank=True, null=True, help_text="OAuth Refresh Token")
    expires_in = models.IntegerField(blank=True, null=True, help_text="Access token lifetime in seconds")
    refresh_token_expires_in = models.IntegerField(blank=True, null=True, help_text="Refresh token lifetime in seconds")
    authorized_at = models.DateTimeField(blank=True, null=True, help_text="Timestamp when the token was acquired")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "LinkedIn Credential"
        verbose_name_plural = "LinkedIn Credentials"

    def __str__(self):
        return f"LinkedIn Credentials for Org: {self.organization_id}"

    @property
    def is_access_token_expired(self):
        if not self.access_token or not self.authorized_at or not self.expires_in:
            return True
        expiry_time = self.authorized_at + datetime.timedelta(seconds=self.expires_in)
        # Check if expired or within a safety window of 5 minutes (300 seconds)
        return timezone.now() >= (expiry_time - datetime.timedelta(seconds=300))

    @property
    def is_refresh_token_expired(self):
        if not self.refresh_token or not self.authorized_at or not self.refresh_token_expires_in:
            return True
        expiry_time = self.authorized_at + datetime.timedelta(seconds=self.refresh_token_expires_in)
        return timezone.now() >= expiry_time

    def refresh_access_token(self):
        """Refreshes the access token using the refresh token."""
        if not self.refresh_token:
            raise ValueError("No refresh token available. User must authenticate via OAuth first.")
        if self.is_refresh_token_expired:
            raise ValueError("Refresh token has expired. User must re-authenticate.")

        url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        
        try:
            response = requests.post(url, data=data, headers=headers, timeout=10)
            if response.status_code == 200:
                res_data = response.json()
                self.access_token = res_data.get("access_token")
                self.expires_in = res_data.get("expires_in")
                
                # Update refresh token if a new one is returned
                if "refresh_token" in res_data:
                    self.refresh_token = res_data.get("refresh_token")
                if "refresh_token_expires_in" in res_data:
                    self.refresh_token_expires_in = res_data.get("refresh_token_expires_in")
                
                self.authorized_at = timezone.now()
                self.save()
                return True
            else:
                raise Exception(f"Failed to refresh token: {response.status_code} - {response.text}")
        except Exception as e:
            raise Exception(f"Error during token refresh: {str(e)}")

    def get_valid_access_token(self):
        """Gets a valid access token, refreshing it if it's expired."""
        if self.is_access_token_expired:
            self.refresh_access_token()
        return self.access_token


class SocialPost(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SCHEDULED', 'Scheduled'),
        ('PUBLISHED', 'Published'),
        ('FAILED', 'Failed'),
    ]

    platform = models.CharField(max_length=50, default='linkedin')
    content = models.TextField(help_text="The body text of the social media post")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    scheduled_time = models.DateTimeField(blank=True, null=True, help_text="Time to publish (if scheduled)")
    published_time = models.DateTimeField(blank=True, null=True, help_text="Actual publish time")
    
    error_message = models.TextField(blank=True, null=True, help_text="Error message if posting failed")
    linkedin_post_urn = models.CharField(max_length=255, blank=True, null=True, help_text="LinkedIn Post URN reference")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Social Post"
        verbose_name_plural = "Social Posts"
        ordering = ['-created_at']

    def __str__(self):
        snippet = self.content[:50] + "..." if len(self.content) > 50 else self.content
        safe_snippet = snippet.encode('ascii', errors='replace').decode('ascii')
        return f"[{self.platform.upper()} - {self.status}] {safe_snippet}"


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
    ]

    title = models.CharField(max_length=255, help_text="The title of the blog post")
    slug = models.SlugField(max_length=255, unique=True, help_text="URL-friendly slug (e.g. demystifying-dmarc)")
    excerpt = models.TextField(help_text="A short summary/excerpt of the post shown in listings")
    content = models.TextField(help_text="The full body content of the blog post (supports Markdown/HTML)")
    
    date = models.CharField(max_length=100, blank=True, help_text="Display date (e.g. June 01, 2026). If blank, will display current date format.")
    author = models.CharField(max_length=255, default="SecureStack Research Team", help_text="Author name and title")
    read_time = models.CharField(max_length=50, default="5 min read", help_text="Estimated read time (e.g. 6 min read)")
    category = models.CharField(max_length=100, default="Cybersecurity", help_text="Category (e.g. Cybersecurity, Development, Cloud & DevOps)")
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags (e.g. Email Security, DMARC, Compliance)")
    
    seo_title = models.CharField(max_length=255, blank=True, null=True, help_text="Optional custom SEO Title tag")
    seo_desc = models.TextField(blank=True, null=True, help_text="Optional custom SEO Meta Description")
    keywords = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated SEO keywords")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
