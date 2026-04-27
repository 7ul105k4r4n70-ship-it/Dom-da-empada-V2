import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkColumns() {
  // We can't easily list columns via JS client without a specific RPC or looking at a record
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error(error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns in orders table:', Object.keys(data[0]));
  } else {
    console.log('No records found in orders table.');
  }
}

checkColumns();
