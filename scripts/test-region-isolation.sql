-- ============================================================
-- SCRIPT DE TESTE - Isolamento de Dados por Região
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- Este script verifica se o isolamento de regiões está funcionando corretamente

-- 1. Verificar se todas as tabelas têm coluna region
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'region'
  AND table_name IN (
    'orders', 'app_users', 'franchisees', 'products', 
    'vehicles', 'delivery_products', 'vehicle_checklists',
    'fuel_registrations', 'schedules', 'transfers'
  )
ORDER BY table_name;

-- 2. Verificar distribuição de dados por região
-- Orders
SELECT 'orders' as tabela, region, COUNT(*) as total
FROM orders
GROUP BY region
UNION ALL
-- Franchisees
SELECT 'franchisees' as tabela, region, COUNT(*) as total
FROM franchisees
GROUP BY region
UNION ALL
-- Products
SELECT 'products' as tabela, region, COUNT(*) as total
FROM products
GROUP BY region
UNION ALL
-- Vehicles
SELECT 'vehicles' as tabela, region, COUNT(*) as total
FROM vehicles
GROUP BY region
ORDER BY tabela, region;

-- 3. Verificar se existem orders sem região definida
SELECT 'Orders sem região' as verificacao, COUNT(*) as total
FROM orders
WHERE region IS NULL OR region = '';

-- 4. Verificar se existem products sem região definida
SELECT 'Products sem região' as verificacao, COUNT(*) as total
FROM products
WHERE region IS NULL OR region = '';

-- 5. Verificar se existem franchisees sem região definida
SELECT 'Franchisees sem região' as verificacao, COUNT(*) as total
FROM franchisees
WHERE region IS NULL OR region = '';

-- 6. Verificar se existem vehicles sem região definida
SELECT 'Vehicles sem região' as verificacao, COUNT(*) as total
FROM vehicles
WHERE region IS NULL OR region = '';

-- 7. Contar usuários por região
SELECT 
  region,
  role,
  COUNT(*) as total_usuarios
FROM app_users
GROUP BY region, role
ORDER BY region, role;

-- 8. Verificar transfers entre regiões
SELECT 
  origin_region,
  destination_region,
  COUNT(*) as total_transfers
FROM transfers
GROUP BY origin_region, destination_region
ORDER BY origin_region, destination_region;

-- 9. Verificar se policies de isolamento estão ativas
SELECT 
  tablename,
  policyname,
  cmd,
  qual IS NOT NULL as tem_restricao
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE '%isolation'
ORDER BY tablename, policyname;

-- 10. Teste prático: Simular query de usuário de Recife
-- (Este teste mostra o que um usuário de Recife veria)
-- Nota: Este teste requer que você esteja logado como um usuário específico

-- Para testar manualmente:
-- 1. Faça login como usuário de Recife
-- 2. Execute: SELECT COUNT(*) FROM orders;
-- 3. Deveria retornar apenas orders de Recife
-- 4. Faça login como usuário de Salvador
-- 5. Execute: SELECT COUNT(*) FROM orders;
-- 6. Deveria retornar apenas orders de Salvador
-- 7. Faça login como admin
-- 8. Execute: SELECT COUNT(*) FROM orders;
-- 9. Deveria retornar TODAS as orders

-- ============================================================
-- RESULTADOS ESPERADOS
-- ============================================================
-- ✅ Todas as tabelas principais devem ter coluna 'region'
-- ✅ Deve haver dados em ambas as regiões (Recife e Salvador)
-- ✅ NÃO deve haver registros com region NULL ou vazio
-- ✅ Policies de isolamento devem estar ativas
-- ✅ Usuários de Recife NÃO devem ver dados de Salvador
-- ✅ Usuários de Salvador NÃO devem ver dados de Recife
-- ✅ Admin deve ver dados de ambas as regiões

-- ============================================================
-- VALIDAÇÃO FINAL
-- ============================================================
SELECT 
  '✅ Isolamento configurado corretamente' as status
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE region IS NULL OR region = ''
)
AND NOT EXISTS (
  SELECT 1 FROM products WHERE region IS NULL OR region = ''
)
AND EXISTS (
  SELECT 1 FROM pg_policies WHERE policyname LIKE '%isolation'
);
