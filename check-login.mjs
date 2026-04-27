import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkLogin() {
  console.log('=== TESTANDO LOGIN REAL ===\n');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'contato@sk4r4n70.cloud',
    password: 'O123456a'
  });
  
  if (error) {
    console.log('ERRO Login:', error.message);
    return;
  }

  console.log('Login OK!');
  console.log('User Role:', data.user.role);
  console.log('Access Token JWT:', data.session.access_token);
  
  // Vamos decodificar a payload do JWT para ver o papel
  const parts = data.session.access_token.split('.');
  if (parts.length === 3) {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('\nJWT Payload:');
    console.log(JSON.stringify(payload, null, 2));
  }
}

checkLogin();
