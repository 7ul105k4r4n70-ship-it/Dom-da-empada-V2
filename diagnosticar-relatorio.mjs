import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnosticarRelatorio() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DO RELATÓRIO DE ENTREGAS\n');

  // 1. Produtos no catálogo Recife
  const { data: productsRecife } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('region', 'Recife')
    .order('category');

  console.log(`📦 Catálogo Recife: ${productsRecife?.length || 0} produtos`);
  if (productsRecife) {
    console.log('Produtos:', productsRecife.map(p => p.name).join(', '));
  }

  // 2. Orders entregues Recife
  const { data: ordersRecife } = await supabase
    .from('orders')
    .select('id, short_id, order_code, point_name, status, created_at')
    .eq('region', 'Recife')
    .in('status', ['DELIVERED', 'COMPLETED'])
    .order('created_at', { ascending: false });

  console.log(`\n📋 Orders entregues Recife: ${ordersRecife?.length || 0}`);

  if (!ordersRecife || ordersRecife.length === 0) {
    console.log('⚠️ NENHUM ORDER ENTREGUE ENCONTRADO!');
    return;
  }

  // 3. Order_items desses orders
  const orderIds = ordersRecife.map(o => o.id);
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*, order_id')
    .in('order_id', orderIds);

  console.log(`\n📝 Order items total: ${orderItems?.length || 0}`);

  // 4. Delivery_products desses orders
  const { data: deliveryProducts } = await supabase
    .from('delivery_products')
    .select('*, order_id')
    .in('order_id', orderIds);

  console.log(`\n📦 Delivery products total: ${deliveryProducts?.length || 0}`);

  // 5. Agrupar produtos por nome
  const productMap = new Map();

  // Contar order_items
  orderItems?.forEach(item => {
    if (!productMap.has(item.product_name)) {
      productMap.set(item.product_name, {
        name: item.product_name,
        category: item.category || 'N/A',
        quantity_oi: 0,
        quantity_dp: 0,
        orders: new Set()
      });
    }
    const prod = productMap.get(item.product_name);
    prod.quantity_oi += Number(item.quantity || 0);
    prod.orders.add(item.order_id);
  });

  // Contar delivery_products
  deliveryProducts?.forEach(dp => {
    if (!productMap.has(dp.product_name)) {
      productMap.set(dp.product_name, {
        name: dp.product_name,
        category: dp.category || 'N/A',
        quantity_oi: 0,
        quantity_dp: 0,
        orders: new Set()
      });
    }
    const prod = productMap.get(dp.product_name);
    prod.quantity_dp += Number(dp.quantity || 0);
    prod.orders.add(dp.order_id);
  });

  // 6. Mostrar comparação
  console.log('\n\n📊 COMPARAÇÃO DE PRODUTOS:');
  console.log('='.repeat(80));
  console.log('Produto'.padEnd(30) + ' | Order Items | Delivery Prod | Orders');
  console.log('='.repeat(80));

  const sortedProducts = Array.from(productMap.values()).sort((a, b) => b.quantity_oi - a.quantity_oi);
  
  sortedProducts.forEach(prod => {
    const oi = prod.quantity_oi.toString().padEnd(11);
    const dp = prod.quantity_dp.toString().padEnd(13);
    const orders = prod.orders.size.toString();
    console.log(`${prod.name.padEnd(30)} | ${oi} | ${dp} | ${orders}`);
  });

  // 7. Produtos do catálogo que NÃO aparecem nos itens
  console.log('\n\n⚠️ PRODUTOS DO CATÁLOGO SEM ENTREGAS:');
  console.log('='.repeat(80));
  
  const productsWithDeliveries = new Set(productMap.keys());
  const productsWithout = productsRecife?.filter(p => !productsWithDeliveries.has(p.name)) || [];
  
  if (productsWithout.length > 0) {
    productsWithout.forEach(p => {
      console.log(`  - ${p.name} (${p.category})`);
    });
  } else {
    console.log('  Nenhum - todos os produtos do catálogo têm entregas!');
  }

  // 8. Resumo
  console.log('\n\n📈 RESUMO:');
  console.log(`  Produtos no catálogo: ${productsRecife?.length || 0}`);
  console.log(`  Produtos com order_items: ${orderItems?.length || 0} registros`);
  console.log(`  Produtos com delivery_products: ${deliveryProducts?.length || 0} registros`);
  console.log(`  Produtos únicos com entregas: ${productMap.size}`);
  console.log(`  Produtos sem entregas: ${productsWithout.length}`);
}

diagnosticarRelatorio();
