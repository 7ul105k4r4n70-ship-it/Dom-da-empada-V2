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
    .from('orders')
    .select('*')
    .eq('region', 'Recife')
    .in('status', ['COMPLETED', 'DELIVERED', 'Entregue'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro:", error);
  } else {
    console.log(`Total COMPLETED orders in Recife: ${data.length}`);
    console.log("Top 5 orders:");
    data.slice(0, 5).forEach(o => console.log(o.id, o.status, o.created_at));
  }
}

main();
