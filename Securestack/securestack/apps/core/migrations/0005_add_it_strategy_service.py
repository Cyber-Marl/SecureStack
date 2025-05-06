from django.db import migrations

def add_it_strategy_service(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    
    Service.objects.create(
        title='IT Strategy',
        slug='it-strategy',
        category='consulting',
        short_description='Strategic IT planning and consulting to align technology with business goals.',
        content='''Our IT Strategy services help organizations align their technology initiatives with business objectives. We provide:

- IT roadmap development
- Digital transformation strategy
- Technology assessment and planning
- IT governance framework
- Cloud strategy and migration planning
- IT budget optimization
- Vendor management strategy
- IT risk management framework''',
        icon='fas fa-chess'
    )

def remove_it_strategy_service(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    Service.objects.filter(slug='it-strategy').delete()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_add_more_services'),
    ]

    operations = [
        migrations.RunPython(add_it_strategy_service, remove_it_strategy_service),
    ] 