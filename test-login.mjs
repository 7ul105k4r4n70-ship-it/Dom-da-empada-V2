import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin(email, password) {
  console.log(`Testando login para: ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    console.log(`❌ Falha no login: ${error.message}`);
  } else {
    console.log(`✅ Login bem sucedido! User ID: ${data.user.id}`);
  }
}

// Testar com o motorista novo: Ismael Rodrigues
testLogin('ismael@gmail.com', 'I123456r');
