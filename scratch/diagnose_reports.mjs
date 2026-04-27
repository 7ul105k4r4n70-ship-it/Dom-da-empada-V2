import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function diagnose() {
  console.log('\n=== DIAGNÓSTICO COMPLETO - TABELA ORDERS ===\n');

  // 1. Total de orders sem filtro
  const { data: all, error: e1 } = await supabase.from('orders').select('id, status, region, created_at').order('created_at', { ascending: false });
  if (e1) { console.error('ERRO ao buscar SEM filtro:', e1.message, e1.code, e1.hint); return; }
  console.log('1. Total de orders (sem filtro):', all?.length ?? 0);

  // 2. Por região
  const regioes = {};
  (all || []).forEach(o => { regioes[o.region] = (regioes[o.region] || 0) + 1; });
  console.log('2. Por região:', regioes);

  // 3. Por status
  const statuses = {};
  (all || []).forEach(o => { statuses[o.status] = (statuses[o.status] || 0) + 1; });
  console.log('3. Por status:', statuses);

  // 4. Filtrar apenas Recife
  const { data: rec, error: e2 } = await supabase.from('orders').select('id, status').eq('region', 'Recife');
  if (e2) { console.error('ERRO ao filtrar Recife:', e2.message); }
  else console.log('4. Orders da região Recife:', rec?.length ?? 0);

  // 5. Filtrar apenas Salvador
  const { data: sal, error: e3 } = await supabase.from('orders').select('id, status').eq('region', 'Salvador');
  if (e3) { console.error('ERRO ao filtrar Salvador:', e3.message); }
  else console.log('5. Orders da região Salvador:', sal?.length ?? 0);

  // 6. Mostrar últimos 5 orders com todos campos relevantes
  console.log('\n6. Últimos 5 orders (dados completos):');
  (all || []).slice(0, 5).forEach((o, i) => {
    console.log(`  [${i+1}]`, JSON.stringify(o));
  });

  console.log('\n=== FIM DO DIAGNÓSTICO ===\n');
}

diagnose().catch(console.error);
