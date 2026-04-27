import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function testVehicles() {
  console.log('=== TESTANDO CONSULTA DE VEÍCULOS (igual ao FleetSelection.tsx) ===\n');

  // Teste 1: buscar todos veículos sem filtro
  console.log('1. Todos os veículos (sem filtro):');
  const { data: all, error: allErr } = await supabase
    .from('vehicles')
    .select('*');
  
  if (allErr) {
    console.log('   ❌ ERRO:', allErr.message);
  } else {
    console.log(`   ✅ Total: ${all.length} veículos`);
    all.forEach(v => {
      console.log(`   - ${v.name || v.id} | placa: ${v.plate} | região: ${v.region} | status: ${v.status}`);
    });
  }

  console.log('\n2. Veículos filtrados por região "Recife":');
  const { data: byRegion, error: regionErr } = await supabase
    .from('vehicles')
    .select('*')
    .eq('region', 'Recife')
    .order('brand');

  if (regionErr) {
    console.log('   ❌ ERRO:', regionErr.message, '| code:', regionErr.code);
    console.log('   Full error:', JSON.stringify(regionErr));
  } else {
    console.log(`   ✅ Total para Recife: ${byRegion.length} veículos`);
    byRegion.forEach(v => {
      console.log(`   - ${v.name} | ${v.plate} | status: ${v.status} | fuel: ${v.fuel_level}%`);
    });
  }
}

testVehicles();
