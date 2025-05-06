from django.db import migrations

def add_initial_services(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    
    services = [
        {
            'title': 'Cybersecurity Solutions',
            'slug': 'cybersecurity-solutions',
            'category': 'security',
            'short_description': 'Comprehensive cybersecurity solutions to protect your business from digital threats.',
            'content': 'Our cybersecurity solutions include network security, endpoint protection, threat detection, and incident response. We help businesses of all sizes implement robust security measures to protect their digital assets.',
            'icon': 'fas fa-shield-alt',
        },
        {
            'title': 'Web Development',
            'slug': 'web-development',
            'category': 'development',
            'short_description': 'Custom web development solutions for modern businesses.',
            'content': 'We create responsive, secure, and scalable web applications using the latest technologies. Our web development services include frontend and backend development, API integration, and performance optimization.',
            'icon': 'fas fa-code',
        },
        {
            'title': 'IT Consulting',
            'slug': 'it-consulting',
            'category': 'consulting',
            'short_description': 'Expert IT consulting services to help your business grow.',
            'content': 'Our IT consulting services help businesses optimize their technology infrastructure, implement best practices, and achieve their digital transformation goals.',
            'icon': 'fas fa-laptop-code',
        },
    ]
    
    for service_data in services:
        Service.objects.create(**service_data)

def remove_initial_services(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    Service.objects.filter(slug__in=['cybersecurity-solutions', 'web-development', 'it-consulting']).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_initial_services, remove_initial_services),
    ] 