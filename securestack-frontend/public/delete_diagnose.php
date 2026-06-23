<?php
header('Content-Type: text/plain; charset=utf-8');
$file = '/home/securest/public_html/diagnose.php';
if (file_exists($file)) {
    if (unlink($file)) {
        echo "✅ Successfully deleted diagnose.php from server!\n";
    } else {
        echo "❌ Failed to delete diagnose.php from server.\n";
    }
} else {
    echo "ℹ️ diagnose.php was not found on server (already deleted?).\n";
}
unlink(__FILE__);
echo "🧹 Self-deleted delete_diagnose.php.\n";
?>
