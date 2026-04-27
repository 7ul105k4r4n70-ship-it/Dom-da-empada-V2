-- ============================================================
-- CORREÇÃO SIMPLIFICADA DO ERRO "role '' does not exist"
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. DESATIVAR RLS EM TODAS AS TABELAS
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS franchisees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS delivery_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vehicle_checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fuel_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transfers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS route_points DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER POLICIES ESPECÍFICAS (se existirem)
DROP POLICY IF EXISTS "orders_select_all" ON orders;
DROP POLICY IF EXISTS "app_users_select_all" ON app_users;
DROP POLICY IF EXISTS "franchisees_select_all" ON franchisees;
DROP POLICY IF EXISTS "products_select_all" ON products;
DROP POLICY IF EXISTS "vehicles_select_all" ON vehicles;
DROP POLICY IF EXISTS "delivery_products_select_all" ON delivery_products;
DROP POLICY IF EXISTS "vehicle_checklists_select_all" ON vehicle_checklists;
DROP POLICY IF EXISTS "fuel_registrations_select_all" ON fuel_registrations;
DROP POLICY IF EXISTS "schedules_select_all" ON schedules;
DROP POLICY IF EXISTS "transfers_select_all" ON transfers;
DROP POLICY IF EXISTS "order_items_select_all" ON order_items;
DROP POLICY IF EXISTS "routes_select_all" ON routes;
DROP POLICY IF EXISTS "route_points_select_all" ON route_points;

-- 3. REMOVER OUTRAS POLICIES COMUNS QUE POSSAM EXISTIR
DROP POLICY IF EXISTS "orders_isolation" ON orders;
DROP POLICY IF EXISTS "app_users_read" ON app_users;
DROP POLICY IF EXISTS "app_users_write" ON app_users;
DROP POLICY IF EXISTS "franchisees_isolation" ON franchisees;
DROP POLICY IF EXISTS "products_isolation" ON products;
DROP POLICY IF EXISTS "vehicles_isolation" ON vehicles;
DROP POLICY IF EXISTS "delivery_products_isolation" ON delivery_products;
DROP POLICY IF EXISTS "vehicle_checklists_isolation" ON vehicle_checklists;
DROP POLICY IF EXISTS "fuel_registrations_isolation" ON fuel_registrations;
DROP POLICY IF EXISTS "schedules_isolation" ON schedules;
DROP POLICY IF EXISTS "transfers_isolation" ON transfers;
DROP POLICY IF EXISTS "order_items_isolation" ON order_items;

-- 4. GARANTIR PERMISSÕES PARA ROLES ANON E AUTHENTICATED
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- 5. PERMISSÕES ESPECÍFICAS PARA VEÍCULOS (V1 precisa)
GRANT INSERT, UPDATE ON vehicles TO anon;
GRANT INSERT, UPDATE ON vehicles TO authenticated;

-- 6. PERMISSÕES PARA CHECKLISTS E COMBUSTÍVEL
GRANT INSERT ON vehicle_checklists TO anon;
GRANT INSERT ON vehicle_checklists TO authenticated;
GRANT INSERT ON fuel_registrations TO anon;
GRANT INSERT ON fuel_registrations TO authenticated;

-- 7. PERMISSÕES PARA ROTAS (V1)
GRANT INSERT, UPDATE ON routes TO anon;
GRANT INSERT, UPDATE ON routes TO authenticated;
GRANT INSERT, UPDATE ON route_points TO anon;
GRANT INSERT, UPDATE ON route_points TO authenticated;

-- 8. VERIFICAR STATUS FINAL
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ATIVO - PROBLEMA!' ELSE 'RLS OK' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('vehicles', 'app_users', 'orders', 'routes', 'route_points')
ORDER BY tablename;
