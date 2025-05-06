from django.contrib import admin
from .models import Service, Project, TeamMember, Testimonial, ContactMessage, Feature, Benefit

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'created_at', 'updated_at']
    list_filter = ['category']
    search_fields = ['title', 'short_description', 'content']
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ['title', 'service', 'order']
    list_filter = ['service']
    search_fields = ['title', 'description']
    ordering = ['service', 'order']

@admin.register(Benefit)
class BenefitAdmin(admin.ModelAdmin):
    list_display = ['service', 'description', 'order']
    list_filter = ['service']
    search_fields = ['description']
    ordering = ['service', 'order']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'completion_date']
    list_filter = ['completion_date']
    search_fields = ['title', 'description', 'client']
    prepopulated_fields = {'slug': ('title',)}

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position']
    search_fields = ['name', 'position', 'bio']

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'company', 'content']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']