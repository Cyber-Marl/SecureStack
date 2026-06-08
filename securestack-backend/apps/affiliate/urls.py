from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    LogReferralClickView, 
    AffiliateDashboardView, 
    AdminAffiliateStatsView, 
    AdminUpdateLeadView,
    AffiliateUpdateProfileView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='affiliate-register'),
    path('login/', LoginView.as_view(), name='affiliate-login'),
    path('click/', LogReferralClickView.as_view(), name='affiliate-click'),
    path('dashboard/', AffiliateDashboardView.as_view(), name='affiliate-dashboard'),
    path('update-profile/', AffiliateUpdateProfileView.as_view(), name='affiliate-update-profile'),
    path('admin/stats/', AdminAffiliateStatsView.as_view(), name='affiliate-admin-stats'),
    path('admin/update-lead/', AdminUpdateLeadView.as_view(), name='affiliate-admin-update-lead'),
]
