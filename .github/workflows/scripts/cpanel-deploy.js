const fs = require('fs');
const path = require('path');

const logFile = path.join(process.cwd(), 'deploy.log');
const logBuffer = [];

function log(msg) {
  console.log(msg);
  logBuffer.push(msg);
}

function logError(msg) {
  console.error(msg);
  logBuffer.push('ERROR: ' + msg);
}

function writeLogFile() {
  fs.writeFileSync(logFile, logBuffer.join('\n'));
}

const username = process.env.CPANEL_USER;
const password = process.env.CPANEL_PASS;

if (!username || !password) {
  logError('❌ Error: CPANEL_USER and CPANEL_PASS environment variables must be set.');
  log(`User exists: ${!!username}, Pass exists: ${!!password}`);
  writeLogFile();
  process.exit(1);
}

const host = 'hz4.vps.webdevworld.com';
const webdavZipUrl = `https://${host}:2078/public_html/deploy.zip`;
const webdavPhpUrl = `https://${host}:2078/public_html/extract_zip.php`;
const triggerUrl = 'https://securestack.co.zw/extract_zip.php';

const phpContent = `<?php
header('Content-Type: text/plain');
$zipFile = __DIR__ . '/deploy.zip';
if (file_exists($zipFile)) {
    echo "📦 Found deploy.zip (" . filesize($zipFile) . " bytes)\\n";
    echo "📂 Extracting archive via ZipArchive...\\n";
    
    $zip = new ZipArchive;
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo(__DIR__);
        $zip->close();
        echo "✅ Extraction succeeded via ZipArchive!\\n";
        unlink($zipFile);
    } else {
        echo "❌ Error: Failed to open zip archive\\n";
    }
} else {
    echo "❌ Error: deploy.zip not found at $zipFile\\n";
}

// Self delete
unlink(__FILE__);
echo "🧹 Self-deleted extract_zip.php. Process complete!\\n";
?>`;

async function deploy() {
  try {
    const zipPath = path.join(process.cwd(), 'deploy.zip');
    if (!fs.existsSync(zipPath)) {
      logError(`❌ Error: Local deploy.zip not found at ${zipPath}`);
      writeLogFile();
      process.exit(1);
    }

    const stats = fs.statSync(zipPath);
    log(`📦 Found deploy.zip. Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    // 1. 📤 Upload deploy.zip via WebDAV PUT
    log('\n📤 Step 1: Uploading deploy.zip via WebDAV (cPanel Web Disk)...');
    const zipBuffer = fs.readFileSync(zipPath);
    log(`Attempting binary PUT to WebDAV zip endpoint: ${webdavZipUrl}`);
    
    const zipRes = await fetch(webdavZipUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/zip',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Length': zipBuffer.length.toString()
      },
      body: zipBuffer
    });

    log(`HTTP Status: ${zipRes.status} ${zipRes.statusText}`);
    if (zipRes.status !== 200 && zipRes.status !== 201) {
      const zipErrText = await zipRes.text();
      logError(`❌ Zip Upload failed. WebDAV response: ${zipErrText.slice(0, 200)}`);
      writeLogFile();
      process.exit(1);
    }
    log('✅ Archive uploaded successfully via WebDAV!');

    // 2. 📤 Upload extract_zip.php via WebDAV PUT
    log('\n📤 Step 2: Uploading extract_zip.php via WebDAV...');
    log(`Attempting PHP PUT to WebDAV php endpoint: ${webdavPhpUrl}`);
    
    const phpRes = await fetch(webdavPhpUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-php',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Length': Buffer.byteLength(phpContent).toString()
      },
      body: phpContent
    });

    log(`HTTP Status: ${phpRes.status} ${phpRes.statusText}`);
    if (phpRes.status !== 200 && phpRes.status !== 201) {
      const phpErrText = await phpRes.text();
      logError(`❌ PHP Upload failed. WebDAV response: ${phpErrText.slice(0, 200)}`);
      writeLogFile();
      process.exit(1);
    }
    log('✅ Extraction script uploaded successfully via WebDAV!');

    // 3. 🚀 Trigger ZipArchive extraction via live site URL
    log('\n🚀 Step 3: Triggering ZipArchive extraction via live site URL...');
    log(`Sending GET request to trigger URL: ${triggerUrl}`);
    
    const triggerRes = await fetch(triggerUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    log(`HTTP Status: ${triggerRes.status} ${triggerRes.statusText}`);
    const triggerText = await triggerRes.text();
    log('\n--- Server Output ---');
    log(triggerText);
    log('---------------------');

    if (triggerText.includes('✅ Extraction succeeded via ZipArchive!')) {
      log('\n✅ Deployment completed successfully! 🎉');
    } else {
      logError('\n❌ Extraction failed on the server. Read the Server Output above for details.');
      writeLogFile();
      process.exit(1);
    }

    writeLogFile();
  } catch (globalErr) {
    logError(`❌ Unhandled error during deploy lifecycle: ${globalErr.message}`);
    if (globalErr.stack) {
      logError(globalErr.stack);
    }
    writeLogFile();
    process.exit(1);
  }
}

deploy();
