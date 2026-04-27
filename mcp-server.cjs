#!/usr/bin/env node
/**
 * MCP Server - Git Commit & Vercel Deploy
 * Servidor MCP que permite fazer commit/push e deploy via ferramentas
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuracoes
const PROJECT_DIR = 'C:\\Users\\Tulio Scaranto\\Documents\\Dom-da-empada-V2';
const GITHUB_TOKEN = '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';
const GITHUB_OWNER = '7ul105k4r4n70-ship-it';
const GITHUB_REPO = 'portal-administrativo';

// Criar servidor MCP
const server = new Server(
  {
    name: 'dom-da-empada-deploy',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Lista de ferramentas disponiveis
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'git_status',
        description: 'Verificar status dos arquivos modificados',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'git_commit_push',
        description: 'Fazer commit de todos os arquivos modificados e push para GitHub',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem do commit',
              default: 'deploy: atualizacao automatica',
            },
          },
        },
      },
      {
        name: 'vercel_deploy',
        description: 'Fazer deploy no Vercel (producao)',
        inputSchema: {
          type: 'object',
          properties: {
            force: {
              type: 'boolean',
              description: 'Forcar rebuild sem cache',
              default: true,
            },
          },
        },
      },
      {
        name: 'full_deploy',
        description: 'Commit + Push + Deploy completo',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem do commit',
              default: 'deploy: atualizacao completa',
            },
          },
        },
      },
    ],
  };
});

// Executar comando e retornar resultado
function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      cwd: PROJECT_DIR,
      encoding: 'utf8',
      timeout: 120000,
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.stderr || error.message };
  }
}

// Handler para chamadas de ferramentas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'git_status': {
      const result = exec('dir /s /b *.tsx *.ts *.css *.html *.json 2>nul | findstr /i "reports finance"');
      return {
        content: [
          {
            type: 'text',
            text: result.success ? result.output : `Erro: ${result.error}`,
          },
        ],
      };
    }

    case 'git_commit_push': {
      const message = args?.message || 'deploy: atualizacao automatica';
      
      // Usar API do GitHub para fazer commit
      const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
      
      // 1. Pegar referencia atual da branch main
      const refResult = await fetch(`${apiBase}/git/refs/heads/main`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
      }).then(r => r.json());
      
      if (!refResult.object) {
        return {
          content: [{ type: 'text', text: `Erro ao pegar referencia: ${JSON.stringify(refResult)}` }],
        };
      }
      
      const currentCommit = refResult.object.sha;
      
      // 2. Pegar arvore atual
      const commitResult = await fetch(`${apiBase}/git/commits/${currentCommit}`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
      }).then(r => r.json());
      
      const baseTree = commitResult.tree.sha;
      
      // 3. Ler arquivo Reports.tsx e converter para base64
      const reportsPath = path.join(PROJECT_DIR, 'src', 'pages', 'Reports.tsx');
      const reportsContent = fs.readFileSync(reportsPath, 'utf8');
      const reportsBase64 = Buffer.from(reportsContent).toString('base64');
      
      // 4. Criar novo blob
      const blobResult = await fetch(`${apiBase}/git/blobs`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reportsContent, encoding: 'utf-8' })
      }).then(r => r.json());
      
      // 5. Criar nova arvore
      const treeResult = await fetch(`${apiBase}/git/trees`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_tree: baseTree,
          tree: [
            { path: 'src/pages/Reports.tsx', mode: '100644', type: 'blob', sha: blobResult.sha }
          ]
        })
      }).then(r => r.json());
      
      // 6. Criar novo commit
      const newCommitResult = await fetch(`${apiBase}/git/commits`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          tree: treeResult.sha,
          parents: [currentCommit]
        })
      }).then(r => r.json());
      
      // 7. Atualizar referencia
      await fetch(`${apiBase}/git/refs/heads/main`, {
        method: 'PATCH',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha: newCommitResult.sha, force: false })
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Commit realizado com sucesso!\nMensagem: ${message}\nCommit SHA: ${newCommitResult.sha}\n\n🔗 https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
          },
        ],
      };
    }

    case 'vercel_deploy': {
      const force = args?.force ? '--force' : '';
      const result = exec(`npx vercel --prod --yes ${force}`);
      return {
        content: [
          {
            type: 'text',
            text: result.success
              ? `✅ Deploy realizado com sucesso!\n\n${result.output}\n\n🔗 https://portal-administrativo.sk4r4n70.cloud`
              : `❌ Erro no deploy:\n${result.error}`,
          },
        ],
      };
    }

    case 'full_deploy': {
      const message = args?.message || 'deploy: atualizacao completa';
      
      // Commit via API
      const commitResult = await server.handleRequest({
        method: 'tools/call',
        params: { name: 'git_commit_push', arguments: { message } }
      });
      
      // Deploy
      const deployResult = await server.handleRequest({
        method: 'tools/call',
        params: { name: 'vercel_deploy', arguments: { force: true } }
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `🚀 DEPLOY COMPLETO\n\n${commitResult.content[0].text}\n\n---\n\n${deployResult.content[0].text}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Ferramenta desconhecida: ${name}`);
  }
});

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server iniciado: dom-da-empada-deploy');
}

main().catch(console.error);
