import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Carregar .env do Modulo V2 (onde quer que esteja)
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("Variáveis de ambiente não encontradas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .in('status', ['COMPLETED', 'DELIVERED', 'Entregue'])
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Erro:", error);
  } else {
    console.log("Últimas entregas concluídas:");
    data.forEach(o => {
      console.log(`- ID: ${o.id}, Status: ${o.status}, Region: ${o.region}, Point: ${o.point_name || o.pointName}, Driver: ${o.driver_name || o.driverName}, Time: ${o.delivered_at || o.created_at}`);
    });
  }
}

main();
