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
    .from('delivery_point_details')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro:", error);
  } else {
    console.log("Últimos delivery_point_details:");
    data.forEach(o => {
      console.log(`- Order ID: ${o.order_id}, Time: ${o.updated_at}, Photo: ${o.delivery_photo_url}`);
    });
  }
}

main();
