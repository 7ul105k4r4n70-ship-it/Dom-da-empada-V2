import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAllPrices() {
  console.log('=== VERIFICAÇÃO COMPLETA DE PREÇOS ===\n');

  // 1. TODOS os produtos com preços da página "Preços e Royalties"
  console.log('1️⃣ PRODUTOS CADASTRADOS EM "PREÇOS E ROYALTIES" (tabela products):');
  const { data: allProducts, error } = await supabase
    .from('products')
    .select('id, name, category, cost_price, sell_price, region')
    .order('region', { ascending: true })
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return;
  }

  console.log(`\nTotal de produtos: ${allProducts?.length || 0}\n`);
  
  // Agrupar por região
  const byRegion = {};
  allProducts?.forEach(p => {
    if (!byRegion[p.region]) byRegion[p.region] = [];
    byRegion[p.region].push(p);
  });

  Object.entries(byRegion).forEach(([region, products]) => {
    console.log(`\n📍 Região: ${region} (${products.length} produtos)`);
    console.log('─'.repeat(80));
    products.forEach(p => {
      console.log(`  ${p.name.padEnd(30)} | ${p.category.padEnd(15)} | Custo: R$ ${p.cost_price?.padStart(8)} | Venda: R$ ${p.sell_price?.padStart(8)}`);
    });
  });

  // 2. Verificar order_items de pedidos recentes
  console.log('\n\n2️⃣ PREÇOS NOS PEDIDOS (order_items - snapshot):');
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, point_name, created_at, region')
    .order('created_at', { ascending: false })
    .limit(3);
  
  if (recentOrders && recentOrders.length > 0) {
    for (const order of recentOrders) {
      console.log(`\n📦 Pedido: ${order.id.substring(0, 8)}... | Franqueado: ${order.point_name} | Data: ${new Date(order.created_at).toLocaleDateString('pt-BR')}`);
      
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_name, quantity, cost_price')
        .eq('order_id', order.id);
      
      if (orderItems && orderItems.length > 0) {
        orderItems.forEach(item => {
          console.log(`    ${item.product_name.padEnd(30)} | Qtd: ${String(item.quantity).padStart(5)} cx | Preço: R$ ${item.cost_price}`);
        });
      } else {
        console.log('    (sem itens)');
      }
    }
  }

  // 3. Verificar se tabela prices existe
  console.log('\n\n3️⃣ TABELA PRICES (se existir):');
  const { data: prices, error: pricesError } = await supabase
    .from('prices')
    .select('*')
    .limit(5);
  
  if (pricesError) {
    console.log('❌ Tabela prices não existe ou erro:', pricesError.message);
  } else if (prices && prices.length > 0) {
    console.log(`✅ Tabela prices existe com ${prices.length} registros`);
    prices.forEach(p => {
      console.log(`  Product: ${p.product_id} | Custo: ${p.cost_price} | Venda: ${p.sale_price} | Válido desde: ${p.valid_from}`);
    });
  } else {
    console.log('⚠️ Tabela prices existe mas está vazia');
  }

  console.log('\n\n=== FIM DA VERIFICAÇÃO ===');
}

checkAllPrices();
