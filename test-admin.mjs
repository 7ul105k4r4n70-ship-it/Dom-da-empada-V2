import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function testAdmin() {
  console.log('Testando Admin API...');
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.log(`❌ Erro Admin: ${error.message}`);
  } else {
    console.log(`✅ Admin OK! Total de usuários no Auth: ${data.users.length}`);
  }
}

testAdmin();
