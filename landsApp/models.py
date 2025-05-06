from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class Province(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('lims_officer', 'LIMS Officer'),
        ('estates_officer', 'Estates and Valuations Officer'),
        ('acquisition_officer', 'Acquisition Officer'),
        ('resettlement_officer', 'Resettlement Officer'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_role_display()}"

    @property
    def is_lims_officer(self):
        return self.role == 'lims_officer'

    @property
    def is_estates_officer(self):
        return self.role == 'estates_officer'

    @property
    def is_acquisition_officer(self):
        return self.role == 'acquisition_officer'

    @property
    def is_resettlement_officer(self):
        return self.role == 'resettlement_officer'

class FarmOwner(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    id_number = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Farm(models.Model):
    FARM_CATEGORIES = [
        ('A1', 'A1 Farm'),
        ('A2', 'A2 Farm'),
    ]
    
    GAZETTE_STATUS = [
        ('gazetted', 'Gazetted'),
        ('not_gazetted', 'Not Gazetted'),
    ]

    REGISTRATION_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    farm_name = models.CharField(max_length=200)
    farm_number = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=2, choices=FARM_CATEGORIES)
    gazette_status = models.CharField(max_length=20, choices=GAZETTE_STATUS)
    registration_status = models.CharField(max_length=20, choices=REGISTRATION_STATUS, default='pending')
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    district = models.CharField(max_length=100)
    owner = models.ForeignKey(FarmOwner, on_delete=models.PROTECT)
    area_size = models.DecimalField(max_digits=10, decimal_places=2)
    area_units = models.CharField(max_length=20, default='hectares')
    acquisition_date = models.DateField(null=True, blank=True)
    registration_date = models.DateField()
    created_by = models.ForeignKey(UserProfile, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    previous_district = models.CharField(max_length=100, null=True, blank=True) #old district
    
    def __str__(self):
        return f"{self.farm_name} - {self.get_category_display()}"

class FarmDocument(models.Model):
    DOCUMENT_TYPES = [
        ('title_deed', 'Title Deed'),
        ('offer_letter', 'Offer Letter'),
        ('gazette_notice', 'Gazette Notice'),
        ('survey_diagram', 'Survey Diagram'),
        ('valuation_report', 'Valuation Report'),
        ('other', 'Other'),
    ]

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    document_number = models.CharField(max_length=50)
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    document_file = models.FileField(upload_to='farm_documents/')
    notes = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(UserProfile, on_delete=models.PROTECT)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.farm.farm_name}"

class FarmInspection(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    inspection_date = models.DateField()
    inspector = models.ForeignKey(UserProfile, on_delete=models.PROTECT)
    findings = models.TextField()
    recommendations = models.TextField()
    next_inspection_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Inspection - {self.farm.farm_name} - {self.inspection_date}"

class A2Farm(models.Model):
    ALLOCATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('allocated', 'Allocated'),
        ('rejected', 'Rejected'),
    ]

    farm_name = models.CharField(max_length=200)
    farm_number = models.CharField(max_length=50, unique=True)
    area_size = models.DecimalField(max_digits=10, decimal_places=2)
    area_units = models.CharField(max_length=20, default='hectares')
    district = models.CharField(max_length=100)
    province = models.ForeignKey('Province', on_delete=models.SET_NULL, null=True)
    allocation_status = models.CharField(max_length=20, choices=ALLOCATION_STATUS_CHOICES, default='pending')
    allocation_date = models.DateField(null=True, blank=True)
    registration_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_a2farms')

    def __str__(self):
        return f"{self.farm_name} ({self.farm_number})"

class A2Permit(models.Model):
    PERMIT_STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('printed', 'Printed'),
        ('cancelled', 'Cancelled'),
    ]

    farm = models.ForeignKey(A2Farm, on_delete=models.CASCADE)
    permit_number = models.CharField(max_length=50, unique=True)
    owner_first_name = models.CharField(max_length=100)
    owner_last_name = models.CharField(max_length=100)
    owner_id_number = models.CharField(max_length=50)
    owner_address = models.TextField()
    owner_phone = models.CharField(max_length=20)
    owner_email = models.EmailField(blank=True, null=True)
    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=PERMIT_STATUS_CHOICES, default='pending')
    is_printing_authorized = models.BooleanField(default=False)
    authorized_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='authorized_permits')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_permits')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    printed_at = models.DateTimeField(null=True, blank=True)
    printed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='printed_permits')

    def __str__(self):
        return f"Permit {self.permit_number} - {self.farm.farm_name}"

    @property
    def owner_full_name(self):
        return f"{self.owner_first_name} {self.owner_last_name}"

class PermitPrintHistory(models.Model):
    permit = models.ForeignKey(A2Permit, on_delete=models.CASCADE)
    printed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    printed_at = models.DateTimeField(auto_now_add=True)
    print_reason = models.TextField()

    def __str__(self):
        return f"Print record for {self.permit.permit_number}"

class FarmSubdivision(models.Model):
    SUBDIVISION_TYPES = [
        ('A1', 'A1 Subdivision'),
        ('A2', 'A2 Subdivision'),
    ]

    parent_farm = models.ForeignKey(Farm, on_delete=models.PROTECT, related_name='subdivisions')
    subdivision_number = models.CharField(max_length=50)
    subdivision_type = models.CharField(max_length=2, choices=SUBDIVISION_TYPES)
    area_size = models.DecimalField(max_digits=10, decimal_places=2)
    area_units = models.CharField(max_length=20, default='hectares')
    
    
    _by = models.ForeignKey(UserProfile, on_delete=models.PROTECT, related_name='planned_subdivisions')
    planned_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Farm.REGISTRATION_STATUS, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['parent_farm', 'subdivision_number']

    def __str__(self):
        return f"{self.parent_farm.farm_name} - {self.subdivision_number}"

class ParentFarm(models.Model):
    UNIT_CHOICES = [
        ('hectares', 'Hectares'),
        ('acres', 'Acres'),
        ('morgens', 'Morgens'),
        ('square_meters', 'Square Meters'),
        ('square_kilometers', 'Square Kilometers'),
    ]

    OWNERSHIP_CHOICES = [
        ('private', 'Private'),
        ('state', 'State'),
        ('communal', 'Communal'),
        ('other', 'Other'),
    ]

    GAZETTE_STATUS_CHOICES = [
        ('gazetted', 'Gazetted'),
        ('not_gazetted', 'Not Gazetted'),  # Ensure this matches the form submission
    ]

    FARM_CATEGORY_CHOICES = [
        ('A1', 'A1 Farm'),
        ('A2', 'A2 Farm'),
        ('both', 'Both A1 and A2 Farms'),
    ]

    STATUS_CHOICES = [
        ('not_planned', 'Not Planned'),
        ('planned', 'Planned'),
        ('replanned', 'Replanned'),
    ]

    farm_id = models.CharField(max_length=20, unique=True, help_text="Unique identifier for the farm")
    farm_name = models.CharField(max_length=255)
    farm_number = models.IntegerField(help_text="Enter a number between 0 and 9999", default=0)
    area_size = models.DecimalField(max_digits=15, decimal_places=2)
    area_units = models.CharField(max_length=20, choices=UNIT_CHOICES)
    size_hectares = models.DecimalField(max_digits=15, decimal_places=2, editable=False)
    province = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    previous_district = models.CharField(max_length=50, null=True, blank=True)  # Added field for old district
    title_deed_number = models.CharField(max_length=50)
    title_type = models.CharField(max_length=50)  # Moved next to title_deed_number
    diagram_number = models.CharField(max_length=50)
    gazette_status = models.CharField(max_length=20, choices=GAZETTE_STATUS_CHOICES)
    gazette_date = models.DateField(null=True, blank=True)
    gazette_number = models.CharField(max_length=50, null=True, blank=True)
    general_notice_number = models.CharField(max_length=50, null=True, blank=True)  # Added field
    ownership = models.CharField(max_length=20, choices=OWNERSHIP_CHOICES)
    company_name = models.CharField(max_length=100, null=True, blank=True)
    owner_name = models.CharField(max_length=100, null=True, blank=True)
    nationality = models.CharField(max_length=255, null=False, default='Zimbabwean')
    race = models.CharField(max_length=50, null=True, blank=True)  # Added field for race
    is_planned = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='not_planned',
        help_text="Planning status of the farm"
    )
    remaining_extent = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Remaining area of the farm in hectares"
    )
    state_land = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="State land area in hectares"
    )
    bippa = models.BooleanField(default=False)  # Fixed syntax for default
    bippa_country = models.CharField(max_length=50, null=True, blank=True)  # Fixed max_length
    bonds = models.BooleanField(default=False)
    bonding_institution = models.CharField(max_length=100, null=True, blank=True)
    carvets = models.BooleanField(default=False)
    carvet_institution = models.CharField(max_length=100, null=True, blank=True)
    carvet_number = models.CharField(max_length=50, null=True, blank=True)
    servitudes = models.BooleanField(default=False)
    servitude_institution = models.CharField(max_length=100, null=True, blank=True)
    servitude_number = models.CharField(max_length=50, null=True, blank=True)
    endorsements = models.TextField(blank=True, null=True)  # Added field for endorsements
    farm_activity = models.CharField(max_length=100, null=True, blank=True)  # Added field for farm activity
    natural_region = models.CharField(
        max_length=50,
        choices=[
            ('1', 'Region 1'),
            ('2', 'Region 2'),
            ('3', 'Region 3'),
            ('4', 'Region 4'),
            ('5', 'Region 5'),
        ],
        null=True,
        blank=True,
        help_text="Natural region of the farm"
    )
    farm_category = models.CharField(
        max_length=10,
        choices=FARM_CATEGORY_CHOICES,
        default='both',
        help_text="Category of the farm (A1, A2, or Both)"
    )
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    a1_farms = models.ManyToManyField('A1Farm', blank=True, related_name='parent_farms')
    a2_farms = models.ManyToManyField('A2Farm', blank=True, related_name='parent_farms')

    def __str__(self):
        return f"{self.farm_name} ({self.farm_id})"

    @staticmethod
    def convert_to_hectares(area_size, area_units):
        if not area_size or not area_units:
            return Decimal('0')
        area_size = Decimal(str(area_size))
         
        conversion_rates = {
            'hectares': Decimal('1'),
            'morgens': Decimal('0.856532'),
            'square_roods': Decimal('0.101171'),
            'acres': Decimal('0.404686'),
            'cape_roods': Decimal('0.856532'),
            'square_meters': Decimal('0.0001')
        }
        return area_size * conversion_rates.get(area_units, Decimal('1'))

    def save(self, *args, **kwargs):
        # Convert area to hectares before saving
        self.size_hectares = self.convert_to_hectares(self.area_size, self.area_units)
        # Ensure farm_id is auto-populated
        if not self.farm_id and self.province and self.district and self.farm_number:
            district_code = self.district[:3].lower()  # Take first 3 letters of the district
            province_code = self.province[:3].lower()  # Take first 3 letters of the province
            farm_number = f"{self.farm_number:04d}"  # Ensure farm_number is 4 digits
            self.farm_id = f"{province_code}/{district_code}{farm_number}"
        super().save(*args, **kwargs)

    def get_a1_farm_count(self):
        return self.a1_farms.count()

    def get_a2_farm_count(self):
        return self.a2_farms.count()

    class Meta:
        verbose_name = 'Parent Farm'
        verbose_name_plural = 'Parent Farms'
        ordering = ['farm_name']

class A1Farm(models.Model):
    farm_name = models.CharField(max_length=200)
    farm_number = models.CharField(max_length=50, unique=True)
    area_size = models.DecimalField(max_digits=10, decimal_places=2)
    area_units = models.CharField(max_length=20, default='hectares')
    district = models.CharField(max_length=100)
    province = models.ForeignKey('Province', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.farm_name} ({self.farm_number})"