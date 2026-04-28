import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

// Pegar 3 pedidos completados recentes que tenham delivery_products
const { data: orders } = await sb
  .from('orders')
  .select('id, point_name, status')
  .eq('status', 'COMPLETED')
  .order('delivered_at', { ascending: false })
  .limit(3);

for (const order of (orders || [])) {
  console.log(`\n=== Pedido: ${order.point_name} (${order.id.slice(0,8)}) ===`);

  const { data: oi } = await sb.from('order_items')
    .select('product_name, category, quantity')
    .eq('order_id', order.id);

  const { data: dp } = await sb.from('delivery_products')
    .select('product_name, category, quantity')
    .eq('order_id', order.id);

  if (!oi?.length && !dp?.length) { console.log('  (sem produtos)'); continue; }

  console.log('  order_items:');
  (oi||[]).forEach(i => console.log(`    "${i.product_name}" | cat:"${i.category}" | qty:${i.quantity}`));

  console.log('  delivery_products:');
  (dp||[]).forEach(i => console.log(`    "${i.product_name}" | cat:"${i.category}" | qty:${i.quantity}`));
}
