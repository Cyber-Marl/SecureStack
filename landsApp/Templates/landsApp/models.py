from django.db import models

class ParentFarm(models.Model):
    farm_id = models.CharField(max_length=20, unique=True)  # Format: province/district+farm_number
    farm_name = models.CharField(max_length=100)
    area_size = models.DecimalField(max_digits=10, decimal_places=2)
    area_units = models.CharField(max_length=20)
    ownership = models.CharField(max_length=50)
    owner_name = models.CharField(max_length=100)
    race = models.CharField(max_length=50)  # Added field for race
    company_name = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=50)
    gazette_status = models.CharField(max_length=20, choices=[('gazetted', 'Gazetted'), ('non-gazetted', 'Non-Gazetted')])
    diagram_number = models.CharField(max_length=50, blank=True, null=True)
    title_type = models.CharField(max_length=50)
    title_deed_number = models.CharField(max_length=50, blank=True, null=True)
    province = models.CharField(max_length=50)
    previous_district = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    farm_activity = models.CharField(max_length=50)
    endorsements = models.TextField(blank=True, null=True)  # Added field for endorsements
    remarks = models.TextField(blank=True, null=True)
    owners_address = models.TextField(blank=True, null=True)
    bippa = models.CharField(max_length=10, choices=[('yes', 'Yes'), ('no', 'No')], blank=True, null=True)
    bippa_country = models.CharField(max_length=50, blank=True, null=True)
    bonds = models.CharField(max_length=10, choices=[('yes', 'Yes'), ('no', 'No')], blank=True, null=True)
    bonding_institution = models.CharField(max_length=100, blank=True, null=True)
    carvets = models.CharField(max_length=10, choices=[('yes', 'Yes'), ('no', 'No')], blank=True, null=True)
    carvet_institution = models.CharField(max_length=100, blank=True, null=True)
    carvet_number = models.CharField(max_length=50, blank=True, null=True)
    servitudes = models.CharField(max_length=10, choices=[('yes', 'Yes'), ('no', 'No')], blank=True, null=True)
    servitudes_institution = models.CharField(max_length=100, blank=True, null=True)
    servitude_number = models.CharField(max_length=50, blank=True, null=True)
    farm_category = models.CharField(max_length=50, blank=True, null=True)
    natural_region = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        # Generate farm_id in the format province/district+farm_number
        if not self.farm_id:
            district_code = self.district[:3].lower()  # Take first 3 letters of the district
            province_code = self.province[:3].lower()  # Take first 3 letters of the province
            farm_number = f"{int(self.area_size):04d}"  # Ensure farm_number is 4 digits
            self.farm_id = f"{province_code}/{district_code}{farm_number}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.farm_name
