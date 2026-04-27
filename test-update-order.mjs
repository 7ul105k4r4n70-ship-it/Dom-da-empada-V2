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
    .update({
      status: 'COMPLETED',
      driver_name: 'Test Driver',
      driver_id: undefined,
      delivered_at: new Date().toISOString(),
      deliveryPhoto: 'http://test.com/photo.jpg',
    })
    .eq('id', '60631049-54e3-4f6b-a129-b26abd0a9e2d');

  if (error) {
    console.error("Update Error:", error);
  } else {
    console.log("Update Success:", data);
  }
}

main();
