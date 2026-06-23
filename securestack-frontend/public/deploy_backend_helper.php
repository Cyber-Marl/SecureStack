<?php
header('Content-Type: text/plain; charset=utf-8');

$src = '/home/securest/public_html/urls.py.temp';
$dest = '/home/securest/securestack-backend/config/urls.py';

echo "=== BACKEND CONFIG DEPLOYMENT HELPER ===\n";
echo "Source: $src\n";
echo "Destination: $dest\n";

if (file_exists($src)) {
    echo "📦 Source file exists. Copying...\n";
    
    // Ensure destination directory exists (should be config/)
    $dest_dir = dirname($dest);
    if (!is_dir($dest_dir)) {
        mkdir($dest_dir, 0755, true);
    }
    
    if (copy($src, $dest)) {
        echo "✅ Successfully copied urls.py to backend!\n";
        
        // Trigger passenger restart
        $tmp_dir = '/home/securest/securestack-backend/tmp';
        if (!is_dir($tmp_dir)) {
            mkdir($tmp_dir, 0755, true);
        }
        
        if (touch($tmp_dir . '/restart.txt')) {
            echo "✅ Passenger application restart triggered successfully!\n";
        } else {
            echo "❌ Failed to touch restart.txt. Manual reload might be required.\n";
        }
        
        // Clean up source file in public_html for security
        unlink($src);
        echo "🧹 Cleaned up source file in public_html.\n";
    } else {
        echo "❌ Error: Failed to copy file to $dest.\n";
    }
} else {
    echo "❌ Error: Source file not found at $src.\n";
}

// Self delete deploy helper
unlink(__FILE__);
echo "🧹 Self-deleted deploy_backend_helper.php.\n";
?>
