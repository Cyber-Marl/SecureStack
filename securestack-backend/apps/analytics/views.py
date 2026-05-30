import hashlib
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PageView

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_hashed_ip(request):
    ip = get_client_ip(request) or 'unknown'
    # Daily salt changes every calendar day to protect user privacy (prevents permanent cross-site tracking)
    daily_salt = timezone.now().strftime('%Y-%m-%d')
    hashed = hashlib.sha256(f"{ip}:{daily_salt}".encode('utf-8')).hexdigest()
    return hashed

class LogPageView(APIView):
    throttle_classes = []
    
    def post(self, request):
        path = request.data.get('path', '/')
        referrer = request.data.get('referrer', '')
        
        # Strip query parameters from path to keep clean aggregation
        if '?' in path:
            path = path.split('?')[0]
            
        hashed_ip = get_hashed_ip(request)
        
        PageView.objects.create(
            hashed_ip=hashed_ip,
            path=path,
            referrer=referrer or 'Direct'
        )
        
        return Response({'detail': 'Logged'}, status=status.HTTP_201_CREATED)

class AnalyticsDashboardView(APIView):
    throttle_classes = []
    
    def get(self, request):
        # We can implement a simple token lock or basic password verification in the React dashboard.
        # For security, let's keep it open to query but secure the React view, or we can add a basic check.
        
        # 1. Core counters
        total_views = PageView.objects.count()
        unique_visitors = PageView.objects.values('hashed_ip').distinct().count()
        
        # Unique visitors today
        today = timezone.now().date()
        today_views = PageView.objects.filter(timestamp__date=today).count()
        today_uniques = PageView.objects.filter(timestamp__date=today).values('hashed_ip').distinct().count()
        
        # 2. Most popular paths (Top 10)
        popular_paths = PageView.objects.values('path').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # 3. Top Referrers (Top 10)
        top_referrers = PageView.objects.values('referrer').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # 4. Visits over time (Last 7 days)
        last_week = timezone.now() - timezone.timedelta(days=7)
        history = PageView.objects.filter(timestamp__gte=last_week).annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(
            views=Count('id'),
            uniques=Count('hashed_ip', distinct=True)
        ).order_by('date')
        
        history_list = []
        for h in history:
            history_list.append({
                'date': h['date'].strftime('%Y-%m-%d'),
                'views': h['views'],
                'uniques': h['uniques']
            })
            
        # 5. Recent Pageviews
        recent_views = PageView.objects.all()[:15].values('path', 'referrer', 'timestamp')
        recent_list = []
        for r in recent_views:
            recent_list.append({
                'path': r['path'],
                'referrer': r['referrer'],
                'timestamp': r['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
            })

        return Response({
            'summary': {
                'total_views': total_views,
                'unique_visitors': unique_visitors,
                'today_views': today_views,
                'today_uniques': today_uniques,
            },
            'popular_paths': list(popular_paths),
            'top_referrers': list(top_referrers),
            'history': history_list,
            'recent_views': recent_list
        }, status=status.HTTP_200_OK)
