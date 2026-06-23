<?php
header('Content-Type: text/plain; charset=utf-8');
echo "=== views.py content ===\n";
$file = '/home/securest/securestack-backend/apps/contact/views.py';
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo "File not found: $file\n";
    echo "Current directory listing of /home/securest/securestack-backend:\n";
    if (is_dir('/home/securest/securestack-backend')) {
        print_r(scandir('/home/securest/securestack-backend'));
    } else {
        echo "Directory /home/securest/securestack-backend does not exist.\n";
    }
}
echo "\n=== end ===\n";
unlink(__FILE__);
?>
