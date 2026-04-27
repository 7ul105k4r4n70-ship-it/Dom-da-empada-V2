import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
  console.log('=== VERIFICANDO DADOS NO BANCO ===/n');

  // 1. Ver produtos e preços
  console.log('1️⃣ PRODUTOS E PREÇOS (tabela products):');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, category, cost_price, sell_price, region')
    .eq('region', 'Recife')
    .limit(5);
  
  if (productsError) {
    console.error('Erro:', productsError);
  } else {
    console.log(`Total de produtos: ${products?.length || 0}`);
    products?.forEach(p => {
      console.log(`  - ${p.name} | Categoria: ${p.category} | Custo: ${p.cost_price} | Venda: ${p.sell_price}`);
    });
  }

  // 2. Ver order_items de um pedido recente
  console.log('/n2️⃣ ORDER_ITEMS (preços salvos nos pedidos):');
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, point_name, created_at')
    .eq('region', 'Recife')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (recentOrders && recentOrders.length > 0) {
    const orderId = recentOrders[0].id;
    console.log(`Pedido: ${orderId}`);
    
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_name, quantity, cost_price')
      .eq('order_id', orderId);
    
    console.log(`Itens do pedido: ${orderItems?.length || 0}`);
    orderItems?.forEach(item => {
      console.log(`  - ${item.product_name} | Qtd: ${item.quantity} | Cost Price: ${item.cost_price}`);
    });
  }

  console.log('/n=== FIM DA VERIFICAÇÃO ===');
}

checkData();
