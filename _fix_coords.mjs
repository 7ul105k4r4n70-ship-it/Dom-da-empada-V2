import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

const fixes = [
  // Tamires Betania → Shopping Tacaruna, Recife
  { point_name: 'Tamires Betania', lat: -8.0693, lng: -34.8792, region: 'Recife' },
  // Sam's Club Farol → Maceió, AL
  { point_name: "Sam´s Club Farol", lat: -9.5786, lng: -35.7397, region: 'Salvador' },
];

for (const fix of fixes) {
  const { data, error } = await sb
    .from('orders')
    .update({ lat: fix.lat, lng: fix.lng })
    .eq('point_name', fix.point_name)
    .select('id, point_name, lat, lng');

  if (error) {
    console.log(`ERRO ${fix.point_name}:`, error.message);
  } else {
    console.log(`✅ ${fix.point_name} → ${fix.lat}, ${fix.lng} | ${data?.length} pedido(s) atualizados`);
  }
}
