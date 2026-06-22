import os
import requests
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import LinkedInCredential, SocialPost, BlogPost
from .serializers import BlogPostSerializer

class LinkedInAuthorizeView(APIView):
    """
    Redirects the user to LinkedIn's authorization page to start the OAuth flow.
    Supports selecting personal profile scopes vs organization scopes.
    """
    def get(self, request):
        # Retrieve client details from database or settings
        cred = LinkedInCredential.objects.first()
        client_id = cred.client_id if cred else os.getenv("LINKEDIN_CLIENT_ID")
        
        if not client_id:
            return Response(
                {"error": "LinkedIn Client ID not configured. Please add it to the database or settings."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        confirm = request.GET.get('confirm')
        scope_type = request.GET.get('scope_type', 'personal')
        
        if not confirm:
            selection_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureStack - LinkedIn Authorization</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #090d16;
            --card-bg: rgba(17, 24, 39, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --accent-color: #fe914c;
            --accent-hover: #e07d3b;
        }
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            background-image: radial-gradient(circle at 10% 20%, rgba(254, 145, 76, 0.05) 0%, transparent 40%),
                              radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 40%);
        }
        .container {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: var(--accent-color);
            margin-bottom: 8px;
        }
        .logo span {
            color: #f3f4f6;
        }
        h1 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .subtitle {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 35px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 35px;
        }
        @media (max-width: 600px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
        .card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 25px;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s ease;
        }
        .card:hover {
            transform: translateY(-4px);
            border-color: rgba(254, 145, 76, 0.2);
            background: rgba(255, 255, 255, 0.04);
            box-shadow: 0 10px 25px rgba(254, 145, 76, 0.05);
        }
        .card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .card-description {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 20px;
            flex-grow: 1;
        }
        .badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 6px;
            background: rgba(254, 145, 76, 0.1);
            color: var(--accent-color);
            margin-top: 10px;
            margin-bottom: 15px;
            align-self: flex-start;
        }
        .badge.blue {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        .btn {
            background: var(--accent-color);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
            display: block;
        }
        .btn:hover {
            background: var(--accent-hover);
            box-shadow: 0 4px 12px rgba(254, 145, 76, 0.2);
        }
        .btn-outline {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: var(--text-primary);
        }
        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: none;
        }
        .footer {
            font-size: 12px;
            color: var(--text-secondary);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 20px;
        }
        .footer a {
            color: var(--accent-color);
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">Secure<span>Stack</span></div>
        <h1>LinkedIn Integration Setup</h1>
        <p class="subtitle">Choose the authorization scope corresponding to the products enabled on your LinkedIn Developer App. Check your developers dashboard to verify which tier you are approved for.</p>
        
        <div class="grid">
            <div class="card">
                <div>
                    <div class="card-title">👤 Personal Profile</div>
                    <span class="badge blue">Share on LinkedIn Product</span>
                    <p class="card-description">Publish automated posts to your personal LinkedIn profile feed. Perfect for testing and individual advocacy.</p>
                </div>
                <a href="?scope_type=personal&confirm=true" class="btn">Authorize Personal</a>
            </div>
            
            <div class="card">
                <div>
                    <div class="card-title">🏢 Company Page</div>
                    <span class="badge">Community Management API</span>
                    <p class="card-description">Publish automated posts to your organization's business page. Requires organization admin status and approved API access.</p>
                </div>
                <a href="?scope_type=organization&confirm=true" class="btn btn-outline">Authorize Organization</a>
            </div>
        </div>
        
        <div class="footer">
            Need help? Make sure client credentials are correct. Manage products at the <a href="https://www.linkedin.com/developers/" target="_blank">LinkedIn Developers Portal</a>.
        </div>
    </div>
</body>
</html>"""
            return HttpResponse(selection_html)
            
        redirect_uri = request.build_absolute_uri(reverse('linkedin-callback'))
        
        # Build authorization URL based on scope choice
        if scope_type == 'organization':
            scopes = "w_organization_social,w_member_social,openid,profile"
        else:
            scopes = "w_member_social,openid,profile"
            
        auth_url = (
            f"https://www.linkedin.com/oauth/v2/authorization?"
            f"response_type=code&"
            f"client_id={client_id}&"
            f"redirect_uri={redirect_uri}&"
            f"state=securestack_state_token&"
            f"scope={scopes}"
        )
        
        return HttpResponseRedirect(auth_url)


class LinkedInCallbackView(APIView):
    """
    Handles the LinkedIn OAuth callback, exchanges the code for tokens, and saves them.
    Also queries OIDC userinfo to retrieve the member's Person URN for default routing.
    """
    def get(self, request):
        code = request.GET.get('code')
        error = request.GET.get('error')
        error_desc = request.GET.get('error_description')
        
        if error:
            return Response(
                {"error": f"LinkedIn OAuth error: {error} - {error_desc}"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not code:
            return Response(
                {"error": "Authorization code not provided in request."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get client credentials
        cred = LinkedInCredential.objects.first()
        client_id = cred.client_id if cred else os.getenv("LINKEDIN_CLIENT_ID")
        client_secret = cred.client_secret if cred else os.getenv("LINKEDIN_CLIENT_SECRET")
        org_id = cred.organization_id if cred else os.getenv("LINKEDIN_ORGANIZATION_ID", "")
        
        if not client_id or not client_secret:
            return Response(
                {"error": "LinkedIn credentials (ID and Secret) are missing."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        redirect_uri = request.build_absolute_uri(reverse('linkedin-callback'))
        
        # Exchange authorization code for access token
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": client_id,
            "client_secret": client_secret,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        
        try:
            response = requests.post(token_url, data=data, headers=headers, timeout=10)
            res_data = response.json()
            
            if response.status_code == 200:
                access_token = res_data.get("access_token")
                expires_in = res_data.get("expires_in")
                refresh_token = res_data.get("refresh_token")
                refresh_token_expires_in = res_data.get("refresh_token_expires_in")
                
                # Fetch member profile details to identify person URN
                member_name = "Member"
                member_urn = "N/A"
                try:
                    userinfo_url = "https://api.linkedin.com/v2/userinfo"
                    userinfo_headers = {"Authorization": f"Bearer {access_token}"}
                    userinfo_resp = requests.get(userinfo_url, headers=userinfo_headers, timeout=10)
                    if userinfo_resp.status_code == 200:
                        userinfo_data = userinfo_resp.json()
                        member_name = userinfo_data.get("name", "Member")
                        member_id = userinfo_data.get("sub", "")
                        if member_id:
                            member_urn = f"urn:li:person:{member_id}"
                except Exception as e:
                    pass
                
                # If there's an existing record, update it. Otherwise create a new one.
                active_target = ""
                if cred:
                    cred.access_token = access_token
                    cred.expires_in = expires_in
                    cred.refresh_token = refresh_token
                    cred.refresh_token_expires_in = refresh_token_expires_in
                    cred.authorized_at = timezone.now()
                    if not cred.organization_id and member_urn != "N/A":
                        cred.organization_id = member_urn
                    cred.save()
                    active_target = cred.organization_id
                else:
                    target_urn = org_id if org_id else member_urn
                    cred = LinkedInCredential.objects.create(
                        client_id=client_id,
                        client_secret=client_secret,
                        organization_id=target_urn,
                        access_token=access_token,
                        expires_in=expires_in,
                        refresh_token=refresh_token,
                        refresh_token_expires_in=refresh_token_expires_in,
                        authorized_at=timezone.now()
                    )
                    active_target = target_urn
                
                # Return success HTML page
                success_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureStack - Integration Successful</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #090d16;
            --card-bg: rgba(17, 24, 39, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --success-color: #10b981;
            --accent-color: #fe914c;
            --accent-hover: #e07d3b;
        }
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            background-image: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
                              radial-gradient(circle at 90% 80%, rgba(254, 145, 76, 0.05) 0%, transparent 40%);
        }
        .container {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .success-icon {
            width: 64px;
            height: 64px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: var(--success-color);
            font-size: 32px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        h1 {
            font-size: 24px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 12px;
            color: #f3f4f6;
        }
        p {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .info-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 13px;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label {
            color: var(--text-secondary);
        }
        .info-value {
            font-weight: 600;
            color: var(--text-primary);
        }
        .info-urn {
            font-family: monospace;
            background: rgba(0, 0, 0, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            word-break: break-all;
        }
        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .btn {
            background: var(--accent-color);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
        }
        .btn:hover {
            background: var(--accent-hover);
            box-shadow: 0 4px 12px rgba(254, 145, 76, 0.2);
        }
        .btn-secondary {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✓</div>
        <h1>Authentication Successful!</h1>
        <p>Your SecureStack backend has successfully authenticated and saved credentials in the database.</p>
        
        <div class="info-card">
            <div class="info-row">
                <span class="info-label">Connected User:</span>
                <span class="info-value">{member_name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Profile Target URN:</span>
                <span class="info-value info-urn">{member_urn}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Active Target URN:</span>
                <span class="info-value info-urn">{active_target}</span>
            </div>
        </div>
        
        <div class="btn-group">
            <a href="/admin/social/linkedincredential/" class="btn">Go to Django Admin</a>
            <a href="/" class="btn btn-secondary">Return to Home</a>
        </div>
    </div>
</body>
</html>"""
                success_html = success_html.replace("{member_name}", member_name).replace("{member_urn}", member_urn).replace("{active_target}", active_target)
                return HttpResponse(success_html)
            else:
                return Response(
                    {"error": f"Failed to acquire tokens: {res_data}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"error": f"Error communicating with LinkedIn Token API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TriggerPostView(APIView):
    """
    Manually triggers the social bot run for testing.
    """
    def post(self, request):
        from django.core.management import call_command
        import io
        
        out = io.StringIO()
        try:
            call_command('run_social_bot', stdout=out)
            result = out.getvalue()
            return Response({"status": "success", "message": result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BlogPostListView(APIView):
    """
    API endpoint to list all published blog posts.
    """
    def get(self, request):
        posts = BlogPost.objects.filter(status='PUBLISHED')
        category = request.GET.get('category')
        if category and category != 'All':
            posts = posts.filter(category=category)
        
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlogPostDetailView(APIView):
    """
    API endpoint to retrieve a single blog post by its slug.
    """
    def get(self, request, slug):
        try:
            post = BlogPost.objects.get(slug=slug, status='PUBLISHED')
            serializer = BlogPostSerializer(post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BlogPost.DoesNotExist:
            return Response(
                {"error": "Blog post not found."},
                status=status.HTTP_404_NOT_FOUND
            )
