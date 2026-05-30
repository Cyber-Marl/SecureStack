from django.urls import path
from .views import DomainScanView

urlpatterns = [
    path('scan/', DomainScanView.as_view(), name='domain_scan'),
]
