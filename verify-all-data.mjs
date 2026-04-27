import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://72.60.61.216:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function verifyAllData() {
  console.log('=== VERIFICACAO COMPLETA DE TODOS OS DADOS NO SUPABASE ===\n');

  // 1. TABELA ORDERS
  console.log('1️⃣ TABELA: orders');
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (ordersError) {
    console.log('   Erro:', ordersError.message);
  } else {
    console.log('   Total de orders (ultimas 10):', orders.length);
    orders.forEach(o => {
      console.log('   - Order ID:', o.id.substring(0, 8) + '...');
      console.log('     Franqueado:', o.point_name || o.pointName || 'N/A');
      console.log('     Motorista:', o.driver_name || o.driverName || 'N/A');
      console.log('     Status:', o.status);
      console.log('     Regiao:', o.region);
      console.log('     Foto:', o.delivery_photo || o.deliveryPhoto ? 'SIM' : 'NAO');
      console.log('     Data:', o.created_at || o.timestamp);
      console.log('');
    });
  }

  // 2. TABELA ORDER_ITEMS
  console.log('2️⃣ TABELA: order_items');
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (itemsError) {
    console.log('   Erro:', itemsError.message);
  } else {
    console.log('   Total de order_items (ultimos 20):', orderItems.length);
    const itemsByOrder = {};
    orderItems.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    });
    
    for (const orderId of Object.keys(itemsByOrder)) {
      const items = itemsByOrder[orderId];
      console.log('   Order:', orderId.substring(0, 8) + '...');
      items.forEach(item => {
        console.log('     - Produto:', item.product_name);
        console.log('       Qtd:', item.quantity, '| Preco:', item.cost_price || 'N/A');
      });
      console.log('');
    }
  }

  // 3. TABELA PRODUCTS (Precos e Royalties)
  console.log('3️⃣ TABELA: products');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');

  if (productsError) {
    console.log('   Erro:', productsError.message);
  } else {
    const byRegion = {};
    products.forEach(p => {
      if (!byRegion[p.region]) byRegion[p.region] = [];
      byRegion[p.region].push(p);
    });
    
    console.log('   Total de produtos:', products.length);
    for (const region of Object.keys(byRegion)) {
      const items = byRegion[region];
      console.log('   Regiao:', region, '(' + items.length + ' produtos)');
      const byCategory = {};
      items.forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push(p);
      });
      for (const cat of Object.keys(byCategory)) {
        console.log('     ' + cat + ': ' + byCategory[cat].length + ' itens');
      }
    }
    console.log('');
  }

  // 4. TABELA DELIVERY_PRODUCTS
  console.log('4️⃣ TABELA: delivery_products');
  const { data: deliveryProducts, error: deliveryError } = await supabase
    .from('delivery_products')
    .select('*')
    .order('delivered_at', { ascending: false })
    .limit(10);

  if (deliveryError) {
    console.log('   Erro:', deliveryError.message);
  } else {
    console.log('   Total de delivery_products (ultimos 10):', deliveryProducts.length);
    deliveryProducts.forEach(dp => {
      console.log('   - Produto:', dp.product_name);
      console.log('     Categoria:', dp.category);
      console.log('     Qtd:', dp.quantity);
      console.log('     Order:', dp.order_id.substring(0, 8) + '...');
      console.log('     Regiao:', dp.region);
      console.log('     Data:', dp.delivered_at);
      console.log('');
    });
  }

  // 5. VERIFICAR FOTOS NAS ORDERS
  console.log('5️⃣ VERIFICACAO DE FOTOS');
  const { data: ordersWithPhotos, error: photoError } = await supabase
    .from('orders')
    .select('id, delivery_photo, deliveryPhoto, driver_photo, driverPhoto, point_name, pointName')
    .not('delivery_photo', 'is', null)
    .limit(5);

  if (photoError) {
    console.log('   Erro ao buscar fotos:', photoError.message);
  } else {
    console.log('   Orders com foto de entrega:', (ordersWithPhotos || []).length);
    (ordersWithPhotos || []).forEach(o => {
      const foto = o.delivery_photo || o.deliveryPhoto || o.driver_photo || o.driverPhoto;
      console.log('   - Order:', o.id.substring(0, 8) + '...');
      console.log('     Franqueado:', o.point_name || o.pointName || 'N/A');
      console.log('     Foto URL:', foto ? foto.substring(0, 50) + '...' : 'NAO');
      console.log('');
    });
  }

  // 6. TABELA USERS/USUARIOS
  console.log('6️⃣ TABELA: users (auth.users via RPC)');
  try {
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(10);

    if (usersError) {
      console.log('   user_profiles nao existe ou erro:', usersError.message);
    } else {
      console.log('   Total de user_profiles:', users.length);
      users.forEach(u => {
        console.log('   - Nome:', u.name || u.email || 'N/A');
        console.log('     Email:', u.email || 'N/A');
        console.log('     Role:', u.role || u.user_role || 'N/A');
        console.log('');
      });
    }
  } catch (e) {
    console.log('   Tabela user_profiles nao acessivel');
  }

  // 7. TABELA POINTS/PONTOS
  console.log('7️⃣ TABELA: points');
  const { data: points, error: pointsError } = await supabase
    .from('points')
    .select('*')
    .limit(10);

  if (pointsError) {
    console.log('   Erro:', pointsError.message);
  } else {
    console.log('   Total de points (primeiros 10):', points.length);
    points.forEach(p => {
      console.log('   - Ponto:', p.name || p.point_name || 'N/A');
      console.log('     Franqueado:', p.franchisee_name || p.franchised_name || p.owner || 'N/A');
      console.log('     Regiao:', p.region || 'N/A');
      console.log('     Endereço:', p.address || 'N/A');
      console.log('');
    });
  }

  // 8. TABELA FRANCHISEES/FRANQUEADOS
  console.log('8️⃣ TABELA: franchisees');
  const { data: franchisees, error: franchiseesError } = await supabase
    .from('franchisees')
    .select('*')
    .limit(10);

  if (franchiseesError) {
    console.log('   Erro:', franchiseesError.message);
  } else {
    console.log('   Total de franchisees (primeiros 10):', franchisees.length);
    franchisees.forEach(f => {
      console.log('   - Franqueado:', f.name || f.franchisee_name || 'N/A');
      console.log('     Email:', f.email || 'N/A');
      console.log('     Regiao:', f.region || 'N/A');
      console.log('     Telefone:', f.phone || f.telephone || 'N/A');
      console.log('');
    });
  }

  // 9. RESUMO FINAL
  console.log('=== RESUMO FINAL ===');
  
  const tables = ['orders', 'order_items', 'products', 'delivery_products', 'points', 'franchisees', 'user_profiles'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true });
      
      if (error) {
        console.log('   ' + table + ': ERRO - ' + error.message);
      } else {
        console.log('   ' + table + ': ' + data + ' registros');
      }
    } catch (e) {
      console.log('   ' + table + ': Tabela nao existe ou nao acessivel');
    }
  }

  console.log('\n=== FIM DA VERIFICACAO ===');
}

verifyAllData();
