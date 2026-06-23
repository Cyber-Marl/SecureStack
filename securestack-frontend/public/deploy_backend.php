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
    // Rename .env.production -> .env (the production env with real SMTP credentials)
    $env_prod = $dest_dir . '/securestack-backend/.env.production';
    $env_dest = $dest_dir . '/.env';

    // Handle nested path from zip structure
    $nested_env = $dest_dir . '/securestack-backend/.env.production';
    $root_env   = $dest_dir . '/.env.production';

    if (file_exists($nested_env)) {
        if (rename($nested_env, $env_dest)) {
            echo "✅ Production .env deployed from securestack-backend/.env.production\n";
        } else {
            echo "⚠️ Could not rename nested .env.production — trying copy...\n";
            copy($nested_env, $env_dest);
            unlink($nested_env);
        }
    } elseif (file_exists($root_env)) {
        if (rename($root_env, $env_dest)) {
            echo "✅ Production .env deployed from .env.production\n";
        } else {
            copy($root_env, $env_dest);
            unlink($root_env);
            echo "✅ Production .env copied.\n";
        }
    } else {
        echo "⚠️ WARNING: .env.production not found in ZIP. Email may not work.\n";
        echo "Searching for it...\n";
        $rit = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dest_dir));
        foreach ($rit as $f) {
            if (strpos($f->getFilename(), '.env') !== false) {
                echo "   Found: " . $f->getPathname() . "\n";
            }
        }
    }

    echo "📄 Current .env contents (passwords hidden):\n";
    if (file_exists($env_dest)) {
        $lines = file($env_dest);
        foreach ($lines as $line) {
            if (stripos($line, 'password') !== false || stripos($line, 'secret') !== false) {
                $parts = explode('=', trim($line), 2);
                echo $parts[0] . "=***REDACTED***\n";
            } else {
                echo $line;
            }
        }
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
