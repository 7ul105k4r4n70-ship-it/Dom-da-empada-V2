
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('Checking Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  const { data, error } = await supabase.from('app_users').select('*').limit(5);
  
  if (error) {
    console.error('Connection error:', error);
  } else {
    console.log('Successfully connected! Found users:', data.length);
    console.log('Users:', data);
  }
}

checkConnection();
