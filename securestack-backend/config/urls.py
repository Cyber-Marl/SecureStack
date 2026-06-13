from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.contact.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/scanner/', include('apps.scanner.urls')),
    path('api/affiliate/', include('apps.affiliate.urls')),
    path('api/social/', include('apps.social.urls')),
]
