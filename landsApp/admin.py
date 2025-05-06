from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import (
    Province,
    UserProfile,
    FarmOwner,
    Farm,
    FarmDocument,
    FarmInspection
)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role')
    
    def get_role(self, obj):
        try:
            return obj.userprofile.get_role_display()
        except UserProfile.DoesNotExist:
            return '-'
    get_role.short_description = 'Role'

class FarmOwnerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'id_number', 'phone_number', 'email')
    search_fields = ('first_name', 'last_name', 'id_number')
    list_filter = ('created_at',)

class FarmAdmin(admin.ModelAdmin):
    list_display = ('farm_name', 'farm_number', 'category', 'gazette_status', 'registration_status', 'province', 'owner')
    list_filter = ('category', 'gazette_status', 'registration_status', 'province')
    search_fields = ('farm_name', 'farm_number', 'owner__first_name', 'owner__last_name')
    date_hierarchy = 'registration_date'

class FarmDocumentAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'farm', 'document_number', 'issue_date', 'uploaded_by')
    list_filter = ('document_type', 'issue_date')
    search_fields = ('document_number', 'farm__farm_name')
    date_hierarchy = 'issue_date'

class FarmInspectionAdmin(admin.ModelAdmin):
    list_display = ('farm', 'inspection_date', 'inspector', 'next_inspection_date')
    list_filter = ('inspection_date', 'inspector')
    search_fields = ('farm__farm_name', 'findings')
    date_hierarchy = 'inspection_date'

# Unregister the default User admin and register with custom admin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Register other models
admin.site.register(Province)
admin.site.register(FarmOwner, FarmOwnerAdmin)
admin.site.register(Farm, FarmAdmin)
admin.site.register(FarmDocument, FarmDocumentAdmin)
admin.site.register(FarmInspection, FarmInspectionAdmin) 