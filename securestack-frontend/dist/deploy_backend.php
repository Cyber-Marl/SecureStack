<?php
header('Content-Type: text/plain; charset=utf-8');

$zip_file = '/home/securest/public_html/backend.zip';
$dest_dir = '/home/securest/securestack-backend';

echo "=== BACKEND DEPLOYMENT EXTRACTOR ===\n";
echo "Source ZIP: $zip_file\n";
echo "Destination: $dest_dir\n";

if (!file_exists($zip_file)) {
    echo "❌ Error: ZIP file not found at $zip_file\n";
    exit(1);
}

if (!is_dir($dest_dir)) {
    mkdir($dest_dir, 0755, true);
}

$success = false;

if (class_exists('ZipArchive')) {
    echo "📦 Extracting using ZipArchive...\n";
    $zip = new ZipArchive;
    if ($zip->open($zip_file) === TRUE) {
        if ($zip->extractTo($dest_dir)) {
            echo "✅ Successfully extracted backend ZIP!\n";
            $success = true;
        } else {
            echo "❌ Error: Extraction failed.\n";
        }
        $zip->close();
    } else {
        echo "❌ Error: Failed to open ZIP file.\n";
    }
} else {
    echo "📦 ZipArchive not available. Trying PharData fallback...\n";
    try {
        $phar = new PharData($zip_file);
        $phar->extractTo($dest_dir, null, true);
        echo "✅ Successfully extracted backend ZIP using PharData!\n";
        $success = true;
    } catch (Exception $e) {
        echo "❌ PharData extraction failed: " . $e->getMessage() . "\n";
    }
}

if ($success) {
    // Touch restart.txt
    $tmp_dir = $dest_dir . '/tmp';
    if (!is_dir($tmp_dir)) {
        mkdir($tmp_dir, 0755, true);
    }
    touch($tmp_dir . '/restart.txt');
    echo "✅ Passenger restart triggered.\n";
    
    // Clean up
    unlink($zip_file);
    echo "🧹 Cleaned up backend.zip.\n";
}

// Self delete
unlink(__FILE__);
echo "🧹 Self-deleted deploy_backend.php.\n";
?>
