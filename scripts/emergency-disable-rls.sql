-- ============================================================
-- EMERGÊNCIA - DESATIVAR RLS PARA RESTAURAR ACESSO
-- Execute IMEDIATAMENTE no Supabase Studio
-- ============================================================

-- Desativa temporariamente RLS em todas as tabelas
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

-- Verifica se RLS foi desativado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'orders', 'app_users', 'franchisees', 'products', 
  'vehicles', 'delivery_products', 'vehicle_checklists',
  'fuel_registrations', 'schedules', 'transfers', 'order_items'
)
ORDER BY tablename;
