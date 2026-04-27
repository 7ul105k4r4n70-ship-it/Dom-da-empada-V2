import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function syncRecifePricesToSalvador() {
  console.log('🔄 Sincronizando preços de Recife → Salvador (operação única)...\n');

  // 1. Buscar todos os produtos de Recife
  const { data: recifeProducts, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('region', 'Recife');

  if (fetchError) {
    console.error('❌ Erro ao buscar produtos de Recife:', fetchError.message);
    process.exit(1);
  }

  if (!recifeProducts || recifeProducts.length === 0) {
    console.log('⚠️  Nenhum produto encontrado em Recife.');
    process.exit(0);
  }

  console.log(`✅ ${recifeProducts.length} produto(s) encontrado(s) em Recife.\n`);

  // 2. Buscar produtos existentes em Salvador
  const { data: salvadorProducts } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('region', 'Salvador');

  const salvadorMap = new Map(
    (salvadorProducts || []).map(p => [`${p.name}||${p.category}`, p.id])
  );

  let updated = 0;
  let inserted = 0;
  let errors = 0;

  for (const prod of recifeProducts) {
    const key = `${prod.name}||${prod.category}`;
    const existingId = salvadorMap.get(key);

    if (existingId) {
      const { error } = await supabase
        .from('products')
        .update({
          cost_price: prod.cost_price,
          sell_price: prod.sell_price,
          description: prod.description,
        })
        .eq('id', existingId);

      if (error) {
        console.error(`  ❌ Erro ao atualizar "${prod.name}":`, error.message);
        errors++;
      } else {
        console.log(`  🔁 Atualizado: ${prod.name} (R$ ${prod.cost_price} / R$ ${prod.sell_price})`);
        updated++;
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert({
          name: prod.name,
          description: prod.description,
          category: prod.category,
          cost_price: prod.cost_price,
          sell_price: prod.sell_price,
          region: 'Salvador',
        });

      if (error) {
        console.error(`  ❌ Erro ao inserir "${prod.name}":`, error.message);
        errors++;
      } else {
        console.log(`  ✨ Inserido: ${prod.name} (R$ ${prod.cost_price} / R$ ${prod.sell_price})`);
        inserted++;
      }
    }
  }

  console.log('\n─────────────────────────────────────');
  console.log(`✅ Sincronização concluída!`);
  console.log(`   ${inserted} produto(s) adicionado(s) em Salvador`);
  console.log(`   ${updated} produto(s) atualizado(s) em Salvador`);
  if (errors > 0) console.log(`   ⚠️  ${errors} erro(s) — verifique o log acima`);
}

syncRecifePricesToSalvador().catch(console.error);
