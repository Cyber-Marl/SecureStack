<?php
header('Content-Type: text/plain; charset=utf-8');
echo "=== live .htaccess content ===\n";
$file = '/home/securest/public_html/.htaccess';
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo "File not found: $file\n";
}
echo "\n=== end ===\n";
unlink(__FILE__);
?>
