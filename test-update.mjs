import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  // Login with Oseas
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'oseas@motorista.com',
    password: 'O123456a'
  });

  if (authError) {
    console.log('Auth Error:', authError.message);
    return;
  }
  
  console.log('Logged in as:', authData.user.id);

  // Try to update an order
  const pointId = '60631049-54e3-4f6b-a129-b26abd0a9e2d'; // from previous check
  
  const { data, error, count } = await supabase
    .from('orders')
    .update({ status: 'COMPLETED' })
    .eq('id', pointId)
    .select();

  console.log('Update result:', data);
  console.log('Update error:', error);
}

testUpdate();
