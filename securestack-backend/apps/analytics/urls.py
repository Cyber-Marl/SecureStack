from django.urls import path
from .views import LogPageView, AnalyticsDashboardView

urlpatterns = [
    path('log/', LogPageView.as_view(), name='log_pageview'),
    path('dashboard/', AnalyticsDashboardView.as_view(), name='analytics_dashboard'),
]
