from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from .models import Farm, FarmOwner, UserProfile, A2Farm, A2Permit, FarmSubdivision, ParentFarm, A1Farm
from django.db.models import Sum
import re

# Define NATIONALITY_CHOICES
NATIONALITY_CHOICES = [
    ('Zimbabwean', 'Zimbabwean'),
    ('South African', 'South African'),
    ('Zambian', 'Zambian'),
    ('Mozambican', 'Mozambican'),
    ('Botswanan', 'Botswanan'),
    ('Namibian', 'Namibian'),
    ('British', 'British'),
    ('Chinese', 'Chinese'),
    ('American', 'American'),
    ('Canadian', 'Canadian'),
    ('Australian', 'Australian'),
    ('Indian', 'Indian'),
    ('German', 'German'),
    ('French', 'French'),
    ('Japanese', 'Japanese'),
    ('Brazilian', 'Brazilian'),
    ('Russian', 'Russian'),
    ('Other', 'Other'),
]

class FarmForm(forms.ModelForm):
    class Meta:
        model = Farm
        fields = [
            # List only the fields that exist in the Farm model
            'farm_name', 'farm_number', 'category', 'gazette_status',
            'registration_status', 'province', 'district', 'owner',
            'area_size', 'area_units', 'acquisition_date', 'registration_date',
            'created_by'
        ]
        widgets = {
            'farm_name': forms.TextInput(attrs={'class': 'form-control'}),
            'farm_number': forms.TextInput(attrs={'class': 'form-control'}),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'gazette_status': forms.Select(attrs={'class': 'form-control'}),
            'registration_status': forms.Select(attrs={'class': 'form-control'}),
            'province': forms.Select(attrs={'class': 'form-control'}),
            'district': forms.TextInput(attrs={'class': 'form-control'}),
            'owner': forms.Select(attrs={'class': 'form-control'}),
            'area_size': forms.NumberInput(attrs={'class': 'form-control'}),
            'area_units': forms.Select(attrs={'class': 'form-control'}),
            'acquisition_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'registration_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'created_by': forms.Select(attrs={'class': 'form-control'}),
        }

    def clean_farm_number(self):
        farm_number = self.cleaned_data.get('farm_number')
        if self.instance.pk:  # If editing existing farm
            if Farm.objects.filter(farm_number=farm_number).exclude(pk=self.instance.pk).exists():
                raise forms.ValidationError('A farm with this number already exists.')
        else:  # If creating new farm
            if Farm.objects.filter(farm_number=farm_number).exists():
                raise forms.ValidationError('A farm with this number already exists.')
        return farm_number

class FarmOwnerForm(forms.ModelForm):
    class Meta:
        model = FarmOwner
        fields = ['first_name', 'last_name', 'id_number', 'phone_number', 'email', 
                 'address', 'gender', 'date_of_birth']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean_id_number(self):
        id_number = self.cleaned_data.get('id_number')
        if self.instance.pk:  # If editing existing owner
            if FarmOwner.objects.filter(id_number=id_number).exclude(pk=self.instance.pk).exists():
                raise forms.ValidationError('An owner with this ID number already exists.')
        else: # If creating new owner
            if FarmOwner.objects.filter(id_number=id_number).exists():
                raise forms.ValidationError('An owner with this ID number already exists.')
        return id_number

class UserRegistrationForm(UserCreationForm):
    role = forms.ChoiceField(choices=UserProfile.ROLE_CHOICES)
    phone_number = forms.CharField(max_length=20, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'role', 'phone_number']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True
        
        # Add help text for password fields
        self.fields['password1'].help_text = 'Your password must contain at least 8 characters.'
        self.fields['password2'].help_text = 'Enter the same password as before, for verification.'

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            UserProfile.objects.create(
                user=user,
                role=self.cleaned_data['role'],
                phone_number=self.cleaned_data['phone_number']
            )
        return user

class UserEditForm(forms.ModelForm):
    role = forms.ChoiceField(choices=UserProfile.ROLE_CHOICES)
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'is_active']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            try:
                self.fields['role'].initial = self.instance.userprofile.role
            except UserProfile.DoesNotExist:
                pass

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            UserProfile.objects.update_or_create(
                user=user,
                defaults={'role': self.cleaned_data['role']}
            )
        return user

class PasswordResetForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove the old password field requirement for admin password reset
        self.fields.pop('old_password', None)

class A2FarmForm(forms.ModelForm):
    class Meta:
        model = A2Farm
        fields = ['farm_name', 'farm_number', 'area_size', 'area_units', 'district', 'province', 
                 'allocation_status', 'allocation_date', 'registration_date']
        widgets = {
            'allocation_date': forms.DateInput(attrs={'type': 'date'}),
            'registration_date': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean_farm_number(self):
        farm_number = self.cleaned_data.get('farm_number')
        if farm_number:
            # Check if farm number exists, excluding the current instance in case of updates
            exists = A2Farm.objects.filter(farm_number=farm_number)
            if self.instance.pk:
                exists = exists.exclude(pk=self.instance.pk)
            if exists.exists():
                raise forms.ValidationError('This farm number already exists.')
        return farm_number

class A2PermitForm(forms.ModelForm):
    class Meta:
        model = A2Permit
        fields = ['farm', 'permit_number', 'owner_first_name', 'owner_last_name', 'owner_id_number',
                 'owner_address', 'owner_phone', 'owner_email', 'issue_date', 'expiry_date', 'status']
        widgets = {
            'issue_date': forms.DateInput(attrs={'type': 'date'}),
            'expiry_date': forms.DateInput(attrs={'type': 'date'}),
            'owner_address': forms.Textarea(attrs={'rows': 3}),
        }

    def clean_permit_number(self):
        permit_number = self.cleaned_data.get('permit_number')
        if permit_number:
            # Check if permit number exists, excluding the current instance in case of updates
            exists = A2Permit.objects.filter(permit_number=permit_number)
            if self.instance.pk:
                exists = exists.exclude(pk=self.instance.pk)
            if exists.exists():
                raise forms.ValidationError('This permit number already exists.')
        return permit_number

    def clean_owner_id_number(self):
        id_number = self.cleaned_data.get('owner_id_number')
        if id_number:
            # Validate ID number format (you can customize this based on your requirements)
            if not re.match(r'^\d{2}-\d{6,7}[A-Z]\d{2}$', id_number):
                raise forms.ValidationError('Invalid ID number format. Expected format: XX-XXXXXXX(X)YZZ')
        return id_number

class FarmSubdivisionForm(forms.ModelForm):
    class Meta:
        model = FarmSubdivision
        fields = ['subdivision_number', 'subdivision_type', 'area_size', 'area_units', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 4}),
        }

    def clean(self):
        cleaned_data = super().clean()
        parent_farm = self.instance.parent_farm
        subdivision_number = cleaned_data.get('subdivision_number')
        area_size = cleaned_data.get('area_size')

        # Check if subdivision number is unique for this parent farm
        if FarmSubdivision.objects.filter(
            parent_farm=parent_farm,
            subdivision_number=subdivision_number
        ).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError('This subdivision number already exists for this farm.')

        # Validate total area of subdivisions doesn't exceed parent farm area
        if area_size:
            total_subdivision_area = FarmSubdivision.objects.filter(
                parent_farm=parent_farm
            ).exclude(pk=self.instance.pk).aggregate(
                total=Sum('area_size')
            )['total'] or 0
            total_subdivision_area += area_size

            if total_subdivision_area > parent_farm.area_size:
                raise forms.ValidationError(
                    f'Total area of subdivisions ({total_subdivision_area} {cleaned_data.get("area_units")}) '
                    f'cannot exceed parent farm area ({parent_farm.area_size} {parent_farm.area_units})'
                )

        return cleaned_data

class ParentFarmForm(forms.ModelForm):
    nationality = forms.ChoiceField(
        choices=NATIONALITY_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    is_planned = forms.ChoiceField(
        choices=ParentFarm.STATUS_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=True
    )

    class Meta:
        model = ParentFarm
        fields = [
            'farm_id', 'farm_name', 'farm_number', 'area_size', 'area_units',
            'province', 'district', 'previous_district', 'title_deed_number',
            'title_type', 'diagram_number', 'gazette_status', 'gazette_date',
            'gazette_number', 'general_notice_number', 'ownership', 'company_name',
            'owner_name', 'nationality', 'race', 'is_planned', 'bippa', 'bippa_country',
            'bonds', 'bonding_institution', 'carvets', 'carvet_institution',
            'carvet_number', 'servitudes', 'servitude_institution', 'servitude_number',
            'endorsements', 'farm_activity', 'natural_region', 'remarks'
        ]
        widgets = {
            'farm_id': forms.TextInput(attrs={'class': 'form-control', 'readonly': True}),
            'farm_name': forms.TextInput(attrs={'class': 'form-control'}),
            'farm_number': forms.NumberInput(attrs={'class': 'form-control', 'min': '0', 'max': '9999'}),
            'province': forms.Select(attrs={'class': 'form-control'}),
            'district': forms.Select(attrs={'class': 'form-control'}),
            'previous_district': forms.TextInput(attrs={'class': 'form-control'}),
            'area_size': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'area_units': forms.Select(attrs={'class': 'form-control'}),
            'title_deed_number': forms.TextInput(attrs={'class': 'form-control'}),
            'title_type': forms.Select(attrs={'class': 'form-control'}),
            'diagram_number': forms.TextInput(attrs={'class': 'form-control'}),
            'gazette_status': forms.Select(attrs={'class': 'form-control'}),
            'gazette_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'gazette_number': forms.TextInput(attrs={'class': 'form-control'}),
            'general_notice_number': forms.TextInput(attrs={'class': 'form-control'}),
            'ownership': forms.Select(attrs={'class': 'form-control'}),
            'company_name': forms.TextInput(attrs={'class': 'form-control'}),
            'owner_name': forms.TextInput(attrs={'class': 'form-control'}),
            'race': forms.Select(attrs={'class': 'form-control'}),
            'bippa': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'bippa_country': forms.TextInput(attrs={'class': 'form-control'}),
            'bonds': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'bonding_institution': forms.TextInput(attrs={'class': 'form-control'}),
            'carvets': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'carvet_institution': forms.TextInput(attrs={'class': 'form-control'}),
            'carvet_number': forms.TextInput(attrs={'class': 'form-control'}),
            'servitudes': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'servitude_institution': forms.TextInput(attrs={'class': 'form-control'}),
            'servitude_number': forms.TextInput(attrs={'class': 'form-control'}),
            'endorsements': forms.TextInput(attrs={'class': 'form-control'}),
            'farm_activity': forms.Select(attrs={'class': 'form-control'}),
            'natural_region': forms.Select(attrs={'class': 'form-control'}),
            'remarks': forms.Textarea(attrs={'class': 'form-control', 'rows': 3})
        }

    def clean_farm_id(self):
        farm_id = self.cleaned_data['farm_id']
        if ParentFarm.objects.filter(farm_id=farm_id).exists():
            if self.instance and self.instance.farm_id == farm_id:
                return farm_id
            raise forms.ValidationError('This farm ID already exists.')
        return farm_id

    def clean(self):
        cleaned_data = super().clean()
        area_size = cleaned_data.get('area_size')
        area_units = cleaned_data.get('area_units')

        if area_size and area_units:
            # Convert to hectares for validation
            hectares = ParentFarm.convert_to_hectares(area_size, area_units)
            if hectares <= 0:
                raise forms.ValidationError('Area size must be greater than 0.')
            cleaned_data['size_hectares'] = hectares

        return cleaned_data

class A1FarmForm(forms.ModelForm):
    class Meta:
        model = A1Farm
        fields = ['farm_name', 'farm_number', 'area_size', 'area_units', 'district', 'province']
        widgets = {
            'farm_name': forms.TextInput(attrs={'class': 'form-control'}),
            'farm_number': forms.TextInput(attrs={'class': 'form-control'}),
            'area_size': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'area_units': forms.Select(attrs={'class': 'form-control'}),
            'district': forms.TextInput(attrs={'class': 'form-control'}),
            'province': forms.Select(attrs={'class': 'form-control'}),
        }

    def clean_farm_number(self):
        farm_number = self.cleaned_data.get('farm_number')
        if farm_number:
            # Check if farm number exists, excluding the current instance in case of updates
            exists = A1Farm.objects.filter(farm_number=farm_number)
            if self.instance.pk:
                exists = exists.exclude(pk=self.instance.pk)
            if exists.exists():
                raise forms.ValidationError('This farm number already exists.')
        return farm_number

from .models import ParentFarm

class PlanFarmForm(forms.ModelForm):
    model_field = forms.ChoiceField(
        choices=[
            ('A1', 'A1'),
            ('A2', 'A2'),
            ('A1/A2', 'A1/A2')
        ],
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    a1_type = forms.ChoiceField(
        choices=[
            ('villagized', 'A1 Villagized'),
            ('self_contained', 'A1 Self Contained'),
            ('3_tier', '3 Tier')
        ],
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    number_of_a1 = forms.IntegerField(
        widget=forms.NumberInput(attrs={'class': 'form-control', 'min': 0})
    )
    number_of_a2 = forms.IntegerField(
        widget=forms.NumberInput(attrs={'class': 'form-control', 'min': 0})
    )
    remarks = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        required=False
    )

    class Meta:
        model = ParentFarm
        fields = [
            'farm_name', 'farm_id', 'remaining_extent', 'state_land', 'is_planned', 'remarks'
        ]
        widgets = {
            'farm_name': forms.TextInput(attrs={'class': 'form-control', 'readonly': True}),
            'farm_id': forms.TextInput(attrs={'class': 'form-control', 'readonly': True}),
            'remaining_extent': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'state_land': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'is_planned': forms.Select(attrs={'class': 'form-control'}),
        }