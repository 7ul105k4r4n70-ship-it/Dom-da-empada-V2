import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function syncAllDrivers() {
  console.log('=== INICIANDO SINCRONIZACAO GLOBAL DE MOTORISTAS ===\n');

  const { data: drivers, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('role', 'motorista');

  if (error) {
    console.error('Erro ao buscar motoristas:', error);
    return;
  }

  for (const driver of drivers) {
    console.log(`Processando: ${driver.name} (${driver.email})...`);
    
    try {
      // Tentar atualizar ou criar no Auth usando RPC (ou direto via Admin se preferir)
      // Usaremos o RPC sync_driver_password que ja existe e e seguro
      const { data: res, error: rpcError } = await supabase.rpc('sync_driver_password', {
        p_email: driver.email,
        p_password: driver.password
      });

      if (rpcError) {
        console.error(`  ❌ Erro RPC para ${driver.name}:`, rpcError.message);
      } else {
        console.log(`  ✅ Sincronizado:`, res);
      }
    } catch (err) {
      console.error(`  ❌ Erro inesperado para ${driver.name}:`, err);
    }
  }

  console.log('\n=== SINCRONIZACAO CONCLUIDA ===');
}

syncAllDrivers();
