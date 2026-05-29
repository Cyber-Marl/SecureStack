const fs = require('fs');
const path = require('path');

const username = process.env.CPANEL_USER;
const password = process.env.CPANEL_PASS;

if (!username || !password) {
  console.error('❌ Error: CPANEL_USER and CPANEL_PASS environment variables must be set.');
  process.exit(1);
}

const host = 'hz4.vps.webdevworld.com';
const uploadUrl = `https://${host}:2083/execute/Fileman/upload_files`;
const api2Url = `https://${host}:2083/json-api/cpanel`;

async function deploy() {
  const archivePath = path.join(process.cwd(), 'deploy.tar.gz');
  if (!fs.existsSync(archivePath)) {
    console.error(`❌ Error: Archive file not found at ${archivePath}`);
    process.exit(1);
  }

  const stats = fs.statSync(archivePath);
  console.log(`📦 Found deploy.tar.gz. Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // 1. 📤 Upload deploy.tar.gz
  console.log('\n📤 Step 1: Uploading deploy.tar.gz via cPanel UAPI...');
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

  let uploadSucceeded = false;
  try {
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
    console.log(`HTTP Status: ${res.status}`);

    let data;
    try {
      data = JSON.parse(resText);
    } catch (e) {
      console.error('Failed to parse response as JSON. Raw response:');
      console.error(resText);
      process.exit(1);
    }

    if (res.status === 200 && data.status === 1) {
      console.log('✅ Archive uploaded successfully!');
      uploadSucceeded = true;
    } else {
      console.error('❌ Upload failed. UAPI errors:');
      console.error(JSON.stringify(data.errors || data, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Network error during upload:', err);
    process.exit(1);
  }

  // 2. 📂 Extract archive
  console.log('\n📂 Step 2: Extracting deploy.tar.gz via cPanel API 2...');
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

  try {
    const res = await fetch(`${api2Url}?${extractParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'GitHub-Actions-Deployer'
      }
    });

    const resText = await res.text();
    console.log(`HTTP Status: ${res.status}`);

    let data;
    try {
      data = JSON.parse(resText);
    } catch (e) {
      console.error('Failed to parse response as JSON. Raw response:');
      console.error(resText);
      process.exit(1);
    }

    const cpanelResult = data.cpanelresult || {};
    const operationData = cpanelResult.data && cpanelResult.data[0];

    if (operationData && operationData.result === 1) {
      // Check if gtar reported any errors (gtar exit code is returned in the output or status)
      const output = operationData.output || '';
      if (output.includes('Cannot open') || output.includes('Error is not recoverable')) {
        console.error('❌ Extraction completed with internal tar errors:');
        console.error(output);
        process.exit(1);
      }
      console.log('✅ Archive extracted successfully!');
      console.log(output);
    } else {
      console.error('❌ Extraction failed. API 2 response:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Network error during extraction:', err);
    process.exit(1);
  }

  // 3. 🧹 Cleanup archive
  console.log('\n🧹 Step 3: Cleaning up deploy.tar.gz from server...');
  const cleanupParams = new URLSearchParams({
    cpanel_jsonapi_user: username,
    cpanel_jsonapi_apiversion: '2',
    cpanel_jsonapi_module: 'Fileman',
    cpanel_jsonapi_func: 'fileop',
    op: 'trash',
    sourcefiles: '/home/securest/public_html/deploy.tar.gz',
    doubledecode: '1'
  });

  try {
    const res = await fetch(`${api2Url}?${cleanupParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'GitHub-Actions-Deployer'
      }
    });

    const resText = await res.text();
    let data;
    try {
      data = JSON.parse(resText);
    } catch (e) {
      // Non-fatal error since extraction completed
      console.warn('⚠️ Warning: Failed to parse cleanup response as JSON.');
      return;
    }

    const cpanelResult = data.cpanelresult || {};
    const operationData = cpanelResult.data && cpanelResult.data[0];

    if (operationData && operationData.result === 1) {
      console.log('✅ Server cleanup done. Deployment complete! 🎉');
    } else {
      console.warn('⚠️ Warning: Server cleanup returned unsuccessful status.');
    }
  } catch (err) {
    console.warn('⚠️ Warning: Network error during server cleanup:', err);
  }
}

deploy();
