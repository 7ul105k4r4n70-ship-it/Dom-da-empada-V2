import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDetails() {
  const { data, error } = await supabase
    .from('delivery_point_details')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error(error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns in delivery_point_details:', Object.keys(data[0]));
  } else {
    console.log('No records found in delivery_point_details.');
  }
}

checkDetails();
