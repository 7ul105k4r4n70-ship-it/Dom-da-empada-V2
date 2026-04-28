import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

// Ver categorias únicas em order_items
const { data: oi } = await sb.from('order_items').select('product_name, category, quantity').limit(100);
const { data: dp } = await sb.from('delivery_products').select('product_name, category, quantity').limit(100);

console.log('\n=== ORDER_ITEMS - categorias únicas ===');
const oiCats = [...new Set((oi||[]).map(i => `"${i.category || '(vazio)'}"`))];
oiCats.forEach(c => console.log(' ', c));

console.log('\n=== DELIVERY_PRODUCTS - categorias únicas ===');
const dpCats = [...new Set((dp||[]).map(i => `"${i.category || '(vazio)'}"`))];
dpCats.forEach(c => console.log(' ', c));

console.log('\n=== DELIVERY_PRODUCTS - Produtos com categorias que não são Empada/Pastel ===');
(dp||[]).filter(i => {
  const cat = (i.category||'').toLowerCase();
  return !cat.includes('empada') && !cat.includes('pastel') && !cat.includes('doce') && i.quantity > 0;
}).forEach(i => console.log(` "${i.product_name}" | cat: "${i.category}" | qty: ${i.quantity}`));

console.log('\n=== AMOSTRAS delivery_products com qty > 0 ===');
(dp||[]).filter(i => i.quantity > 0).slice(0, 20).forEach(i => {
  console.log(` "${i.product_name}" | cat: "${i.category}" | qty: ${i.quantity}`);
});
