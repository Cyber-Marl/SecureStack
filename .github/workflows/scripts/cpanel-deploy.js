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
const webdavUrl = `https://${host}:2078/public_html/deploy.tar.gz`;
const api2Url = `https://${host}:2083/json-api/cpanel`;

async function deploy() {
  try {
    const archivePath = path.join(process.cwd(), 'deploy.tar.gz');
    if (!fs.existsSync(archivePath)) {
      logError(`❌ Error: Archive file not found at ${archivePath}`);
      writeLogFile();
      process.exit(1);
    }

    const stats = fs.statSync(archivePath);
    log(`📦 Found deploy.tar.gz. Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // 1. 📤 Upload deploy.tar.gz via WebDAV PUT
    log('\n📤 Step 1: Uploading deploy.tar.gz via WebDAV (cPanel Web Disk)...');
    const fileBuffer = fs.readFileSync(archivePath);
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    log(`Attempting binary PUT to WebDAV endpoint: ${webdavUrl}`);
    const res = await fetch(webdavUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-gzip',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Length': fileBuffer.length.toString()
      },
      body: fileBuffer
    });

    log(`HTTP Status: ${res.status} ${res.statusText}`);

    if (res.status === 200 || res.status === 201) {
      log('✅ Archive uploaded successfully via WebDAV!');
    } else {
      const resText = await res.text();
      logError(`❌ Upload failed. WebDAV response (first 200 chars): ${resText.slice(0, 200)}`);
      writeLogFile();
      process.exit(1);
    }

    // 2. 📂 Extract archive via cPanel API 2
    log('\n📂 Step 2: Extracting deploy.tar.gz via cPanel API 2...');
    const extractParams = new URLSearchParams({
      cpanel_jsonapi_user: username,
      cpanel_jsonapi_apiversion: '2',
      cpanel_jsonapi_module: 'Fileman',
      cpanel_jsonapi_func: 'fileop',
      op: 'extract',
      sourcefiles: '/home/securest/public_html/deploy.tar.gz',
      destfiles: '/home/securest/public_html',
      doubledecode: '1'
    });

    log(`Calling cPanel API 2 URL: ${api2Url}?${extractParams.toString().replace(password, 'HIDDEN')}`);
    const extractRes = await fetch(`${api2Url}?${extractParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const extractResText = await extractRes.text();
    log(`HTTP Status: ${extractRes.status}`);

    let extractData;
    try {
      extractData = JSON.parse(extractResText);
    } catch (e) {
      logError('Failed to parse extraction response as JSON. Raw response:');
      logError(extractResText);
      writeLogFile();
      process.exit(1);
    }

    const cpanelResult = extractData.cpanelresult || {};
    const operationData = cpanelResult.data && cpanelResult.data[0];

    if (operationData && operationData.result === 1) {
      const output = operationData.output || '';
      if (output.includes('Cannot open') || output.includes('Error is not recoverable')) {
        logError('❌ Extraction completed with internal tar errors:');
        logError(output);
        writeLogFile();
        process.exit(1);
      }
      log('✅ Archive extracted successfully!');
      log(output);
    } else {
      logError('❌ Extraction failed. API 2 response:');
      logError(JSON.stringify(extractData, null, 2));
      writeLogFile();
      process.exit(1);
    }

    // 3. 🧹 Cleanup archive via WebDAV DELETE
    log('\n🧹 Step 3: Cleaning up deploy.tar.gz from server via WebDAV DELETE...');
    try {
      const cleanupRes = await fetch(webdavUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      log(`HTTP Status: ${cleanupRes.status} ${cleanupRes.statusText}`);
      if (cleanupRes.status === 200 || cleanupRes.status === 204) {
        log('✅ Server cleanup done. Deployment complete! 🎉');
      } else {
        log('⚠️ Warning: Server cleanup returned unsuccessful status.');
      }
    } catch (e) {
      log('⚠️ Warning: Failed to perform WebDAV cleanup.');
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
