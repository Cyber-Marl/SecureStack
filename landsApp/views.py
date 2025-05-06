from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from .models import UserProfile, Farm, FarmOwner, FarmDocument, A2Farm, A2Permit, PermitPrintHistory, ParentFarm, A1Farm
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator
from .forms import FarmForm, FarmOwnerForm, UserRegistrationForm, UserEditForm, PasswordResetForm, A2FarmForm, A2PermitForm, FarmSubdivisionForm, ParentFarmForm, A1FarmForm
import csv
from django.http import HttpResponse
from django.utils import timezone
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from django.views.decorators.csrf import ensure_csrf_cookie
from django.urls import reverse

@ensure_csrf_cookie
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if not username or not password:
            messages.error(request, 'Please provide both username and password')
            return render(request, 'landsApp/login.html')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                try:
                    user_profile = UserProfile.objects.get(user=user)
                    # Redirect based on user role
                    if user_profile.role == 'lims_officer':
                        return redirect('lims_dashboard')
                    elif user_profile.role == 'estates_officer':
                        return redirect('estates_dashboard')
                    elif user_profile.role == 'acquisition_officer':
                        return redirect('acquisition_dashboard')
                    elif user_profile.role == 'resettlement_officer':
                        return redirect('resettlement_dashboard')
                except UserProfile.DoesNotExist:
                    # Create a default profile if it doesn't exist
                    UserProfile.objects.create(
                        user=user,
                        role='lims_officer',
                        phone_number=''
                    )
                    messages.warning(request, 'User profile was missing and has been created with default settings')
                    return redirect('lims_dashboard')
            else:
                messages.error(request, 'Your account is inactive. Please contact the administrator.')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'landsApp/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def lims_dashboard(request):
    if not request.user.userprofile.is_lims_officer:
        messages.error(request, 'You do not have permission to access the LIMS dashboard.')
        return redirect('home')
    
    # Get statistics for the dashboard
    total_farms = ParentFarm.objects.count()
    planned_farms = ParentFarm.objects.filter(is_planned=True).count()
    unplanned_farms = ParentFarm.objects.filter(is_planned=False).count()
    a1_farms = ParentFarm.objects.filter(farm_category='A1').count()
    a2_farms = ParentFarm.objects.filter(farm_category='A2').count()
    
    # Get recent farms
    recent_farms = ParentFarm.objects.order_by('-created_at')[:5]
    
    # Get recent activity logs
    recent_logs = LogEntry.objects.select_related('user').order_by('-action_time')[:5]
    
    total_a1_farms = A1Farm.objects.count()
    total_a2_farms = A2Farm.objects.count()
    
    # Add edit URLs for farms
    for farm in recent_farms:
        farm.edit_url = reverse('manage_parent_farm', kwargs={'farm_id': farm.farm_id})
    
    context = {
        'total_farms': total_farms,
        'planned_farms': planned_farms,
        'unplanned_farms': unplanned_farms,
        'a1_farms': a1_farms,
        'a2_farms': a2_farms,
        'recent_farms': recent_farms,
        'recent_logs': recent_logs,
        'total_a1_farms': total_a1_farms,
        'total_a2_farms': total_a2_farms,
    }
    return render(request, 'landsApp/lims_dashboard.html', context)

@login_required
def estates_dashboard(request):
    if not request.user.userprofile.is_estates_officer:
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    return render(request, 'landsApp/estates_dashboard.html')

@login_required
def acquisition_dashboard(request):
    if not request.user.userprofile.is_acquisition_officer:
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    return render(request, 'landsApp/acquisition_dashboard.html')

@login_required
def resettlement_dashboard(request):
    parent_farms = ParentFarm.objects.all()
    query = request.GET.get('q')
    if query:
        parent_farms = parent_farms.filter(farm_name__icontains=query)
    return render(request, 'landsApp/resettlement_dashboard.html', {
        'parent_farms': parent_farms
    })

@login_required
def manage_a2_farm(request, farm_id=None):
    if not request.user.userprofile.is_resettlement_officer:
        messages.error(request, 'Access denied. You must be a Resettlement Officer to perform this action.')
        return redirect('login')
    
    if farm_id:
        farm = get_object_or_404(A2Farm, id=farm_id)
        form = A2FarmForm(instance=farm)
    else:
        farm = None
        form = A2FarmForm()
    
    if request.method == 'POST':
        form = A2FarmForm(request.POST, instance=farm)
        if form.is_valid():
            farm = form.save(commit=False)
            farm.created_by = request.user
            farm.save()
            messages.success(request, f'A2 Farm "{farm.farm_name}" has been {"updated" if farm_id else "created"} successfully.')
            return redirect('resettlement_dashboard')
    
    return render(request, 'landsApp/manage_a2_farm.html', {'form': form, 'farm': farm})

@login_required
def manage_permit(request, permit_id=None):
    if not request.user.userprofile.is_resettlement_officer:
        messages.error(request, 'Access denied. You must be a Resettlement Officer to perform this action.')
        return redirect('login')
    
    if permit_id:
        permit = get_object_or_404(A2Permit, id=permit_id)
        form = A2PermitForm(instance=permit)
    else:
        permit = None
        form = A2PermitForm()
    
    if request.method == 'POST':
        form = A2PermitForm(request.POST, instance=permit)
        if form.is_valid():
            permit = form.save(commit=False)
            permit.created_by = request.user
            permit.save()
            messages.success(request, f'Permit {permit.permit_number} has been {"updated" if permit_id else "created"} successfully.')
            return redirect('resettlement_dashboard')
    
    return render(request, 'landsApp/manage_permit.html', {'form': form, 'permit': permit})

@login_required
def print_permit(request, permit_id):
    if not request.user.userprofile.is_resettlement_officer:
        messages.error(request, 'Access denied. You must be a Resettlement Officer to print permits.')
        return redirect('login')
    
    permit = get_object_or_404(A2Permit, id=permit_id)
    if not permit.is_printing_authorized:
        messages.error(request, 'Printing is not authorized for this permit. Please contact the LIMS Officer for authorization.')
        return redirect('resettlement_dashboard')
    
    if request.method == 'POST':
        # Record the print history
        PermitPrintHistory.objects.create(
            permit=permit,
            printed_by=request.user,
            print_reason=request.POST.get('print_reason', '')
        )
        permit.status = 'printed'
        permit.printed_at = timezone.now()
        permit.printed_by = request.user
        permit.save()
        messages.success(request, f'Permit {permit.permit_number} has been marked as printed.')
        
        # Here you would generate and return the actual PDF permit
        return redirect('resettlement_dashboard')
    
    return render(request, 'landsApp/print_permit.html', {'permit': permit})

def is_lims_admin(user):
    return user.is_authenticated and user.userprofile.role == 'lims_officer'

# Farm Management Views
@login_required
def add_farm(request):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    if request.method == 'POST':
        form = FarmForm(request.POST)
        if form.is_valid():
            farm = form.save()
            LogEntry.objects.create(
                user=request.user,
                content_type=ContentType.objects.get_for_model(Farm),
                object_repr=str(farm),
                object_id=farm.id,
                action_flag=ADDITION,
                change_message='Added new farm'
            )
            messages.success(request, 'Farm added successfully')
            return redirect('lims_dashboard')
    else:
        form = FarmForm()
    
    return render(request, 'landsApp/farm_form.html', {'form': form, 'title': 'Add Farm'})

@login_required
def edit_farm(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    farm = get_object_or_404(Farm, pk=pk)
    
    if request.method == 'POST':
        form = FarmForm(request.POST, instance=farm)
        if form.is_valid():
            farm = form.save()
            LogEntry.objects.create(
                user=request.user,
                content_type=ContentType.objects.get_for_model(Farm),
                object_repr=str(farm),
                object_id=farm.id,
                action_flag=CHANGE,
                change_message='Modified farm details'
            )
            messages.success(request, 'Farm updated successfully')
            return redirect('lims_dashboard')
    else:
        form = FarmForm(instance=farm)
    
    return render(request, 'landsApp/farm_form.html', {'form': form, 'title': 'Edit Farm'})

@login_required
def delete_farm(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    farm = get_object_or_404(Farm, pk=pk)
    farm_repr = str(farm)
    
    farm.delete()
    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(Farm),
        object_repr=farm_repr,
        object_id=pk,
        action_flag=DELETION,
        change_message='Deleted farm'
    )
    messages.success(request, 'Farm deleted successfully')
    return redirect('lims_dashboard')

# Farm Owner Management Views
@login_required
def add_owner(request):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    if request.method == 'POST':
        form = FarmOwnerForm(request.POST)
        if form.is_valid():
            owner = form.save()
            LogEntry.objects.create(
                user=request.user,
                content_type=ContentType.objects.get_for_model(FarmOwner),
                object_repr=str(owner),
                object_id=owner.id,
                action_flag=ADDITION,
                change_message='Added new farm owner'
            )
            messages.success(request, 'Farm owner added successfully')
            return redirect('lims_dashboard')
    else:
        form = FarmOwnerForm()
    
    return render(request, 'landsApp/owner_form.html', {'form': form, 'title': 'Add Farm Owner'})

@login_required
def edit_owner(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    owner = get_object_or_404(FarmOwner, pk=pk)
    
    if request.method == 'POST':
        form = FarmOwnerForm(request.POST, instance=owner)
        if form.is_valid():
            owner = form.save()
            LogEntry.objects.create(
                user=request.user,
                content_type=ContentType.objects.get_for_model(FarmOwner),
                object_repr=str(owner),
                object_id=owner.id,
                action_flag=CHANGE,
                change_message='Modified farm owner details'
            )
            messages.success(request, 'Farm owner updated successfully')
            return redirect('lims_dashboard')
    else:
        form = FarmOwnerForm(instance=owner)
    
    return render(request, 'landsApp/owner_form.html', {'form': form, 'title': 'Edit Farm Owner'})

@login_required
def delete_owner(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    owner = get_object_or_404(FarmOwner, pk=pk)
    owner_repr = str(owner)
    
    owner.delete()
    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(FarmOwner),
        object_repr=owner_repr,
        object_id=pk,
        action_flag=DELETION,
        change_message='Deleted farm owner'
    )
    messages.success(request, 'Farm owner deleted successfully')
    return redirect('lims_dashboard')

# User Management Views
@login_required
@user_passes_test(is_lims_admin)
def user_list(request):
    # Get all users and order them by username
    users = User.objects.select_related('userprofile').all().order_by('username')
    
    # Ensure all users have profiles
    for user in users:
        UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'role': 'lims_officer',
                'phone_number': ''
            }
        )
    
    # Add pagination
    paginator = Paginator(users, 10)  # Show 10 users per page
    page = request.GET.get('page')
    users = paginator.get_page(page)
    
    return render(request, 'landsApp/user_list.html', {
        'users': users,
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count()
    })

@login_required
@user_passes_test(is_lims_admin)
def add_user(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Log the user creation
            LogEntry.objects.create(
                user=request.user,
                content_type=ContentType.objects.get_for_model(User),
                object_repr=str(user),
                object_id=user.id,
                action_flag=ADDITION,
                change_message='Created new user account'
            )
            messages.success(request, f'User {user.username} created successfully')
            return redirect('lims_dashboard')
    else:
        form = UserRegistrationForm()
    return render(request, 'landsApp/add_user.html', {'form': form})

@login_required
@user_passes_test(is_lims_admin)
def edit_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    # Create UserProfile if it doesn't exist
    user_profile, created = UserProfile.objects.get_or_create(
        user=user,
        defaults={'role': 'lims_officer'}  # Default role for existing users
    )
    
    if request.method == 'POST':
        form = UserEditForm(request.POST, instance=user)
        if form.is_valid():
            user = form.save()
            user_profile.role = form.cleaned_data['role']
            user_profile.phone_number = form.cleaned_data.get('phone_number', '')
            user_profile.save()
            messages.success(request, 'User updated successfully')
            return redirect('user_list')
    else:
        initial_data = {
            'role': user_profile.role,
            'phone_number': user_profile.phone_number
        }
        form = UserEditForm(instance=user, initial=initial_data)
    return render(request, 'landsApp/edit_user.html', {'form': form, 'user': user})

@login_required
@user_passes_test(is_lims_admin)
def delete_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    if request.method == 'POST':
        user.delete()
        messages.success(request, 'User deleted successfully')
        return redirect('user_list')
    return render(request, 'landsApp/delete_user.html', {'user': user})

@login_required
@user_passes_test(is_lims_admin)
def user_roles(request):
    roles = [
        {'id': 'estates_officer', 'name': 'Estates and Valuations Officer'},
        {'id': 'lims_officer', 'name': 'LIMS Officer'},
        {'id': 'resettlement_officer', 'name': 'Resettlement Officer'},
        {'id': 'acquisition_officer', 'name': 'Acquisition Officer'}
    ]
    return render(request, 'landsApp/user_roles.html', {'roles': roles})

@login_required
def reset_password(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    user = get_object_or_404(User, pk=pk)
    
    if request.method == 'POST':
        form = PasswordResetForm(user, request.POST)
        if form.is_valid():
            form.save()
            LogEntry.objects.create(
                user=request.user,
                content_type=ContentType.objects.get_for_model(User),
                object_repr=str(user),
                object_id=user.id,
                action_flag=CHANGE,
                change_message='Reset user password'
            )
            messages.success(request, 'Password reset successfully')
            return redirect('lims_dashboard')
    else:
        form = PasswordResetForm(user)
    return render(request, 'landsApp/password_reset_form.html', {
        'form': form,
        'title': f'Reset Password for {user.username}'
    })

@login_required
def activate_user(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    user = get_object_or_404(User, pk=pk)
    user.is_active = True
    user.save()
    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(User),
        object_repr=str(user),
        object_id=user.id,
        action_flag=CHANGE,
        change_message='Activated user account'
    )
    messages.success(request, 'User activated successfully')
    return redirect('lims_dashboard')

@login_required
def deactivate_user(request, pk):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    user = get_object_or_404(User, pk=pk)
    if user == request.user:
        messages.error(request, 'You cannot deactivate your own account')
        return redirect('lims_dashboard')
    
    user.is_active = False
    user.save()
    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(User),
        object_repr=str(user),
        object_id=user.id,
        action_flag=CHANGE,
        change_message='Deactivated user account'
    )
    messages.success(request, 'User deactivated successfully')
    return redirect('lims_dashboard')

# Export Functions
@login_required
def export_farms_csv(request):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="farms_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    writer = csv.writer(response)
    writer.writerow(['Farm Name', 'Farm Number', 'Owner', 'Category', 'Size', 'Location', 
                    'Registration Date', 'Gazette Status', 'Registration Status', 'Province'])

    farms = Farm.objects.select_related('owner', 'province').all()
    for farm in farms:
        writer.writerow([
            farm.farm_name,
            farm.farm_number,
            f"{farm.owner.first_name} {farm.owner.last_name}",
            farm.category,
            farm.size,
            farm.location,
            farm.registration_date.strftime('%Y-%m-%d'),
            farm.gazette_status,
            farm.registration_status,
            farm.province.name if farm.province else ''
        ])

    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(Farm),
        action_flag=ADDITION,
        change_message='Exported farms data to CSV'
    )

    return response

@login_required
def export_owners_csv(request):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="farm_owners_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    writer = csv.writer(response)
    writer.writerow(['First Name', 'Last Name', 'ID Number', 'Phone Number', 'Email', 
                    'Address', 'Gender', 'Date of Birth', 'Number of Farms'])

    owners = FarmOwner.objects.all()
    for owner in owners:
        writer.writerow([
            owner.first_name,
            owner.last_name,
            owner.id_number,
            owner.phone_number,
            owner.email,
            owner.address,
            owner.gender,
            owner.date_of_birth.strftime('%Y-%m-%d'),
            owner.farm_set.count()
        ])

    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(FarmOwner),
        action_flag=ADDITION,
        change_message='Exported farm owners data to CSV'
    )

    return response

# Document Upload Views
@login_required
def upload_farm_document(request, farm_id):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')

    farm = get_object_or_404(Farm, pk=farm_id)
    if request.method == 'POST' and request.FILES.get('document'):
        document = request.FILES['document']
        document_type = request.POST.get('document_type')
        document_number = request.POST.get('document_number')
        
        # Create documents directory if it doesn't exist
        documents_dir = os.path.join(settings.MEDIA_ROOT, 'farm_documents', str(farm_id))
        os.makedirs(documents_dir, exist_ok=True)
        
        # Save file
        fs = FileSystemStorage(location=documents_dir)
        filename = fs.save(document.name, document)
        
        # Create document record
        FarmDocument.objects.create(
            farm=farm,
            document_type=document_type,
            document_number=document_number,
            file_path=os.path.join('farm_documents', str(farm_id), filename),
            uploaded_by=request.user
        )
        
        LogEntry.objects.create(
            user=request.user,
            content_type=ContentType.objects.get_for_model(FarmDocument),
            action_flag=ADDITION,
            change_message=f'Uploaded document {filename} for farm {farm.farm_name}'
        )
        messages.success(request, 'Document uploaded successfully')
        return redirect('view_farm', pk=farm_id)
    
    return render(request, 'landsApp/upload_document.html', {
        'farm': farm,
        'title': f'Upload Document for {farm.farm_name}'
    })

@login_required
def view_farm_documents(request, farm_id):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')
    
    farm = get_object_or_404(Farm, pk=farm_id)
    documents = FarmDocument.objects.filter(farm=farm).order_by('-upload_date')
    
    return render(request, 'landsApp/farm_documents.html', {
        'farm': farm,
        'documents': documents,
        'title': f'Documents for {farm.farm_name}'
    })

@login_required
def delete_farm_document(request, document_id):
    if not request.user.userprofile.role == 'lims_officer':
        messages.error(request, 'Unauthorized access')
        return redirect('login')

    document = get_object_or_404(FarmDocument, pk=document_id)
    farm_id = document.farm.id
    file_path = os.path.join(settings.MEDIA_ROOT, document.file_path)
    
    # Delete file from storage
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete database record
    document.delete()
    
    LogEntry.objects.create(
        user=request.user,
        content_type=ContentType.objects.get_for_model(FarmDocument),
        action_flag=DELETION,
        change_message=f'Deleted document for farm {document.farm.farm_name}'
    )
    messages.success(request, 'Document deleted successfully')
    return redirect('view_farm_documents', farm_id=farm_id)

@login_required
def farm_register(request):
    if not request.user.userprofile.role == 'resettlement_officer':
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('lims_dashboard')
    
    farms = Farm.objects.all().order_by('-created_at')
    context = {
        'farms': farms,
        'title': 'Farm Register'
    }
    return render(request, 'landsApp/farm_register.html', context)

@login_required
def plan_subdivision(request, farm_id):
    if not request.user.userprofile.role == 'resettlement_officer':
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('lims_dashboard')
    
    try:
        farm = Farm.objects.get(pk=farm_id)
    except Farm.DoesNotExist:
        messages.error(request, 'Farm not found.')
        return redirect('farm_register')
    
    if request.method == 'POST':
        form = FarmSubdivisionForm(request.POST)
        if form.is_valid():
            subdivision = form.save(commit=False)
            subdivision.parent_farm = farm
            subdivision.planned_by = request.user.userprofile
            subdivision.save()
            messages.success(request, 'Subdivision planned successfully.')
            return redirect('view_subdivisions', farm_id=farm.id)
    else:
        form = FarmSubdivisionForm()
    
    context = {
        'form': form,
        'farm': farm,
        'title': f'Plan Subdivision - {farm.farm_name}'
    }
    return render(request, 'landsApp/plan_subdivision.html', context)

@login_required
def view_subdivisions(request, farm_id):
    if not request.user.userprofile.role == 'resettlement_officer':
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('lims_dashboard')
    
    try:
        farm = Farm.objects.get(pk=farm_id)
        subdivisions = farm.subdivisions.all().order_by('subdivision_number')
    except Farm.DoesNotExist:
        messages.error(request, 'Farm not found.')
        return redirect('farm_register')
    
    context = {
        'farm': farm,
        'subdivisions': subdivisions,
        'title': f'Subdivisions - {farm.farm_name}'
    }
    return render(request, 'landsApp/view_subdivisions.html', context)

@login_required
def manage_parent_farm(request, farm_id=None):
    if not request.user.userprofile.is_lims_officer:
        messages.error(request, 'You do not have permission to manage parent farms.')
        return redirect('home')
    
    farm = None
    if farm_id:
        farm = get_object_or_404(ParentFarm, farm_id=farm_id)
    
    if request.method == 'POST':
        form = ParentFarmForm(request.POST, instance=farm)
        if form.is_valid():
            farm = form.save(commit=False)
            if not farm_id:  # New farm
                farm.created_by = request.user
            farm.updated_by = request.user
            farm.save()
            
            # Log the action
            action = ADDITION if not farm_id else CHANGE
            LogEntry.objects.log_action(
                user_id=request.user.id,
                content_type_id=ContentType.objects.get_for_model(ParentFarm).id,
                object_id=farm.id,
                object_repr=str(farm),
                action_flag=action,
                change_message='Added new farm' if not farm_id else 'Updated farm details'
            )
            
            messages.success(request, f'Farm {"created" if not farm_id else "updated"} successfully.')
            return redirect('parent_farm_list')
    else:
        form = ParentFarmForm(instance=farm)
    
    context = {
        'form': form,
        'farm': farm,
        'is_edit': farm_id is not None
    }
    return render(request, 'landsApp/manage_parent_farm.html', context)

@login_required
def delete_parent_farm(request, farm_id):
    if not request.user.userprofile.is_lims_officer:
        messages.error(request, 'You do not have permission to delete parent farms.')
        return redirect('lims_dashboard')
    
    farm = get_object_or_404(ParentFarm, farm_id=farm_id)
    farm_name = farm.farm_name
    
    if request.method == 'POST':
        farm.delete()
        messages.success(request, f'Parent Farm "{farm_name}" has been deleted successfully.')
        return redirect('parent_farm_list')
    
    return render(request, 'landsApp/delete_parent_farm.html', {
        'farm': farm,
        'title': 'Delete Parent Farm'
    })

@login_required
def parent_farm_list(request):
    if not request.user.userprofile.is_lims_officer:
        messages.error(request, 'You do not have permission to view parent farms.')
        return redirect('home')
    
    farms = ParentFarm.objects.all().order_by('-created_at')
    
    # Add pagination
    paginator = Paginator(farms, 10)
    page = request.GET.get('page')
    farms = paginator.get_page(page)
    
    context = {
        'farms': farms,
    }
    return render(request, 'landsApp/parent_farm_list.html', context)

def plan_farm(request, parent_farm_id):
    parent_farm = get_object_or_404(ParentFarm, pk=parent_farm_id)
    
    if request.method == 'POST':
        a1_form = A1FarmForm(request.POST, prefix='a1')
        a2_form = A2FarmForm(request.POST, prefix='a2')

        if a1_form.is_valid() and a2_form.is_valid():
            # Create A1 farms
            for _ in range(int(request.POST.get('a1_count', 0))):
                a1_farm = a1_form.save(commit=False)
                a1_farm.save()
                parent_farm.a1_farms.add(a1_farm)
            
            # Create A2 farms
            for _ in range(int(request.POST.get('a2_count', 0))):
                a2_farm = a2_form.save(commit=False)
                a2_farm.save()
                parent_farm.a2_farms.add(a2_farm)
            
            # Mark the parent farm as planned
            parent_farm.is_planned = True
            parent_farm.save()

            return redirect('resettlement_dashboard')
    else:
        a1_form = A1FarmForm(prefix='a1')
        a2_form = A2FarmForm(prefix='a2')
    
    return render(request, 'landsApp/plan_farm.html', {
        'a1_form': a1_form,
        'a2_form': a2_form,
        'parent_farm': parent_farm,
    })