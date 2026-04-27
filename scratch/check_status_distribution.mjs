import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkData() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, region, point_name')
    .limit(50);
  
  if (error) {
    console.error(error);
    return;
  }
  
  const statusCounts = data.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Status counts:', statusCounts);
  console.log('Sample orders:', data.slice(0, 5));
}

checkData();
