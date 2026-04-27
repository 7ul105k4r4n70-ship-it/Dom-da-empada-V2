#!/usr/bin/env node
/**
 * Upload all project files to new GitHub repo via API
 * Usage: node upload-to-new-repo.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  token: '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',
  owner: '7ul105k4r4n70-ship-it',
  repo: 'portal-administrativo',
  branch: 'main',
  projectDir: 'C:\\Users\\Tulio Scaranto\\Documents\\Dom-da-empada-V2'
};

// Files to exclude
const EXCLUDE = [
  'node_modules', '.git', 'dist', '.vercel', '.env', '.env.local',
  'upload-to-new-repo.js', 'deploy-full.js', 'mcp-server.js',
  '*.log', '*.tmp', '*screenshot*', '*.ps1', '*.bat'
];

function shouldExclude(filePath) {
  const name = path.basename(filePath);
  return EXCLUDE.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(name);
    }
    return name === pattern;
  });
}

function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    
    if (shouldExclude(fullPath) || shouldExclude(relativePath)) continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push({ fullPath, relativePath });
    }
  }
  
  return files;
}

async function githubApi(endpoint, options = {}) {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `token ${CONFIG.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    throw new Error(`GitHub API ${response.status}: ${error}`);
  }
  
  if (response.status === 404) return null;
  return response.json();
}

async function uploadFile(filePath, repoPath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file exists
  const existing = await githubApi(`/contents/${repoPath}?ref=${CONFIG.branch}`);
  
  const body = {
    message: `update: ${repoPath}`,
    content: Buffer.from(content).toString('base64'),
    branch: CONFIG.branch,
  };
  
  if (existing && existing.sha) {
    body.sha = existing.sha;
  }
  
  return githubApi(`/contents/${repoPath}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

async function main() {
  console.log('📦 Scanning project files...\n');
  
  const files = getAllFiles(CONFIG.projectDir);
  const importantFiles = files.filter(f => 
    f.relativePath.startsWith('src/') ||
    f.relativePath.startsWith('public/') ||
    ['package.json', 'vercel.json', 'vite.config.ts', 'tsconfig.json', 'tailwind.config.js', 'index.html'].includes(f.relativePath)
  );
  
  console.log(`Found ${importantFiles.length} important files to upload\n`);
  console.log('Starting upload...\n');
  
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < importantFiles.length; i++) {
    const { fullPath, relativePath } = importantFiles[i];
    
    try {
      await uploadFile(fullPath, relativePath);
      success++;
      process.stdout.write(`✅ ${relativePath}\n`);
    } catch (err) {
      failed++;
      process.stdout.write(`❌ ${relativePath} - ${err.message}\n`);
    }
    
    // Rate limiting - wait between requests
    if (i < importantFiles.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log('📊 Upload Summary');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\n🔗 Repo: https://github.com/${CONFIG.owner}/${CONFIG.repo}`);
  console.log('═══════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
