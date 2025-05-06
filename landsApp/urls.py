"""
URL configuration for landsApp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, register_converter
from . import views
from django.conf import settings
from django.conf.urls.static import static

class SlashConverter:
    regex = '.*'

    def to_python(self, value):
        return value

    def to_url(self, value):
        return value

register_converter(SlashConverter, 'slash')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('lims/', views.lims_dashboard, name='lims_dashboard'),
    path('estates/', views.estates_dashboard, name='estates_dashboard'),
    path('acquisition/', views.acquisition_dashboard, name='acquisition_dashboard'),
    path('resettlement/', views.resettlement_dashboard, name='resettlement_dashboard'),
    
    # User Management
    path('users/', views.user_list, name='user_list'),
    path('users/add/', views.add_user, name='add_user'),
    path('users/roles/', views.user_roles, name='user_roles'),
    path('users/edit/<int:pk>/', views.edit_user, name='edit_user'),
    path('users/delete/<int:pk>/', views.delete_user, name='delete_user'),
    path('users/reset-password/<int:pk>/', views.reset_password, name='reset_password'),
    path('users/activate/<int:pk>/', views.activate_user, name='activate_user'),
    path('users/deactivate/<int:pk>/', views.deactivate_user, name='deactivate_user'),
    
    # Farm Management
    path('farm/add/', views.add_farm, name='add_farm'),
    path('farm/edit/<int:pk>/', views.edit_farm, name='edit_farm'),
    path('farm/delete/<int:pk>/', views.delete_farm, name='delete_farm'),
    
    # Farm Owner Management
    path('owner/add/', views.add_owner, name='add_owner'),
    path('owner/edit/<int:pk>/', views.edit_owner, name='edit_owner'),
    path('owner/delete/<int:pk>/', views.delete_owner, name='delete_owner'),
    
    # Export URLs
    path('export/farms/', views.export_farms_csv, name='export_farms_csv'),
    path('export/owners/', views.export_owners_csv, name='export_owners_csv'),

    # Document Management
    path('farm/<int:farm_id>/documents/', views.view_farm_documents, name='view_farm_documents'),
    path('farm/<int:farm_id>/documents/upload/', views.upload_farm_document, name='upload_farm_document'),
    path('document/<int:document_id>/delete/', views.delete_farm_document, name='delete_farm_document'),

    # Resettlement Officer URLs
    path('resettlement/', views.resettlement_dashboard, name='resettlement_dashboard'),
    path('resettlement/farm-register/', views.farm_register, name='farm_register'),
    path('resettlement/farm/<int:farm_id>/plan-subdivision/', views.plan_subdivision, name='plan_subdivision'),
    path('resettlement/farm/<int:farm_id>/subdivisions/', views.view_subdivisions, name='view_subdivisions'),
    path('resettlement/a2-farm/add/', views.manage_a2_farm, name='manage_a2_farm'),
    path('resettlement/a2-farm/<int:farm_id>/edit/', views.manage_a2_farm, name='manage_a2_farm'),
    path('resettlement/permit/add/', views.manage_permit, name='manage_permit'),
    path('resettlement/permit/<int:permit_id>/edit/', views.manage_permit, name='manage_permit'),
    path('resettlement/permit/<int:permit_id>/print/', views.print_permit, name='print_permit'),
    path('resettlement_dashboard/', views.resettlement_dashboard, name='resettlement_dashboard'),
    path('plan_farm/<int:farm_id>/', views.plan_farm, name='plan_farm'),

    # LIMS Officer URLs
    path('lims/', views.lims_dashboard, name='lims_dashboard'),
    path('lims/parent-farm/add/', views.manage_parent_farm, name='manage_parent_farm'),
    path('lims/parent-farm/<slash:farm_id>/edit/', views.manage_parent_farm, name='manage_parent_farm'),
    path('lims/parent-farms/', views.parent_farm_list, name='parent_farm_list'),
    path('lims/parent-farm/<slash:farm_id>/delete/', views.delete_parent_farm, name='delete_parent_farm'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
