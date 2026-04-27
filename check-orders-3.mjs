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
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Erro:", error);
  } else {
    console.log("Últimos pedidos (qualquer status):");
    data.forEach(o => {
      console.log(`- ID: ${o.id}, Status: ${o.status}, Region: ${o.region}, Point: ${o.point_name || o.pointName}, Time: ${o.created_at}`);
    });
  }
}

main();
