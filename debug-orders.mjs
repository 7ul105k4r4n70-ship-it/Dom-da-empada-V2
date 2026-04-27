import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
  console.log('Checking orders table...');
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_code, status, region, driver_name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total orders found: ${orders.length}`);
  const statusCounts = {};
  orders.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  console.log('Status counts:', statusCounts);

  const regionCounts = {};
  orders.forEach(o => {
    regionCounts[o.region] = (regionCounts[o.region] || 0) + 1;
  });
  console.log('Region counts:', regionCounts);

  console.log('Latest 5 orders:');
  console.log(JSON.stringify(orders.slice(0, 5), null, 2));
}

debug();
