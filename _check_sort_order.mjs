import { createClient } from '@supabase/supabase-js';
const sb = createClient('http://72.60.61.216:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg');

// Verificar sort_order dos produtos
const { data, error } = await sb.from('products').select('name, category, region, sort_order').order('sort_order', { ascending: true });
if (error) { console.log('ERRO:', error.message); process.exit(1); }

console.log('=== PRODUTOS ORDENADOS POR sort_order ===');
(data || []).forEach(p => {
  console.log(`sort_order=${p.sort_order ?? 'NULL'} | "${p.name}" | cat:"${p.category}" | reg:${p.region}`);
});

// Verificar produtos com sort_order NULL
const nullSort = (data || []).filter(p => p.sort_order === null);
console.log(`\n=== PRODUTOS COM sort_order NULL: ${nullSort.length} ===`);
nullSort.forEach(p => console.log(`  "${p.name}" | cat:"${p.category}" | reg:${p.region}`));
