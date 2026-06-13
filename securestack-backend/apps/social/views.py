import os
import requests
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import LinkedInCredential, SocialPost

class LinkedInAuthorizeView(APIView):
    """
    Redirects the user to LinkedIn's authorization page to start the OAuth flow.
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
            
        redirect_uri = request.build_absolute_uri(reverse('linkedin-callback'))
        
        # Build authorization URL
        # For organization page postings, we need w_organization_social.
        # w_member_social is useful for fallback / profile posts.
        scopes = "w_organization_social,w_member_social,openid,profile"
        
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
                
                # If there's an existing record, update it. Otherwise create a new one.
                if cred:
                    cred.access_token = access_token
                    cred.expires_in = expires_in
                    cred.refresh_token = refresh_token
                    cred.refresh_token_expires_in = refresh_token_expires_in
                    cred.authorized_at = timezone.now()
                    cred.save()
                else:
                    cred = LinkedInCredential.objects.create(
                        client_id=client_id,
                        client_secret=client_secret,
                        organization_id=org_id,
                        access_token=access_token,
                        expires_in=expires_in,
                        refresh_token=refresh_token,
                        refresh_token_expires_in=refresh_token_expires_in,
                        authorized_at=timezone.now()
                    )
                
                # Return success HTML page
                success_html = """
                <html>
                <head>
                    <title>SecureStack Integration Successful</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            background-color: #0f172a;
                            color: #f8fafc;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            background: rgba(30, 41, 59, 0.7);
                            border: 1px solid #334155;
                            border-radius: 12px;
                            padding: 40px;
                            max-width: 450px;
                            text-align: center;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        }
                        h1 { color: #fe914c; margin-top: 0; }
                        p { color: #94a3b8; line-height: 1.6; }
                        .btn {
                            display: inline-block;
                            margin-top: 20px;
                            background: #fe914c;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 6px;
                            text-decoration: none;
                            font-weight: bold;
                            transition: background-color 0.2s;
                        }
                        .btn:hover { background: #e07d3b; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Authentication Successful!</h1>
                        <p>Your SecureStack backend has successfully authenticated with your LinkedIn App.</p>
                        <p>Tokens have been saved to the database. The system can now generate and publish automated posts.</p>
                        <a href="/admin/social/linkedincredential/" class="btn">Go to Django Admin</a>
                    </div>
                </body>
                </html>
                """
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
