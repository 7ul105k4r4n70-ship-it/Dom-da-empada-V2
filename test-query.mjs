import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testQuery() {
  const cleanName = 'Oseas Arcanjo';
  console.log(`Testando busca por: ${cleanName}`);
  
  const { data: userData, error: userError } = await supabase
    .from('app_users')
    .select('id, name, email, status, auth_uid, region')
    .ilike('name', cleanName)
    .maybeSingle();
    
  if (userError) {
    console.error('ERRO:', userError);
  } else {
    console.log('DATA:', userData);
  }
}

testQuery();
