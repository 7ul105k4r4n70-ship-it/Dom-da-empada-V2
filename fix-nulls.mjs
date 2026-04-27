import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: details, error: err1 } = await supabase
    .from('delivery_point_details')
    .select('order_id, updated_at, created_at');

  if (details) {
    for (const d of details) {
      // Find orders with null delivered_at but COMPLETED status
      const { data: order } = await supabase
        .from('orders')
        .select('id, status, delivered_at')
        .eq('id', d.order_id)
        .eq('status', 'COMPLETED')
        .is('delivered_at', null)
        .single();
        
      if (order) {
        console.log(`Fixing Order ${order.id} with delivered_at = ${d.updated_at || d.created_at}`);
        await supabase
          .from('orders')
          .update({ delivered_at: d.updated_at || d.created_at })
          .eq('id', order.id);
      }
    }
    console.log('Cleanup completed');
  }
}

main();
