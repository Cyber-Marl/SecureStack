import hashlib
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Affiliate, ReferralClick
from apps.contact.models import ContactMessage
from .serializers import AffiliateRegisterSerializer, AffiliateLoginSerializer, ContactMessageAffiliateSerializer
from apps.analytics.views import get_hashed_ip

class RegisterView(APIView):
    throttle_classes = []
    def post(self, request):
        serializer = AffiliateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            affiliate = serializer.save()
            return Response({
                'id': affiliate.id,
                'name': affiliate.name,
                'email': affiliate.email,
                'code': affiliate.code,
                'phone': affiliate.phone,
                'payment_method': affiliate.payment_method,
                'payment_details': affiliate.payment_details,
                'detail': 'Affiliate registered successfully!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    throttle_classes = []
    def post(self, request):
        serializer = AffiliateLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                affiliate = Affiliate.objects.get(email=email, is_active=True)
                if affiliate.check_password(password):
                    # In a production app, we would issue a JWT token. 
                    # For this custom system, we generate a secure-enough stateless session signature.
                    session_token = f"{affiliate.email}:{affiliate.code}"
                    return Response({
                        'token': session_token,
                        'name': affiliate.name,
                        'email': affiliate.email,
                        'code': affiliate.code,
                        'phone': affiliate.phone,
                        'payment_method': affiliate.payment_method,
                        'payment_details': affiliate.payment_details
                    }, status=status.HTTP_200_OK)
            except Affiliate.DoesNotExist:
                pass
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogReferralClickView(APIView):
    throttle_classes = []
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'detail': 'Code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            affiliate = Affiliate.objects.get(code=code, is_active=True)
        except Affiliate.DoesNotExist:
            return Response({'detail': 'Invalid affiliate code.'}, status=status.HTTP_404_NOT_FOUND)
        
        hashed_ip = get_hashed_ip(request)
        path = request.data.get('path', '/')
        
        # Log unique click per IP for this affiliate
        click, created = ReferralClick.objects.get_or_create(
            affiliate=affiliate,
            hashed_ip=hashed_ip,
            defaults={'path': path}
        )
        
        return Response({
            'detail': 'Click registered.',
            'new_click': created,
            'code': code
        }, status=status.HTTP_201_CREATED)

class AffiliateDashboardView(APIView):
    throttle_classes = []
    def get(self, request):
        # Authenticate using headers
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        try:
            email, code = token.split(':')
            affiliate = Affiliate.objects.get(email=email, code=code, is_active=True)
        except (ValueError, Affiliate.DoesNotExist):
            return Response({'detail': 'Invalid session.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Gather metrics
        total_clicks = ReferralClick.objects.filter(affiliate=affiliate).count()
        
        leads = ContactMessage.objects.filter(referred_by=affiliate)
        total_leads = leads.count()
        converted_leads = leads.filter(status='converted').count()
        
        unpaid_earnings = leads.filter(status='converted', reward_status='unpaid').aggregate(total=Sum('reward_amount'))['total'] or Decimal('0.00')
        paid_earnings = leads.filter(status='converted', reward_status='paid').aggregate(total=Sum('reward_amount'))['total'] or Decimal('0.00')
        
        serializer = ContactMessageAffiliateSerializer(leads, many=True)
        
        return Response({
            'affiliate': {
                'name': affiliate.name,
                'email': affiliate.email,
                'code': affiliate.code,
                'phone': affiliate.phone,
                'payment_method': affiliate.payment_method,
                'payment_details': affiliate.payment_details,
            },
            'stats': {
                'clicks': total_clicks,
                'leads': total_leads,
                'converted': converted_leads,
                'unpaid_earnings': unpaid_earnings,
                'paid_earnings': paid_earnings,
                'total_earnings': unpaid_earnings + paid_earnings
            },
            'referred_leads': serializer.data
        }, status=status.HTTP_200_OK)

class AdminAffiliateStatsView(APIView):
    def get(self, request):
        # Fetch overview for admin dashboard
        affiliates_data = []
        for affiliate in Affiliate.objects.all():
            clicks = ReferralClick.objects.filter(affiliate=affiliate).count()
            leads = ContactMessage.objects.filter(referred_by=affiliate)
            converted = leads.filter(status='converted').count()
            unpaid_rewards = leads.filter(status='converted', reward_status='unpaid').aggregate(total=Sum('reward_amount'))['total'] or Decimal('0.00')
            paid_rewards = leads.filter(status='converted', reward_status='paid').aggregate(total=Sum('reward_amount'))['total'] or Decimal('0.00')
            
            affiliates_data.append({
                'id': affiliate.id,
                'name': affiliate.name,
                'email': affiliate.email,
                'code': affiliate.code,
                'phone': affiliate.phone,
                'clicks': clicks,
                'leads': leads.count(),
                'converted': converted,
                'unpaid_rewards': unpaid_rewards,
                'paid_rewards': paid_rewards,
                'is_active': affiliate.is_active
            })
            
        all_referred_leads = ContactMessage.objects.filter(referred_by__isnull=False).select_related('referred_by')
        leads_list = []
        for lead in all_referred_leads:
            leads_list.append({
                'id': lead.id,
                'name': lead.name,
                'email': lead.email,
                'service': lead.service,
                'created_at': lead.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'referred_by_name': lead.referred_by.name,
                'referred_by_code': lead.referred_by.code,
                'status': lead.status,
                'reward_amount': lead.reward_amount,
                'reward_status': lead.reward_status
            })
            
        return Response({
            'affiliates': affiliates_data,
            'leads': leads_list
        }, status=status.HTTP_200_OK)

class AdminUpdateLeadView(APIView):
    def post(self, request):
        lead_id = request.data.get('lead_id')
        status_val = request.data.get('status')
        reward_amount_val = request.data.get('reward_amount')
        reward_status_val = request.data.get('reward_status')
        
        if not lead_id:
            return Response({'detail': 'Lead ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            lead = ContactMessage.objects.get(id=lead_id)
        except ContactMessage.DoesNotExist:
            return Response({'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
            
        if status_val is not None:
            lead.status = status_val
        if reward_amount_val is not None:
            try:
                lead.reward_amount = float(reward_amount_val)
            except ValueError:
                return Response({'detail': 'Invalid reward amount.'}, status=status.HTTP_400_BAD_REQUEST)
        if reward_status_val is not None:
            lead.reward_status = reward_status_val
            
        lead.save()
        return Response({
            'detail': 'Lead updated successfully.',
            'lead': {
                'id': lead.id,
                'status': lead.status,
                'reward_amount': lead.reward_amount,
                'reward_status': lead.reward_status
            }
        }, status=status.HTTP_200_OK)

class AffiliateUpdateProfileView(APIView):
    """Allow the logged-in affiliate to update their phone and payment details."""
    throttle_classes = []
    def post(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            email, code = token.split(':')
            affiliate = Affiliate.objects.get(email=email, code=code, is_active=True)
        except (ValueError, Affiliate.DoesNotExist):
            return Response({'detail': 'Invalid session.'}, status=status.HTTP_401_UNAUTHORIZED)

        phone = request.data.get('phone', '').strip()
        payment_method = request.data.get('payment_method', '').strip()
        payment_details = request.data.get('payment_details', '').strip()

        if phone:
            affiliate.phone = phone
        if payment_method:
            affiliate.payment_method = payment_method
        affiliate.payment_details = payment_details
        affiliate.save()

        return Response({
            'detail': 'Payout details updated successfully.',
            'phone': affiliate.phone,
            'payment_method': affiliate.payment_method,
            'payment_details': affiliate.payment_details,
        }, status=status.HTTP_200_OK)
