import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');
const { data, error } = await sb.from('app_users').select('name,role,lat,lng,location_updated_at').eq('role','motorista');
if (error) {
  console.log('ERRO:', error.message);
} else {
  console.log('Total motoristas:', data?.length);
  data?.forEach(d => {
    const gps = (d.lat != null && d.lng != null) ? `${d.lat},${d.lng}` : 'SEM GPS';
    console.log(d.name, '|', gps, '| atualizado:', d.location_updated_at || 'nunca');
  });
}
