import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

const { data: drivers } = await sb.from('app_users').select('id,name,region,role,lat,lng,location_updated_at').eq('role','motorista');
console.log('Total motoristas:', drivers?.length);
console.log('Com GPS:', drivers?.filter(d=>d.lat!=null&&d.lng!=null).length);
drivers?.forEach(d=>console.log(d.name,'|',d.region,'| GPS:',d.lat?`${d.lat.toFixed(4)},${d.lng.toFixed(4)}`:'SEM'));

const { data: orders } = await sb.from('orders').select('id,point_name,lat,lng,region,status').limit(20);
console.log('Pedidos com GPS:', orders?.filter(o=>o.lat!=null&&o.lng!=null).length,'/',orders?.length);
orders?.forEach(o=>console.log(o.point_name,'|',o.region,'|',o.lat?`${o.lat.toFixed(4)},${o.lng.toFixed(4)}`:'SEM'));

const { data: points } = await sb.from('franchise_points').select('name,lat,lng,region').limit(30);
console.log('Pontos com GPS:', points?.filter(p=>p.lat!=null&&p.lng!=null).length,'/',points?.length);
points?.forEach(p=>console.log(p.name,'|',p.region,'|',p.lat?`${p.lat.toFixed(4)},${p.lng.toFixed(4)}`:'SEM'));
