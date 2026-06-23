import os
import sys

# Add the application directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Dynamically search for virtualenv site-packages in the cPanel user home directory
venv_base = '/home/securest/virtualenv/securestack-backend'
if os.path.exists(venv_base):
    for root, dirs, files in os.walk(venv_base):
        if 'site-packages' in dirs:
            site_packages_path = os.path.join(root, 'site-packages')
            sys.path.insert(0, site_packages_path)
            print(f"Activated site-packages: {site_packages_path}")
            break

# Run migrations on startup
try:
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    from django.core.management import call_command
    call_command('migrate', interactive=False)
except Exception as e:
    with open(os.path.join(os.path.dirname(__file__), 'migration_error.txt'), 'w') as f:
        f.write(str(e))

# Import Django application
from config.wsgi import application
