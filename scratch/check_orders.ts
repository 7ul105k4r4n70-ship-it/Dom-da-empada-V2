
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrders() {
  console.log('Checking orders table...');
  const { data, error, count } = await supabase
    .from('orders')
    .select('id, region, status, point_name, created_at', { count: 'exact' });

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }

  console.log('Total orders:', count);
  
  const byRegion = {};
  const byStatus = {};
  const missingRegion = [];

  data.forEach(o => {
    byRegion[o.region] = (byRegion[o.region] || 0) + 1;
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    if (!o.region) {
      missingRegion.push(o);
    }
  });

  console.log('Orders by region:', byRegion);
  console.log('Orders by status:', byStatus);
  console.log('Orders missing region:', missingRegion.length);
  if (missingRegion.length > 0) {
    console.log('Sample missing region:', missingRegion.slice(0, 5));
  }
}

checkOrders();
