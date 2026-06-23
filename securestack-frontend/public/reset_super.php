<?php
header('Content-Type: text/plain; charset=utf-8');

// Find virtualenv python
$python_paths = [
    '/home/securest/virtualenv/securestack-backend/*/bin/python',
    '/home/securest/securestack-backend/venv/bin/python',
    '/home/securest/venv/bin/python',
];

$python = 'python3'; // fallback
foreach ($python_paths as $pattern) {
    $matches = glob($pattern);
    if (!empty($matches)) {
        $python = $matches[0];
        break;
    }
}

echo "Using Python: $python\n";

$new_username = 'marlvin';
$new_password = 'SecurePassword123!';

$python_code = "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.contrib.auth.models import User
try:
    u = User.objects.get(username='$new_username')
    u.set_password('$new_password')
    u.is_superuser = True
    u.is_staff = True
    u.save()
    print('SUCCESS: Updated password for existing superuser $new_username')
except User.DoesNotExist:
    User.objects.create_superuser('$new_username', 'marlvin@securestack.co.zw', '$new_password')
    print('SUCCESS: Created new superuser $new_username')
";

// Write python code to a temporary file
$py_file = '/home/securest/securestack-backend/tmp_reset.py';
file_put_contents($py_file, $python_code);

// Run it
$cmd = "cd /home/securest/securestack-backend && $python tmp_reset.py 2>&1";
$output = shell_exec($cmd);
echo "Result:\n$output\n";

// Cleanup python file
if (file_exists($py_file)) {
    unlink($py_file);
}

// Self delete
unlink(__FILE__);
?>
