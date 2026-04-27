import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  console.log('Testing insert into app_users...');
  const { data, error } = await supabaseAdmin.from('app_users').insert({
    name: 'Test Agent',
    email: 'test-agent@example.com',
    password: 'password123',
    role: 'usuario',
    region: 'Recife',
    status: 'Ativo'
  }).select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
    // Clean up
    const { error: delError } = await supabaseAdmin.from('app_users').delete().eq('email', 'test-agent@example.com');
    if (delError) console.error('Error deleting:', delError);
    else console.log('Deleted test user');
  }
}

testInsert();
