from django.contrib import admin
from .models import LinkedInCredential, SocialPost, BlogPost

@admin.register(LinkedInCredential)
class LinkedInCredentialAdmin(admin.ModelAdmin):
    list_display = ('organization_id', 'authorized_at', 'expires_in', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(SocialPost)
class SocialPostAdmin(admin.ModelAdmin):
    list_display = ('platform', 'status', 'created_at', 'published_time')
    list_filter = ('platform', 'status')
    search_fields = ('content', 'error_message', 'linkedin_post_urn')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'date', 'read_time', 'created_at')
    list_filter = ('category', 'status')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
