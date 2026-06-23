from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.conf import settings
from .serializers import ContactMessageSerializer


class ContactView(APIView):
    def post(self, request):
        referrer_code = request.data.get('referrer_code')
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            referred_by = None
            if referrer_code:
                try:
                    from apps.affiliate.models import Affiliate
                    referred_by = Affiliate.objects.get(code=referrer_code, is_active=True)
                except Affiliate.DoesNotExist:
                    pass

            msg = serializer.save(referred_by=referred_by)

            # Collect uploaded file attachments (multipart/form-data)
            attachments = request.FILES.getlist('attachments')

            # Build email body
            body = (
                f"Name: {msg.name}\n"
                f"Email: {msg.email}\n"
                f"Phone: {msg.phone or 'N/A'}\n"
                f"Service: {msg.service or 'N/A'}\n\n"
                f"Message:\n{msg.message}"
            )
            if attachments:
                body += f"\n\n--- Attachments ({len(attachments)} file(s)) ---"

            # Send notification email with optional attachments
            try:
                email = EmailMessage(
                    subject=f"[SecureStack] New enquiry from {msg.name}",
                    body=body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[settings.CONTACT_RECIPIENT_EMAIL],
                    reply_to=[msg.email],  # Reply directly to the enquirer
                )

                # Attach each uploaded file to the email
                for attachment in attachments:
                    email.attach(
                        attachment.name,
                        attachment.read(),
                        attachment.content_type,
                    )

                email.send(fail_silently=False)
            except Exception as e:
                # Log but don't fail the request — message is already saved to DB
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send contact notification email: {e}")

            return Response(
                {
                    'detail': 'Message received. We will be in touch shortly.',
                    'debug': {
                        'content_type': request.META.get('CONTENT_TYPE'),
                        'data_keys': list(request.data.keys()),
                        'files_keys': list(request.FILES.keys()),
                        'attachments_count': len(attachments),
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
