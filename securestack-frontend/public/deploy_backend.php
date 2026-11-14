<?php
header('Content-Type: text/plain; charset=utf-8');

// Require deployment authentication token
$expected_token = getenv('DEPLOY_SECRET_KEY') ?: '98f7e2a4b86c1d0e53a2f791c84b3d6e';

$headers = function_exists('getallheaders') ? getallheaders() : [];
$header_token = $headers['X-Deploy-Token'] ?? $headers['x-deploy-token'] ?? '';
$query_token = $_GET['token'] ?? '';
$provided_token = $header_token ?: $query_token;

if (empty($provided_token) || !hash_equals($expected_token, $provided_token)) {
    http_response_code(403);
    die("❌ 403 Forbidden: Invalid or missing deployment authentication token.\n");
}

$zip_file = '/home/securest/public_html/backend.zip';
$dest_dir = '/home/securest/securestack-backend';

echo "=== BACKEND DEPLOYMENT EXTRACTOR ===\n";

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
    // Deploy .env.production -> .env
    $nested_env = $dest_dir . '/securestack-backend/.env.production';
    $root_env   = $dest_dir . '/.env.production';
    $env_dest   = $dest_dir . '/.env';

    if (file_exists($nested_env)) {
        if (rename($nested_env, $env_dest)) {
            echo "✅ Production .env deployed from securestack-backend/.env.production\n";
        } else {
            copy($nested_env, $env_dest);
            unlink($nested_env);
            echo "✅ Production .env copied from nested directory.\n";
        }
    } elseif (file_exists($root_env)) {
        if (rename($root_env, $env_dest)) {
            echo "✅ Production .env deployed from .env.production\n";
        } else {
            copy($root_env, $env_dest);
            unlink($root_env);
            echo "✅ Production .env copied.\n";
        }
    }

    if (file_exists($env_dest)) {
        echo "✅ Production .env configuration confirmed.\n";
    } else {
        echo "⚠️ WARNING: .env not found.\n";
    }

    // Touch restart.txt to reload Passenger
    $tmp_dir = $dest_dir . '/tmp';
    if (!is_dir($tmp_dir)) {
        mkdir($tmp_dir, 0755, true);
    }
    touch($tmp_dir . '/restart.txt');
    echo "✅ Passenger restart triggered.\n";

    // Clean up zip
    unlink($zip_file);
    echo "🧹 Cleaned up backend.zip.\n";
}

// Self delete
unlink(__FILE__);
echo "🧹 Self-deleted deploy_backend.php.\n";
?>
