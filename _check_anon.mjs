import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');
const { data, error } = await sb.from('app_users').select('name,role,lat,lng').limit(10);
if (error) {
  console.log('ERRO:', error.message);
} else {
  console.log('Total app_users:', data?.length);
  data?.forEach(d => console.log(d.name, '| role:', d.role, '| GPS:', d.lat?`${d.lat.toFixed(4)},${d.lng.toFixed(4)}`:'SEM'));
}
