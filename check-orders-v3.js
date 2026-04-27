efetue o deployimport { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://72.60.61.216:8000';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOrders() {
  console.log('🔍 Verificando pedidos no banco...\n');

  // Buscar todos os pedidos
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, short_id, point_name, region, status, units, created_at, order_code')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    return;
  }

  console.log(`📦 Total de pedidos encontrados: ${orders?.length || 0}\n`);

  if (orders && orders.length > 0) {
    console.log('📋 Últimos 20 pedidos:');
    console.log('─'.repeat(80));
    orders.forEach((order, index) => {
      console.log(`${index + 1}. [${order.region}] ${order.point_name} | ID: ${order.short_id || order.id} | Status: ${order.status} | Unidades: ${order.units} | Criado em: ${new Date(order.created_at).toLocaleString('pt-BR')}`);
    });
    console.log('─'.repeat(80));

    // Contar por região
    const recife = orders.filter(o => o.region === 'Recife').length;
    const salvador = orders.filter(o => o.region === 'Salvador').length;
    const outras = orders.filter(o => !o.region || (o.region !== 'Recife' && o.region !== 'Salvador')).length;

    console.log(`\n📊 Distribuição por região:`);
    console.log(`   Recife: ${recife}`);
    console.log(`   Salvador: ${salvador}`);
    if (outras > 0) console.log(`   Sem região/outras: ${outras}`);
  } else {
    console.log('⚠️  NENHUM PEDIDO ENCONTRADO!');
  }

  // Verificar estrutura de um pedido
  if (orders && orders.length > 0) {
    console.log('\n🔍 Estrutura do pedido mais recente:');
    console.log(JSON.stringify(orders[0], null, 2));
  }
}

checkOrders().catch(console.error);
