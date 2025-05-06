from django.db import migrations

def populate_parent_farms(apps, schema_editor):
    ParentFarm = apps.get_model('landsApp', 'ParentFarm')
    
    # Sample data for parent farms
    dummy_farms = [
        {
            'farm_id': 'PF001',
            'farm_name': 'Green Valley Farm',
            'area_size': 1000.00,
            'area_units': 'hectares',
            'size_hectares': 1000.00,
            'province': 'Mashonaland Central',
            'district': 'Bindura',
            'natural_region': 'Region II',
            'farm_category': 'A1',
            'title_deed_number': 'TD001',
            'title_type': 'Lease',
            'gazette_status': 'gazetted',
            'gazette_date': '2024-01-15',
            'gazette_number': 'GZ001',
            'diagram_number': 'D001',
            'farm_activity': 'Mixed Farming',
            'ownership': 'private',
            'company_name': 'Green Valley Holdings',
            'owner_name': 'John Smith',
            'nationality': 'Zimbabwean',
            'is_planned': True
        },
        {
            'farm_id': 'PF002',
            'farm_name': 'Sunrise Estate',
            'area_size': 2500.00,
            'area_units': 'hectares',
            'size_hectares': 2500.00,
            'province': 'Mashonaland East',
            'district': 'Marondera',
            'natural_region': 'Region I',
            'farm_category': 'A2',
            'title_deed_number': 'TD002',
            'title_type': 'Freehold',
            'gazette_status': 'gazetted',
            'gazette_date': '2024-02-01',
            'gazette_number': 'GZ002',
            'diagram_number': 'D002',
            'farm_activity': 'Commercial Farming',
            'ownership': 'private',
            'company_name': 'Sunrise Agriculture',
            'owner_name': 'Sarah Johnson',
            'nationality': 'Zimbabwean',
            'is_planned': True
        },
        {
            'farm_id': 'PF003',
            'farm_name': 'River View Farm',
            'area_size': 500.00,
            'area_units': 'hectares',
            'size_hectares': 500.00,
            'province': 'Mashonaland West',
            'district': 'Chegutu',
            'natural_region': 'Region III',
            'farm_category': 'A1',
            'title_deed_number': 'TD003',
            'title_type': 'Lease',
            'gazette_status': 'pending',
            'gazette_date': None,
            'gazette_number': '',
            'diagram_number': 'D003',
            'farm_activity': 'Subsistence Farming',
            'ownership': 'communal',
            'company_name': '',
            'owner_name': 'Thomas Chiremba',
            'nationality': 'Zimbabwean',
            'is_planned': False
        },
        {
            'farm_id': 'PF004',
            'farm_name': 'Highland Estate',
            'area_size': 3000.00,
            'area_units': 'hectares',
            'size_hectares': 3000.00,
            'province': 'Manicaland',
            'district': 'Mutare',
            'natural_region': 'Region I',
            'farm_category': 'A2',
            'title_deed_number': 'TD004',
            'title_type': 'Freehold',
            'gazette_status': 'gazetted',
            'gazette_date': '2024-02-15',
            'gazette_number': 'GZ004',
            'diagram_number': 'D004',
            'farm_activity': 'Commercial Farming',
            'ownership': 'private',
            'company_name': 'Highland Enterprises',
            'owner_name': 'Michael Brown',
            'nationality': 'Zimbabwean',
            'is_planned': True
        },
        {
            'farm_id': 'PF005',
            'farm_name': 'Valley View Farm',
            'area_size': 750.00,
            'area_units': 'hectares',
            'size_hectares': 750.00,
            'province': 'Midlands',
            'district': 'Gweru',
            'natural_region': 'Region III',
            'farm_category': 'A1',
            'title_deed_number': 'TD005',
            'title_type': 'Lease',
            'gazette_status': 'gazetted',
            'gazette_date': '2024-01-30',
            'gazette_number': 'GZ005',
            'diagram_number': 'D005',
            'farm_activity': 'Mixed Farming',
            'ownership': 'private',
            'company_name': '',
            'owner_name': 'Elizabeth Moyo',
            'nationality': 'Zimbabwean',
            'is_planned': False
        }
    ]
    
    # Create the farms
    for farm_data in dummy_farms:
        ParentFarm.objects.create(**farm_data)

def reverse_populate_parent_farms(apps, schema_editor):
    ParentFarm = apps.get_model('landsApp', 'ParentFarm')
    ParentFarm.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('landsApp', '0004_parentfarm'),
    ]

    operations = [
        migrations.RunPython(populate_parent_farms, reverse_populate_parent_farms),
    ] 