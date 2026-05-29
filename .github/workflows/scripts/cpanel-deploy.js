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
const uploadUrl = `https://${host}:2083/execute/Fileman/upload_files`;
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

    // 1. 📤 Upload deploy.tar.gz
    log('\n📤 Step 1: Uploading deploy.tar.gz via cPanel UAPI...');
    const boundary = '----WebKitFormBoundarySecureStackDeploy';
    const fileBuffer = fs.readFileSync(archivePath);
    const parts = [];

    parts.push(
      Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="dir"\r\n\r\n` +
        `public_html\r\n`
      )
    );

    parts.push(
      Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file-1"; filename="deploy.tar.gz"\r\n` +
        `Content-Type: application/x-gzip\r\n\r\n`
      )
    );
    parts.push(fileBuffer);
    parts.push(Buffer.from('\r\n'));
    parts.push(Buffer.from(`--${boundary}--\r\n`));

    const body = Buffer.concat(parts);
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    log(`Attempting fetch to UAPI upload endpoint: ${uploadUrl}`);
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'User-Agent': 'GitHub-Actions-Deployer',
        'Content-Length': body.length.toString()
      },
      body: body
    });

    const resText = await res.text();
    log(`HTTP Status: ${res.status}`);

    let data;
    try {
      data = JSON.parse(resText);
    } catch (e) {
      logError('Failed to parse response as JSON. Raw response:');
      logError(resText);
      writeLogFile();
      process.exit(1);
    }

    if (res.status === 200 && data.status === 1) {
      log('✅ Archive uploaded successfully!');
    } else {
      logError('❌ Upload failed. UAPI errors:');
      logError(JSON.stringify(data.errors || data, null, 2));
      writeLogFile();
      process.exit(1);
    }

    // 2. 📂 Extract archive
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
        'User-Agent': 'GitHub-Actions-Deployer'
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

    // 3. 🧹 Cleanup archive
    log('\n🧹 Step 3: Cleaning up deploy.tar.gz from server...');
    const cleanupParams = new URLSearchParams({
      cpanel_jsonapi_user: username,
      cpanel_jsonapi_apiversion: '2',
      cpanel_jsonapi_module: 'Fileman',
      cpanel_jsonapi_func: 'fileop',
      op: 'trash',
      sourcefiles: '/home/securest/public_html/deploy.tar.gz',
      doubledecode: '1'
    });

    const cleanupRes = await fetch(`${api2Url}?${cleanupParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'GitHub-Actions-Deployer'
      }
    });

    const cleanupResText = await cleanupRes.text();
    let cleanupData;
    try {
      cleanupData = JSON.parse(cleanupResText);
      const cleanupResult = cleanupData.cpanelresult || {};
      const cleanupOpData = cleanupResult.data && cleanupResult.data[0];

      if (cleanupOpData && cleanupOpData.result === 1) {
        log('✅ Server cleanup done. Deployment complete! 🎉');
      } else {
        log('⚠️ Warning: Server cleanup returned unsuccessful status.');
      }
    } catch (e) {
      log('⚠️ Warning: Failed to parse cleanup response as JSON.');
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
