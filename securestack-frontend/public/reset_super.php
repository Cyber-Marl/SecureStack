<?php
header('Content-Type: text/plain; charset=utf-8');

$db_path = '/home/securest/securestack-backend/db.sqlite3';

if (!file_exists($db_path)) {
    die("❌ Database file does not exist at $db_path\n");
}

if (!is_writable($db_path)) {
    die("❌ Database file is not writable at $db_path\n");
}

$db_dir = dirname($db_path);
if (!is_writable($db_dir)) {
    echo "⚠️ Database directory is not writable at $db_dir. SQLite may fail to write journal files.\n";
}

try {
    $db = new PDO("sqlite:$db_path");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connected to SQLite database.\n";
    
    // Check if auth_user table exists
    $stmt = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='auth_user'");
    if (!$stmt->fetch()) {
        die("❌ Table 'auth_user' does not exist in the database. Run migrations first!\n");
    }
    
    $username = 'marlvin';
    $password_hash = 'pbkdf2_sha256$600000$oi6dYWCjWpvIl45lk8FuLy$L1HRmRW6Q4SqbJd2u0DfzlTK+G6XZSPZ3RO4zh8sI0U=';
    $email = 'marlvin@securestack.co.zw';
    
    // Check if user already exists
    $stmt = $db->prepare("SELECT id FROM auth_user WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Update existing user
        $stmt = $db->prepare("UPDATE auth_user SET password = :password, is_superuser = 1, is_staff = 1, is_active = 1 WHERE username = :username");
        $stmt->execute([
            ':password' => $password_hash,
            ':username' => $username
        ]);
        echo "✅ Password and superuser permissions updated successfully for existing user: $username\n";
    } else {
        // Insert new user
        $stmt = $db->prepare("INSERT INTO auth_user (password, is_superuser, username, last_name, email, is_staff, is_active, date_joined, first_name) VALUES (:password, 1, :username, '', :email, 1, 1, :date_joined, '')");
        $stmt->execute([
            ':password' => $password_hash,
            ':username' => $username,
            ':email' => $email,
            ':date_joined' => date('Y-m-d H:i:s')
        ]);
        echo "✅ Superuser $username created successfully.\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

// Self-delete
if (unlink(__FILE__)) {
    echo "🧹 Self-deleted reset_super.php from server.\n";
} else {
    echo "⚠️ Failed to self-delete reset_super.php. Please delete it manually!\n";
}
?>
