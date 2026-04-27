import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: details, error: detailsErr } = await supabase
    .from('delivery_point_details')
    .select('order_id')
    .order('updated_at', { ascending: false })
    .limit(10);

  if (details) {
    for (const d of details) {
      const { data: order } = await supabase
        .from('orders')
        .select('id, status, delivered_at, created_at')
        .eq('id', d.order_id)
        .single();
      console.log(`Detail Order ID: ${d.order_id} -> Order Status: ${order?.status}, delivered_at: ${order?.delivered_at}, created_at: ${order?.created_at}`);
    }
  }
}

main();
