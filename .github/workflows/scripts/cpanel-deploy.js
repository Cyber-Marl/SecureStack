process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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
  writeLogFile();
  process.exit(1);
}

const host = 'hz4.vps.webdevworld.com';
const webdavBase = `https://${host}:2078/public_html`;
const distDir = path.join(process.cwd(), 'securestack-frontend', 'dist');

function getAuth() {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json',
  };
  return types[ext] || 'application/octet-stream';
}

async function ensureDirectory(remotePath) {
  const url = `${webdavBase}/${remotePath}/`;
  const res = await fetch(url, {
    method: 'MKCOL',
    headers: {
      'Authorization': getAuth(),
    }
  });
  // 201 = created, 405 = already exists — both are fine
  if (res.status === 201) {
    log(`📁 Created directory: ${remotePath}/`);
  } else if (res.status === 405 || res.status === 301) {
    log(`📁 Directory already exists: ${remotePath}/`);
  } else {
    log(`⚠️ MKCOL ${remotePath}: HTTP ${res.status}`);
  }
}

async function uploadFile(localPath, remotePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const mimeType = getMimeType(localPath);
  const url = `${webdavBase}/${remotePath}`;

  log(`📤 Uploading: ${remotePath} (${(fileBuffer.length / 1024).toFixed(1)} KB)`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': getAuth(),
      'Content-Type': mimeType,
      'Content-Length': fileBuffer.length.toString(),
    },
    body: fileBuffer,
  });

  if (res.status === 200 || res.status === 201 || res.status === 204) {
    log(`   ✅ Uploaded: ${remotePath}`);
  } else {
    const text = await res.text();
    logError(`   ❌ Failed to upload ${remotePath}: HTTP ${res.status} — ${text.slice(0, 200)}`);
    throw new Error(`Upload failed: ${remotePath}`);
  }
}

async function walkAndUpload(localDir, remoteDir) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = remoteDir ? `${remoteDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      await ensureDirectory(remotePath);
      await walkAndUpload(localPath, remotePath);
    } else {
      await uploadFile(localPath, remotePath);
    }
  }
}

async function deploy() {
  try {
    if (!fs.existsSync(distDir)) {
      logError(`❌ Error: dist/ directory not found at ${distDir}`);
      writeLogFile();
      process.exit(1);
    }

    log('🚀 SecureStack Direct WebDAV Deployment');
    log(`📁 Source: ${distDir}`);
    log(`🌐 Target: ${webdavBase}/`);
    log('');

    // Ensure assets/ subdirectory exists on server
    log('📁 Step 1: Ensuring remote directories exist...');
    await ensureDirectory('assets');
    log('');

    // Upload all files from dist/ directly to public_html/
    log('📤 Step 2: Uploading all files...');
    await walkAndUpload(distDir, '');
    log('');

    log('✅ All files uploaded successfully! 🎉');
    log(`🌐 Site is live at: https://securestack.co.zw`);
    writeLogFile();

  } catch (globalErr) {
    logError(`❌ Unhandled error: ${globalErr.message}`);
    if (globalErr.stack) logError(globalErr.stack);
    writeLogFile();
    process.exit(1);
  }
}

deploy();
