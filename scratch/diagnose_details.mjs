import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function diagnoseDetails() {
  console.log('\n=== delivery_point_details COMPLETO ===\n');

  const { data, error } = await supabase
    .from('delivery_point_details')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Erro:', error); return; }

  data.forEach((d, i) => {
    console.log(`[${i+1}] order_id: ${d.order_id}`);
    console.log(`     delivery_photo_url: ${d.delivery_photo_url || '(vazio)'}`);
    console.log(`     region: ${d.region}`);
    console.log('');
  });

  // Verificar se os order_ids das details existem na tabela orders
  console.log('--- Cruzando order_ids com tabela orders ---');
  const { data: orders } = await supabase.from('orders').select('id, status, point_name');
  const orderMap = Object.fromEntries((orders || []).map(o => [o.id, o]));
  
  data.forEach(d => {
    const order = orderMap[d.order_id];
    if (order) {
      console.log(`✅ order_id ${d.order_id} → status: ${order.status}, ponto: ${order.point_name}`);
    } else {
      console.log(`❌ order_id ${d.order_id} → NÃO ENCONTRADO na tabela orders!`);
    }
  });
}

diagnoseDetails().catch(console.error);
