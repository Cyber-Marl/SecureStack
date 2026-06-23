<?php
header('Content-Type: text/plain; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== SECURESTACK VPS DIAGNOSTIC REPORT ===\n";
echo "Current User: " . get_current_user() . "\n";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "OS: " . PHP_OS . "\n\n";

function list_dir_recursive($dir, $depth = 0, $max_depth = 2) {
    if ($depth > $max_depth) return;
    $indent = str_repeat("  ", $depth);
    if (!is_dir($dir)) {
        echo "{$indent}❌ Not a directory: $dir\n";
        return;
    }
    echo "{$indent}📂 Directory: $dir\n";
    $files = @scandir($dir);
    if ($files === false) {
        echo "{$indent}❌ Failed to read directory: $dir\n";
        return;
    }
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            list_dir_recursive($path, $depth + 1, $max_depth);
        } else {
            $size = @filesize($path);
            echo "{$indent}  📄 $file ($size bytes)\n";
        }
    }
}

echo "--- Directory: /home/securest ---\n";
$home_dirs = @scandir('/home/securest');
if ($home_dirs !== false) {
    foreach ($home_dirs as $d) {
        if ($d === '.' || $d === '..') continue;
        $p = '/home/securest/' . $d;
        $type = is_dir($p) ? "DIR" : "FILE";
        echo "  [$type] $d\n";
    }
} else {
    echo "❌ Failed to list /home/securest\n";
}

echo "\n--- Scanning securestack-backend ---\n";
list_dir_recursive('/home/securest/securestack-backend', 0, 1);

echo "\n--- Scanning virtualenv/venv ---\n";
// Let's search for virtualenvs in common locations
$possible_venv_paths = [
    '/home/securest/virtualenv',
    '/home/securest/venv',
    '/home/securest/securestack-backend/venv',
    '/home/securest/securestack-backend/env'
];
foreach ($possible_venv_paths as $vp) {
    if (is_dir($vp)) {
        echo "Found virtualenv at: $vp\n";
        list_dir_recursive($vp, 0, 2);
    }
}

echo "\n--- Testing Shell Execution ---\n";
if (function_exists('shell_exec')) {
    echo "✅ shell_exec is ENABLED!\n";
    
    function run_cmd($cmd) {
        echo "\nExecuting: $cmd\n";
        $out = shell_exec($cmd . " 2>&1");
        echo "Output:\n" . ($out ? $out : "[No Output]") . "\n";
    }
    
    run_cmd("python3 --version");
    run_cmd("which python3");
    run_cmd("pip3 list");
    
    // Find virtualenv python
    $venv_python = "";
    if (is_dir('/home/securest/virtualenv/securestack-backend')) {
        // Let's find python binary inside /home/securest/virtualenv/securestack-backend
        // In cPanel, virtualenvs are usually structured like virtualenv/securestack-backend/3.9/bin/python
        // Let's do a search for python files
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('/home/securest/virtualenv/securestack-backend'));
        foreach ($it as $file) {
            if ($file->getFilename() === 'python' && strpos($file->getPathname(), '/bin/') !== false) {
                $venv_python = $file->getPathname();
                echo "Found venv python: $venv_python\n";
                break;
            }
        }
    }
    
    if ($venv_python) {
        run_cmd("$venv_python -V");
        run_cmd("$venv_python -m pip list");
        run_cmd("cd /home/securest/securestack-backend && $venv_python manage.py check");
        run_cmd("cd /home/securest/securestack-backend && $venv_python manage.py migrate --noinput");
    } else {
        echo "Checking fallback to python:\n";
        run_cmd("python manage.py check");
    }
    
} else {
    echo "❌ shell_exec is DISABLED.\n";
}

echo "\n--- Scanning public_html ---\n";
list_dir_recursive('/home/securest/public_html', 0, 2);

echo "\n--- Scanning virtualenv site-packages ---\n";
list_dir_recursive('/home/securest/virtualenv/securestack-backend/3.11/lib/python3.11/site-packages', 0, 1);
list_dir_recursive('/home/securest/virtualenv/securestack-backend/3.11/lib64/python3.11/site-packages', 0, 1);

echo "securestack-backend is link: " . (is_link('/home/securest/securestack-backend') ? "YES" : "NO") . "\n";
echo "SecureStack is link: " . (is_link('/home/securest/SecureStack') ? "YES" : "NO") . "\n";

echo "\n--- Reading Backend Source Files ---\n";
$backend_files = [
    '/home/securest/securestack-backend/config/urls.py',
    '/home/securest/securestack-backend/config/settings.py',
    '/home/securest/securestack-backend/passenger_wsgi.py',
    '/home/securest/securestack-backend/debug_path.txt',
    '/home/securest/securestack-backend/pip_install.log',
    '/home/securest/securestack-backend/stderr.log',
    '/home/securest/securestack-backend/api',
    '/home/securest/public_html/.htaccess',
    '/home/securest/public_html/api/.htaccess',
    '/home/securest/SecureStack/.cpanel.yml',
    '/home/securest/repositories/SecureStack/.cpanel.yml',
    '/home/securest/public_html/.cpanel.yml'
];
foreach ($backend_files as $bf) {
    if (file_exists($bf)) {
        echo "\n📄 File: $bf (" . filesize($bf) . " bytes):\n";
        echo file_get_contents($bf);
        echo "\n-------------------------------------\n";
    } else {
        echo "\n❌ File not found: $bf\n";
    }
}


echo "\n--- Scanning Logs Directory ---\n";
list_dir_recursive('/home/securest/logs', 0, 1);

echo "\n--- Reading Server Error Logs ---\n";
$log_files = [
    '/home/securest/logs/securestack.co.zw.php.error.log',
    '/home/securest/logs/securestack.co.zw',
    '/home/securest/logs/securestack.co.zw-ssl_log',
    '/home/securest/logs/securestack_co_zw.php.error.log',
    '/home/securest/logs/error_log',
    '/home/securest/public_html/error_log',
    '/home/securest/securestack-backend/passenger_wsgi.log',
    '/home/securest/securestack-backend/stderr.log',
    '/home/securest/securestack-backend/error.log'
];
foreach ($log_files as $lf) {
    if (file_exists($lf)) {
        echo "\n📄 File: $lf (" . filesize($lf) . " bytes):\n";
        // print last 30 lines
        $lines = file($lf);
        $last_lines = array_slice($lines, -30);
        echo implode("", $last_lines);
    }
}

echo "\n=== END OF REPORT ===\n";
?>
