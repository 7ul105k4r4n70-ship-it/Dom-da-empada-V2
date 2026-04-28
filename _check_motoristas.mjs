import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE');
const { data } = await sb.from('app_users').select('name,lat,lng,location_updated_at').eq('role','motorista');
console.log('Motoristas no banco:');
data?.forEach(d => console.log(d.name, '| GPS:', d.lat?`${d.lat.toFixed(4)},${d.lng.toFixed(4)}`:'SEM', '| atualizado:', d.location_updated_at));
