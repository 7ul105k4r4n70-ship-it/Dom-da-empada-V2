import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkPolicies() {
  const { data, error } = await supabaseAdmin.rpc('get_policies_for_table', { table_name: 'orders' });
  if (error) {
    // If rpc doesn't exist, let's query pg_policies directly
    const { data: policies, error: pgError } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'orders');
      
    if (pgError) {
      console.error(pgError);
    } else {
      console.log('Policies for orders table:', policies);
    }
  } else {
    console.log(data);
  }
}

checkPolicies();
