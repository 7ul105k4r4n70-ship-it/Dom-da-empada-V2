import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkSchema() {
  console.log('=== ESTRUTURA REAL DA TABELA vehicles ===\n');

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .limit(3);

  if (error) {
    console.log('ERRO:', error.message);
    return;
  }

  console.log('Colunas disponíveis:', Object.keys(data[0] || {}));
  console.log('\nDados dos veículos:');
  data.forEach(v => console.log(JSON.stringify(v, null, 2)));
}

checkSchema();
