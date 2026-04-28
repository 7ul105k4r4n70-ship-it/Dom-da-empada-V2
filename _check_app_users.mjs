import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE');
const { data, error } = await sb.from('app_users').select('name,role,lat,lng').limit(10);
if (error) {
  console.log('ERRO:', error.message);
} else {
  console.log('Total app_users:', data?.length);
  data?.forEach(d => console.log(d.name, '| role:', d.role, '| GPS:', d.lat?`${d.lat.toFixed(4)},${d.lng.toFixed(4)}`:'SEM'));
}
