import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDeliveryProducts() {
  console.log('📦 Verificando delivery_products vs orders vs order_items...\n');

  // 1. Ver quantos delivery_products existem
  const { data: dp, error: dpError } = await supabase
    .from('delivery_products')
    .select('*, order_id')
    .order('delivered_at', { ascending: false })
    .limit(20);

  if (dpError) {
    console.error('❌ Erro delivery_products:', dpError);
    return;
  }

  console.log(`📊 Total delivery_products: ${dp.length}`);
  console.log('\n📦 Últimos 20 delivery_products:');
  dp.forEach((item, i) => {
    console.log(`${i + 1}. ${item.product_name} | Qtd: ${item.quantity} | Order: ${item.order_id?.substring(0, 8)} | Region: ${item.region}`);
  });

  // 2. Ver orders entregues
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, short_id, point_name, region, status, order_code, created_at')
    .eq('status', 'DELIVERED')
    .order('created_at', { ascending: false })
    .limit(10);

  if (ordersError) {
    console.error('❌ Erro orders:', ordersError);
    return;
  }

  console.log(`\n📋 Total orders DELIVERED: ${orders.length}\n`);

  // 3. Para cada order, verificar se tem delivery_products
  for (const order of orders) {
    console.log(`\n🔍 Order: ${order.order_code || order.short_id} (${order.id.substring(0, 8)})`);
    console.log(`   Franqueado: ${order.point_name}`);
    console.log(`   Region: ${order.region}`);

    // Ver delivery_products
    const { data: dpOrder, error: dpOrderError } = await supabase
      .from('delivery_products')
      .select('*')
      .eq('order_id', order.id);

    if (dpOrderError) {
      console.error('   ❌ Erro:', dpOrderError);
      continue;
    }

    console.log(`   📦 delivery_products: ${dpOrder.length} itens`);
    if (dpOrder.length > 0) {
      dpOrder.forEach((dp) => {
        console.log(`      - ${dp.product_name}: ${dp.quantity} (${dp.category})`);
      });
    } else {
      console.log('   ⚠️  NENHUM delivery_products encontrado!');
    }

    // Ver order_items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) {
      console.error('   ❌ Erro order_items:', itemsError);
    } else {
      console.log(`   📝 order_items: ${items.length} itens`);
      if (items.length > 0) {
        items.forEach((item) => {
          console.log(`      - ${item.product_name}: ${item.quantity}`);
        });
      }
    }
  }

  // 4. Comparar totals
  console.log('\n\n📊 RESUMO COMPARATIVO:');
  const { count: dpCount } = await supabase
    .from('delivery_products')
    .select('*', { count: 'exact', head: true });

  const { count: orderItemsCount } = await supabase
    .from('order_items')
    .select('*', { count: 'exact', head: true });

  console.log(`delivery_products total: ${dpCount} registros`);
  console.log(`order_items total: ${orderItemsCount} registros`);
}

checkDeliveryProducts();
