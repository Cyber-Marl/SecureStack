from django.db import migrations

def add_more_services(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    
    services = [
        {
            'title': 'Network Security',
            'slug': 'network-security',
            'category': 'security',
            'short_description': 'Protect your network infrastructure with advanced security solutions.',
            'content': '''Our Network Security solutions provide comprehensive protection for your organization's network infrastructure. We offer:

- Network monitoring and threat detection
- Firewall configuration and management
- VPN setup and maintenance
- Intrusion Prevention Systems (IPS)
- Network segmentation
- Security audits and assessments
- 24/7 network security monitoring
- Incident response and remediation''',
            'icon': 'fas fa-network-wired',
        },
        {
            'title': 'Identity & Access Management',
            'slug': 'identity-access-management',
            'category': 'security',
            'short_description': 'Secure and streamline access to your organization\'s resources.',
            'content': '''Our Identity and Access Management (IAM) solutions help organizations maintain security while improving user experience. Our services include:

- Single Sign-On (SSO) implementation
- Multi-Factor Authentication (MFA)
- Role-based access control (RBAC)
- Identity lifecycle management
- Access governance and compliance
- Password management solutions
- Directory services integration
- User activity monitoring''',
            'icon': 'fas fa-user-lock',
        },
        {
            'title': 'Mobile Development',
            'slug': 'mobile-development',
            'category': 'development',
            'short_description': 'Create powerful mobile applications for iOS and Android platforms.',
            'content': '''Our Mobile Development team creates high-performance, user-friendly applications for both iOS and Android platforms. Our services include:

- Native iOS and Android development
- Cross-platform development
- Progressive Web Apps (PWA)
- Mobile app UI/UX design
- App testing and quality assurance
- App store submission and management
- Mobile app maintenance and updates
- Performance optimization''',
            'icon': 'fas fa-mobile-alt',
        },
        {
            'title': 'ERP Development',
            'slug': 'erp-development',
            'category': 'development',
            'short_description': 'Custom ERP solutions to streamline your business operations.',
            'content': '''Our ERP Development services help businesses integrate and manage their core processes efficiently. We offer:

- Custom ERP system development
- ERP implementation and integration
- Module customization
- Data migration and integration
- Business process automation
- Training and support
- System maintenance and updates
- Performance monitoring and optimization''',
            'icon': 'fas fa-cogs',
        },
    ]
    
    for service_data in services:
        Service.objects.create(**service_data)

def remove_more_services(apps, schema_editor):
    Service = apps.get_model('core', 'Service')
    Service.objects.filter(slug__in=[
        'network-security',
        'identity-access-management',
        'mobile-development',
        'erp-development'
    ]).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_add_initial_services'),
    ]

    operations = [
        migrations.RunPython(add_more_services, remove_more_services),
    ] 