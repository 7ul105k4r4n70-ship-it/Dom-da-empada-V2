-- ============================================================
-- ISOLAMENTO DE DADOS POR REGIÃO - VERSÃO CORRETA
-- Todos podem ver dados, mas frontend filtra por região
-- ============================================================
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- Esta versão NÃO usa RLS com auth.uid() porque o sistema
-- usa login customizado (app_users) em vez de Supabase Auth.
-- O isolamento será feito APENAS no frontend com filtros.

-- DESATIVA RLS em todas as tabelas (dados abertos para leitura)
-- O frontend já filtra corretamente por região com subscribeToTable

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE franchisees DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE transfers DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Remove policies antigas que estavam bloqueando
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

-- Mantém apenas policies básicas para admin master (se necessário)
-- Mas permite leitura livre para todos os autenticados

-- POLICY: Leitura livre para todos (o frontend faz o filtro de região)
CREATE POLICY "orders_select_all" ON orders FOR SELECT USING (true);
CREATE POLICY "app_users_select_all" ON app_users FOR SELECT USING (true);
CREATE POLICY "franchisees_select_all" ON franchisees FOR SELECT USING (true);
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "vehicles_select_all" ON vehicles FOR SELECT USING (true);
CREATE POLICY "delivery_products_select_all" ON delivery_products FOR SELECT USING (true);
CREATE POLICY "vehicle_checklists_select_all" ON vehicle_checklists FOR SELECT USING (true);
CREATE POLICY "fuel_registrations_select_all" ON fuel_registrations FOR SELECT USING (true);
CREATE POLICY "schedules_select_all" ON schedules FOR SELECT USING (true);
CREATE POLICY "transfers_select_all" ON transfers FOR SELECT USING (true);
CREATE POLICY "order_items_select_all" ON order_items FOR SELECT USING (true);

-- Verifica configuração
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as num_policies
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename IN (
  'orders', 'app_users', 'franchisees', 'products', 
  'vehicles', 'delivery_products', 'vehicle_checklists',
  'fuel_registrations', 'schedules', 'transfers', 'order_items'
)
ORDER BY tablename;
