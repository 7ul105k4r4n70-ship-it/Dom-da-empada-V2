import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function verifyMotoristas() {
  console.log('=== VERIFICACAO DE MOTORISTAS (app_users) ===\n');

  const { data: motoristas, error } = await supabase
    .from('app_users')
    .select('id, name, email, role, status, auth_uid, password, created_at')
    .ilike('role', 'motorista')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('❌ Erro ao buscar motoristas:', error.message);
    return;
  }

  console.log(`Total de motoristas encontrados: ${motoristas.length}\n`);

  motoristas.forEach(m => {
    console.log(`- Nome: ${m.name}`);
    console.log(`  Email: ${m.email}`);
    console.log(`  Status: ${m.status}`);
    console.log(`  Auth UID: ${m.auth_uid || '❌ NULO'}`);
    console.log(`  Senha no Banco: ${m.password || '❌ NULO'}`);
    console.log(`  Criado em: ${m.created_at}`);
    console.log('-------------------');
  });

  console.log('\n=== FIM DA VERIFICACAO ===');
}

verifyMotoristas();
