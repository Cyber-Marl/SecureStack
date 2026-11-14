from django.urls import path
from .views import LogPageView, AnalyticsDashboardView, AdminLoginView, AdminVerifyView

urlpatterns = [
    path('log/', LogPageView.as_view(), name='log_pageview'),
    path('dashboard/', AnalyticsDashboardView.as_view(), name='analytics_dashboard'),
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin/verify/', AdminVerifyView.as_view(), name='admin_verify'),
]
