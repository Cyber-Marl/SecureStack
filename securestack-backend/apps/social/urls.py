from django.urls import path
from .views import LinkedInAuthorizeView, LinkedInCallbackView, TriggerPostView

urlpatterns = [
    path('linkedin/authorize/', LinkedInAuthorizeView.as_view(), name='linkedin-authorize'),
    path('linkedin/callback/', LinkedInCallbackView.as_view(), name='linkedin-callback'),
    path('post/trigger/', TriggerPostView.as_view(), name='post-trigger'),
]
