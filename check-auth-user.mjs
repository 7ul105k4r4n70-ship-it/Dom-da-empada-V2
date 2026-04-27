import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkAuthUser() {
  console.log('=== CHECANDO AUTH.USERS ===\n');

  // get user by email
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.log('ERRO listando users:', error.message);
    return;
  }

  const oseas = data.users.find(u => u.email === 'contato@sk4r4n70.cloud');
  if (oseas) {
    console.log('Oseas Auth User:');
    console.log(`ID: ${oseas.id}`);
    console.log(`Role: "${oseas.role}"`);
    console.log(`Email: ${oseas.email}`);
  } else {
    console.log('Oseas não encontrado em auth.users');
  }
}

checkAuthUser();
