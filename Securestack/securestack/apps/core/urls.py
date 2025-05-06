from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),  # Map the home page to the 'home' view
    path('services/', views.services, name='services'),
    path('services/<slug:slug>/', views.service_detail, name='service_detail'),
    path('projects/', views.projects, name='projects'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('team/', views.TeamListView.as_view(), name='team'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
]
