from django.db import migrations

def add_digital_transformation_service(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    
    Service.objects.create(
        title='Digital Transformation',
        slug='digital-transformation',
        category='consulting',
        short_description='Comprehensive digital transformation services to modernize your business operations.',
        content='''Our Digital Transformation services help organizations embrace modern technologies and processes. We provide:

- Digital strategy development
- Process automation and optimization
- Cloud migration and modernization
- Data analytics and business intelligence
- Customer experience transformation
- Digital workplace solutions
- Legacy system modernization
- Change management and training''',
        icon='fas fa-digital-tachograph'
    )

def remove_digital_transformation_service(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    Service.objects.filter(slug='digital-transformation').delete()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_add_it_strategy_service'),
    ]

    operations = [
        migrations.RunPython(add_digital_transformation_service, remove_digital_transformation_service),
    ] 