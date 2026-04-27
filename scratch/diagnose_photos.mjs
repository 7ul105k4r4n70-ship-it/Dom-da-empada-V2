import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function diagnosePhotos() {
  console.log('\n=== DIAGNÓSTICO DE FOTOS ===\n');

  // 1. Orders com fotos nos campos diretos
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status, deliveryPhoto, driverPhoto, photo_url, driver_name')
    .order('created_at', { ascending: false });

  if (error) { console.error('Erro:', error); return; }

  console.log('Orders com deliveryPhoto preenchido:');
  orders.filter(o => o.deliveryPhoto).forEach(o => console.log(' -', o.id, '|', o.status, '|', o.deliveryPhoto?.substring(0, 80)));

  console.log('\nOrders com driverPhoto preenchido:');
  orders.filter(o => o.driverPhoto).forEach(o => console.log(' -', o.id, '|', o.status, '|', o.driverPhoto?.substring(0, 80)));

  console.log('\nOrders com photo_url preenchido:');
  orders.filter(o => o.photo_url).forEach(o => console.log(' -', o.id, '|', o.status, '|', o.photo_url?.substring(0, 80)));

  console.log('\nOrders com driver_name preenchido:');
  orders.filter(o => o.driver_name).forEach(o => console.log(' -', o.id, '|', o.status, '|', o.driver_name));

  // 2. Tabela delivery_point_details
  console.log('\n--- Tabela delivery_point_details ---');
  const { data: details, error: e2 } = await supabase
    .from('delivery_point_details')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (e2) {
    console.log('Erro ou tabela não existe:', e2.message, e2.code);
  } else {
    console.log('Total de registros:', details?.length ?? 0);
    if (details && details.length > 0) {
      console.log('Colunas:', Object.keys(details[0]));
      details.forEach(d => console.log(' -', JSON.stringify(d).substring(0, 200)));
    }
  }

  console.log('\n=== FIM ===\n');
}

diagnosePhotos().catch(console.error);
