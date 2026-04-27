-- ============================================================
-- DIAGNÓSTICO COMPLETO - VERIFICAR STATUS DO RLS
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Verificar se RLS está ativo ou desativado
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Ativo?",
  CASE 
    WHEN rowsecurity = true THEN '⚠️ ATIVO (pode bloquear dados)'
    ELSE '✅ DESATIVADO (dados liberados)'
  END as Status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'orders', 'app_users', 'franchisees', 'products', 
  'vehicles', 'delivery_products', 'vehicle_checklists',
  'fuel_registrations', 'schedules', 'transfers', 'order_items'
)
ORDER BY tablename;

-- 2. Verificar quais policies existem
SELECT 
  tablename,
  policyname,
  cmd as "Operação",
  qual as "Condição"
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'orders', 'app_users', 'franchisees', 'products', 
  'vehicles', 'delivery_products', 'vehicle_checklists',
  'fuel_registrations', 'schedules', 'transfers', 'order_items'
)
ORDER BY tablename, policyname;

-- 3. Testar consulta direta (simula o que o app faz)
SELECT COUNT(*) as "Total de Orders" FROM orders;
SELECT COUNT(*) as "Total de App Users" FROM app_users;
SELECT COUNT(*) as "Total de Franchisees" FROM franchisees;
SELECT COUNT(*) as "Total de Products" FROM products;
SELECT COUNT(*) as "Total de Vehicles" FROM vehicles;

-- 4. Verificar se há dados por região
SELECT 
  region,
  COUNT(*) as total
FROM orders
GROUP BY region
ORDER BY region;

-- 5. Verificar estrutura da tabela orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'orders'
AND column_name IN ('id', 'region', 'created_at')
ORDER BY ordinal_position;
