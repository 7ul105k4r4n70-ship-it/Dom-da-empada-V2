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
    .select('id, status, region, point_name, created_at')
    .in('id', [
      'a82c0ff1-7b79-450f-bc16-b18361ab761e',
      'b923e595-bbd4-4bb0-8025-b4618e80556e',
      '36de32bb-9c29-4591-9132-c67d7100b77a'
    ]);

  if (error) {
    console.error("Erro:", error);
  } else {
    console.log("Pedidos específicos:");
    data.forEach(o => {
      console.log(`- ID: ${o.id}, Status: '${o.status}', Region: '${o.region}', Time: ${o.created_at}`);
    });
  }
}

main();
