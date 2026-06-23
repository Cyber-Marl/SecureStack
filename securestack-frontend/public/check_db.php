<?php
header('Content-Type: text/plain; charset=utf-8');
try {
    $db = new PDO('sqlite:/home/securest/securestack-backend/db.sqlite3');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== Recent Contact Messages ===\n";
    $stmt = $db->query("SELECT * FROM contact_contactmessage ORDER BY id DESC LIMIT 5");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
        echo "\n-------------------\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
unlink(__FILE__);
?>
