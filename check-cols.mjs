import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .rpc('get_table_columns', { table_name: 'orders' }); // fallback
  
  if (error) {
    const { data: cols } = await supabase.from('orders').select('*').limit(1);
    console.log("Columns:", Object.keys(cols[0]));
  } else {
    console.log(data);
  }
}

main();
