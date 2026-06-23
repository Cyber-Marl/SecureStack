<?php
header('Content-Type: text/plain; charset=utf-8');

$env_file = '/home/securest/securestack-backend/.env';
if (file_exists($env_file)) {
    echo "=== ENVIRONMENT VARIABLES ===\n";
    $lines = file($env_file);
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if (empty($trimmed) || strpos($trimmed, '#') === 0) {
            continue;
        }
        $parts = explode('=', $trimmed, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $val = trim($parts[1]);
            // Redact password or secret key
            if (stripos($key, 'password') !== false || stripos($key, 'secret') !== false || stripos($key, 'key') !== false) {
                $val = 'REDACTED';
            }
            echo "$key=$val\n";
        }
    }
} else {
    echo "❌ .env file not found at $env_file\n";
}

unlink(__FILE__);
echo "🧹 Self-deleted read_env.php.\n";
?>
