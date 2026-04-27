/**
 * fix-firebase-domain.mjs
 * Adiciona localhost e 127.0.0.1 aos domínios autorizados do Firebase Auth.
 * Requer: firebase login (executado uma vez antes deste script)
 */
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const PROJECT_ID = 'gen-lang-client-0741219036';
const DOMAINS_TO_ADD = [
  'localhost',
  '127.0.0.1',
  'gen-lang-client-0741219036.firebaseapp.com',
  'gen-lang-client-0741219036.web.app',
];

// Credenciais públicas do Firebase CLI (open source: firebase-tools)
const CLI_CLIENT_ID     = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLI_CLIENT_SECRET = 'j9iVZfS8ys-YAK6BqIJTLLjF';

async function getAccessToken() {
  const paths = [
    join(homedir(), '.config', 'configstore', 'firebase-tools.json'),
    join(homedir(), 'AppData', 'Roaming', 'configstore', 'firebase-tools.json'),
  ];

  let config;
  for (const p of paths) {
    try { config = JSON.parse(readFileSync(p, 'utf8')); break; } catch {}
  }

  if (!config) {
    console.error('❌ Firebase CLI não autenticado.\n   Execute primeiro:  firebase login\n   Depois rode este script novamente.');
    process.exit(1);
  }

  const refreshToken = config.tokens?.refresh_token;
  if (!refreshToken) {
    console.error('❌ Refresh token não encontrado. Execute: firebase login');
    process.exit(1);
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLI_CLIENT_ID,
      client_secret: CLI_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }).toString(),
  });

  const data = await res.json();
  if (!data.access_token) {
    console.error('❌ Falha ao trocar refresh token:', data.error_description ?? data.error);
    process.exit(1);
  }
  return data.access_token;
}

async function fixDomains(accessToken) {
  const base = `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config`;
  const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

  // 1. Lê config atual
  const getRes  = await fetch(base, { headers });
  const current = await getRes.json();

  if (current.error) {
    console.error('❌ Erro ao ler config Firebase:', current.error.message);
    console.error('   Verifique se a conta logada tem acesso ao projeto:', PROJECT_ID);
    process.exit(1);
  }

  const existing = current.authorizedDomains ?? [];
  const merged   = [...new Set([...existing, ...DOMAINS_TO_ADD])];
  const added    = merged.filter(d => !existing.includes(d));

  if (added.length === 0) {
    console.log('✅ Todos os domínios já estavam autorizados:', existing);
    return;
  }

  console.log('📋 Domínios existentes :', existing);
  console.log('➕ Domínios a adicionar :', added);

  // 2. Atualiza com PATCH
  const patchRes = await fetch(`${base}?updateMask=authorizedDomains`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ authorizedDomains: merged }),
  });

  const result = await patchRes.json();

  if (result.authorizedDomains) {
    console.log('\n✅ Sucesso! Domínios autorizados agora:', result.authorizedDomains);
    console.log('\n🔄 Reinicie o servidor (npm run dev) e tente o login novamente.');
  } else {
    console.error('❌ Resposta inesperada:', JSON.stringify(result, null, 2));
  }
}

const token = await getAccessToken();
await fixDomains(token);
