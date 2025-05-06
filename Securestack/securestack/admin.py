from django.contrib import admin
from .models import Service, Project, Testimonial, TeamMember, ContactMessage

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'description')
    list_filter = ('is_active',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'service', 'client_name', 'completion_date', 'is_featured', 'is_active')
    list_editable = ('is_featured', 'is_active')
    search_fields = ('title', 'description', 'client_name')
    list_filter = ('service', 'is_featured', 'is_active', 'completion_date')
    date_hierarchy = 'completion_date'

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'company', 'rating', 'is_active')
    list_editable = ('rating', 'is_active')
    search_fields = ('client_name', 'company', 'content')
    list_filter = ('rating', 'is_active')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('name', 'position', 'bio')
    list_filter = ('is_active',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
    list_editable = ('is_read',)
    search_fields = ('name', 'email', 'subject', 'message')
    list_filter = ('is_read', 'created_at')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at' 