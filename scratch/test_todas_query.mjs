import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testQuery() {
  console.log('Testing "Todas" region query...');
  let query = supabase.from('orders').select('*');
  // No region filter for "Todas"
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Count:', data.length);
    console.log('First order region:', data[0]?.region);
  }
}

testQuery();
