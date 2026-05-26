from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ContactMessageSerializer


class ContactView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            msg = serializer.save()

            # Send notification email
            try:
                send_mail(
                    subject=f"[SecureStack] New enquiry from {msg.name}",
                    message=(
                        f"Name: {msg.name}\n"
                        f"Email: {msg.email}\n"
                        f"Phone: {msg.phone or 'N/A'}\n"
                        f"Service: {msg.service or 'N/A'}\n\n"
                        f"Message:\n{msg.message}"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass  # Don't fail the request if email fails

            return Response(
                {'detail': 'Message received. We will be in touch shortly.'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
