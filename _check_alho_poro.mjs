import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

// Ver produtos da tabela products
const { data: products, error } = await sb.from('products').select('name, category, region').order('category');
console.log('=== PRODUTOS NA TABELA products ===');
if (error) console.log('ERRO:', error.message);
(products || []).forEach(p => {
  const marker = p.name.toLowerCase().includes('alho') ? ' <<< ALHO PORO' : '';
  console.log(`"${p.name}" | cat: "${p.category}" | reg: ${p.region}${marker}`);
});

// Verificar se Alho Poró aparece em delivery_products ou order_items
console.log('\n=== DELIVERY_PRODUCTS com "alho" ===');
const { data: dp } = await sb.from('delivery_products').select('product_name, category').ilike('product_name', '%alho%');
(dp || []).forEach(p => console.log(`"${p.product_name}" | cat: "${p.category}"`));

console.log('\n=== ORDER_ITEMS com "alho" ===');
const { data: oi } = await sb.from('order_items').select('product_name, category').ilike('product_name', '%alho%');
(oi || []).forEach(p => console.log(`"${p.product_name}" | cat: "${p.category}"`));
