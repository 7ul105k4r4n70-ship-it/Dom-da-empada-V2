import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

// Buscar pontos únicos dos pedidos com suas coordenadas
const { data: orders, error } = await sb
  .from('orders')
  .select('point_name, lat, lng, region')
  .not('lat', 'is', null)
  .order('point_name');

if (error) { console.log('ERRO orders:', error.message); }

// Deduplica por nome de ponto
const seen = new Set();
const unique = (orders || []).filter(o => {
  if (seen.has(o.point_name)) return false;
  seen.add(o.point_name);
  return true;
});

console.log(`\n=== ${unique.length} PONTOS COM COORDENADAS ===\n`);
unique.forEach(o => {
  console.log(`${o.point_name.padEnd(30)} | ${o.region} | lat: ${o.lat}, lng: ${o.lng}`);
});

// Verificar franchise_points
const { data: fp, error: fpe } = await sb.from('franchise_points').select('*').limit(5);
if (fpe) console.log('\nfranchise_points erro:', fpe.message);
else console.log('\nfranchise_points colunas:', fp && fp[0] ? Object.keys(fp[0]).join(', ') : 'vazio');
