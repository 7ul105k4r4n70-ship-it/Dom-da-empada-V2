import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function countAllRecords() {
  console.log('=== CONTAGEM DE TODOS OS REGISTROS NO SUPABASE ===\n');

  const tables = [
    'orders',
    'order_items', 
    'products',
    'delivery_products',
    'points',
    'franchisees'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        console.log(table + ': ERRO - ' + error.message);
      } else {
        console.log(table + ': ' + data.length + ' registros');
      }
    } catch (e) {
      console.log(table + ': Tabela nao existe ou nao acessivel');
    }
  }

  // Contagem detalhada por tabela
  console.log('\n=== DETALHAMENTO ===');

  // Orders
  const { data: orders } = await supabase.from('orders').select('*');
  console.log('\nORDERS (' + (orders || []).length + ' total):');
  if (orders && orders.length > 0) {
    orders.forEach(o => {
      console.log('  - ID: ' + o.id.substring(0, 8));
      console.log('    Status: ' + o.status);
      console.log('    Region: ' + o.region);
      console.log('    point_name: ' + (o.point_name || o.pointName || 'N/A'));
      console.log('    driverName: ' + (o.driverName || o.driver_name || 'N/A'));
      console.log('    delivery_photo: ' + (o.delivery_photo || o.deliveryPhoto || 'N/A'));
      console.log('    driver_photo: ' + (o.driver_photo || o.driverPhoto || 'N/A'));
      console.log('');
    });
  }

  // Delivery products por order
  const { data: deliveryProducts } = await supabase.from('delivery_products').select('*');
  console.log('\nDELIVERY_PRODUCTS (' + (deliveryProducts || []).length + ' total):');
  if (deliveryProducts && deliveryProducts.length > 0) {
    const byOrder = {};
    deliveryProducts.forEach(dp => {
      if (!byOrder[dp.order_id]) byOrder[dp.order_id] = [];
      byOrder[dp.order_id].push(dp);
    });
    for (const orderId of Object.keys(byOrder)) {
      console.log('  Order: ' + orderId.substring(0, 8));
      byOrder[orderId].forEach(dp => {
        console.log('    - ' + dp.product_name + ': ' + dp.quantity + ' cx (' + dp.category + ')');
      });
      console.log('');
    }
  }

  // Verificar campos das orders
  console.log('\nVERIFICACAO DE CAMPOS NAS ORDERS:');
  if (orders && orders.length > 0) {
    const order = orders[0];
    console.log('Campos disponiveis:', Object.keys(order).join(', '));
  }

  console.log('\n=== FIM ===');
}

countAllRecords();
