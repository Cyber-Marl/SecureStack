import os
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings

SALT = 'securestack-admin-auth'
TOKEN_MAX_AGE_SECONDS = 7 * 24 * 3600  # 7 days

def get_signer():
    return TimestampSigner(salt=SALT)

def generate_admin_token(subject):
    """Generate a cryptographically signed HMAC token for admin session."""
    signer = get_signer()
    return signer.sign(subject)

def verify_admin_token(token):
    """
    Verify and unsign the admin token.
    Returns (is_valid: bool, subject: str or None)
    """
    if not token or not isinstance(token, str):
        return False, None

    signer = get_signer()
    try:
        subject = signer.unsign(token, max_age=TOKEN_MAX_AGE_SECONDS)
        return True, subject
    except (BadSignature, SignatureExpired):
        return False, None

def get_admin_user_from_request(request):
    """
    Extract and validate Bearer token from request Authorization header.
    Returns (is_authenticated: bool, user_or_name: str or User or None)
    """
    auth_header = request.headers.get('Authorization', '') or request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return False, None

    parts = auth_header.split(' ', 1)
    if len(parts) != 2:
        return False, None

    token = parts[1].strip()
    is_valid, subject = verify_admin_token(token)
    if not is_valid or not subject:
        return False, None

    # Parse subject: e.g. "user:<id>:<username>" or "key:console_admin"
    if subject.startswith('user:'):
        sub_parts = subject.split(':', 2)
        if len(sub_parts) == 3:
            user_id = sub_parts[1]
            username = sub_parts[2]
            try:
                user = User.objects.get(id=user_id, username=username, is_active=True)
                if user.is_staff or user.is_superuser:
                    return True, user
            except User.DoesNotExist:
                return False, None
    elif subject.startswith('key:'):
        return True, subject

    return False, None

def authenticate_admin(username=None, password=None, key=None, request=None):
    """
    Authenticate administrative credentials against Django User model
    or server-configured ADMIN_CONSOLE_KEY.
    Returns (success: bool, token: str or None, username: str or None)
    """
    # 1. Check Django user credentials
    if username and password:
        user = authenticate(request=request, username=username, password=password)
        if not user and '@' in username:
            matched_user = User.objects.filter(email__iexact=username, is_active=True).first()
            if matched_user:
                user = authenticate(request=request, username=matched_user.username, password=password)

        if user and user.is_active and (user.is_staff or user.is_superuser):
            token = generate_admin_token(f"user:{user.id}:{user.username}")
            return True, token, user.username

    # 2. Check password against superuser or staff if only password was submitted
    submitted_pass = password or key
    if submitted_pass and not username:
        # Check against existing superusers in database
        superusers = User.objects.filter(is_superuser=True, is_active=True)
        for su in superusers:
            if su.check_password(submitted_pass):
                token = generate_admin_token(f"user:{su.id}:{su.username}")
                return True, token, su.username

    # 3. Check optional ADMIN_CONSOLE_KEY from server environment (.env)
    admin_console_key = os.getenv('ADMIN_CONSOLE_KEY')
    if admin_console_key and submitted_pass:
        if submitted_pass == admin_console_key:
            token = generate_admin_token("key:console_admin")
            return True, token, "admin"

    return False, None, None
