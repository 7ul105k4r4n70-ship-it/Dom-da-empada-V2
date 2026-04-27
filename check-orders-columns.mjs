import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://72.60.61.216:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in orders table:', Object.keys(data[0]));
  }
}

checkColumns();
