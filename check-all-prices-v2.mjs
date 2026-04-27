import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkAllPrices() {
  console.log('=== VERIFICACAO COMPLETA DE TODOS OS VALORES EM PRECOS E ROYALTIES ===\n');

  // 1. Buscar TODOS os produtos com TODOS os campos
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('region')
    .order('category');

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return;
  }

  console.log('TOTAL DE PRODUTOS CADASTRADOS:', products.length);

  const regions = {};
  products.forEach(p => {
    if (!regions[p.region]) regions[p.region] = [];
    regions[p.region].push(p);
  });

  for (const region of Object.keys(regions)) {
    const items = regions[region];
    console.log('\n REGIAO: ' + region + ' (' + items.length + ' produtos)\n');
    
    const categories = {};
    items.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });

    for (const cat of Object.keys(categories)) {
      const prods = categories[cat];
      console.log('  -- ' + cat + ' (' + prods.length + ' produtos) --');
      prods.forEach(p => {
        const costPrice = p.cost_price || '0';
        const sellPrice = p.sell_price || '0';
        const name = p.name || 'Sem nome';
        console.log('    - ' + name.padEnd(30) + ' | Custo: R$ ' + costPrice.padStart(8) + ' | Venda: R$ ' + sellPrice.padStart(8));
      });
      console.log('');
    }
  }

  // 2. Verificar order_items para ver precos usados nos pedidos
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('product_name, cost_price, quantity, order_id')
    .order('created_at', { ascending: false })
    .limit(50);

  if (itemsError) {
    console.log('Erro ao buscar order_items:', itemsError.message);
  } else if (orderItems && orderItems.length > 0) {
    console.log('\n=== PRECOS USADOS NOS PEDIDOS (order_items) ===\n');
    
    const uniquePrices = {};
    orderItems.forEach(oi => {
      const key = oi.product_name;
      if (!uniquePrices[key]) {
        uniquePrices[key] = {
          name: oi.product_name,
          cost_price: oi.cost_price,
          count: 0
        };
      }
      uniquePrices[key].count++;
    });

    console.log('Precos unicos encontrados nos pedidos:');
    for (const up of Object.values(uniquePrices)) {
      const name = up.name || 'Sem nome';
      const price = up.cost_price || 'N/A';
      console.log('  - ' + name.padEnd(30) + ' | Preco: R$ ' + price + ' | Usado ' + up.count + 'x');
    }
  }

  // 3. Verificar se ha produtos sem preco
  const noPriceProducts = products.filter(p => 
    (!p.cost_price || p.cost_price === '0' || p.cost_price === '0.00') && 
    p.category !== 'Descartaveis' && 
    p.category !== 'Fardamento'
  );

  if (noPriceProducts.length > 0) {
    console.log('\n PRODUTOS SEM PRECO DE CUSTO:\n');
    for (const p of noPriceProducts) {
      const name = p.name || 'Sem nome';
      console.log('  - ' + name + ' (' + p.category + ') - cost_price: "' + p.cost_price + '"');
    }
  }

  // 4. Resumo de valores unicos
  const uniqueCostPrices = new Set();
  products.forEach(p => {
    if (p.cost_price) uniqueCostPrices.add(p.cost_price);
  });

  console.log('\n=== RESUMO DE PRECOS UNICOS ===');
  console.log('Precos de custo unicos:', Array.from(uniqueCostPrices).join(', '));

  console.log('\n=== FIM DA VERIFICACAO ===');
}

checkAllPrices();
