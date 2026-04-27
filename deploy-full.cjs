#!/usr/bin/env node
/**
 * Deploy Full - Commit + Push + Deploy
 * Uso: node deploy-full.js "mensagem do commit"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuracoes
const PROJECT_DIR = 'C:\\Users\\Tulio Scaranto\\Documents\\Dom-da-empada-V2';
const GITHUB_TOKEN = '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';
const GITHUB_OWNER = '7ul105k4r4n70-ship-it';
const GITHUB_REPO = 'portal-administrativo';
const BRANCH = 'main';

const message = process.argv[2] || 'deploy: atualizacao automatica';

async function githubApi(endpoint, options = {}) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API erro ${response.status}: ${error}`);
  }
  return response.json();
}

async function commitFile(filePath, repoPath, message) {
  const fullPath = path.join(PROJECT_DIR, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // 1. Pegar referencia da branch
  const ref = await githubApi(`/git/refs/heads/${BRANCH}`);
  const currentCommit = ref.object.sha;
  
  // 2. Pegar commit atual para obter a arvore
  const commit = await githubApi(`/git/commits/${currentCommit}`);
  const baseTree = commit.tree.sha;
  
  // 3. Criar blob
  const blob = await githubApi('/git/blobs', {
    method: 'POST',
    body: JSON.stringify({ content, encoding: 'utf-8' }),
  });
  
  // 4. Criar nova arvore
  const tree = await githubApi('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTree,
      tree: [{ path: repoPath, mode: '100644', type: 'blob', sha: blob.sha }],
    }),
  });
  
  // 5. Criar novo commit
  const newCommit = await githubApi('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: `${message} [${filePath}]`,
      tree: tree.sha,
      parents: [currentCommit],
    }),
  });
  
  // 6. Atualizar referencia
  await githubApi(`/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });
  
  return newCommit.sha;
}

async function deploy() {
  console.log('🚀 Iniciando deploy completo...\n');
  
  try {
    // Commit dos arquivos modificados
    console.log('[1/3] Commit no GitHub...');
    const sha = await commitFile('src/pages/Reports.tsx', 'src/pages/Reports.tsx', message);
    console.log(`✅ Commit OK: ${sha.substring(0, 7)}\n`);
    
    // Deploy no Vercel
    console.log('[2/3] Deploy no Vercel...');
    const result = execSync('npx vercel --prod --yes', {
      cwd: PROJECT_DIR,
      encoding: 'utf8',
      timeout: 120000,
    });
    console.log('✅ Deploy OK\n');
    
    console.log('═══════════════════════════════════════');
    console.log('🎉 DEPLOY COMPLETO!');
    console.log('═══════════════════════════════════════');
    console.log(`🔗 GitHub: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`);
    console.log(`\n🔗 https://portal-administrativo.sk4r4n70.cloud`);
    console.log('═══════════════════════════════════════');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

deploy();
