import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

// Verificar categorias no catálogo products para produtos de ambas regiões
const { data: prods, error } = await sb.from('products').select('name, category, region').in('name', ['Pizza', 'Carne com Azeitona', 'Camarão com Requeijão', 'Frango com Requeijão']);
console.log('=== CATÁLOGO products ===');
(prods || []).forEach(p => console.log(`"${p.name}" | cat:"${p.category}" | reg:${p.region}`));

// Verificar um pedido recente completo
const { data: orders } = await sb.from('orders').select('id, point_name, region').eq('status','COMPLETED').order('delivered_at',{ascending:false}).limit(1);
if (orders?.[0]) {
  const oid = orders[0].id;
  console.log(`\n=== PEDIDO: ${orders[0].point_name} | reg:${orders[0].region} ===`);
  const { data: oi } = await sb.from('order_items').select('product_name, category, quantity').eq('order_id', oid);
  const { data: dp } = await sb.from('delivery_products').select('product_name, category, quantity').eq('order_id', oid);
  console.log('order_items:');
  (oi||[]).forEach(i => console.log(`  "${i.product_name}" | cat:"${i.category}" | qty:${i.quantity}`));
  console.log('delivery_products:');
  (dp||[]).forEach(i => console.log(`  "${i.product_name}" | cat:"${i.category}" | qty:${i.quantity}`));
}
