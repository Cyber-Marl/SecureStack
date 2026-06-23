from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Prefix-less paths (production deployment under /api sub-path where Passenger strips /api)
    path('', include('apps.contact.urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('scanner/', include('apps.scanner.urls')),
    path('affiliate/', include('apps.affiliate.urls')),
    path('social/', include('apps.social.urls')),

    # Paths with 'api/' prefix (local development)
    path('api/', include('apps.contact.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/scanner/', include('apps.scanner.urls')),
    path('api/affiliate/', include('apps.affiliate.urls')),
    path('api/social/', include('apps.social.urls')),
]
