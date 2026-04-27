-- ============================================================
-- CORREÇÃO COMPLETA DO ERRO "role '' does not exist"
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. DESATIVAR RLS EM TODAS AS TABELAS (incluindo auth e storage)
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

-- 2. REMOVER TODAS AS POLICIES EXISTENTES
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- 3. REMOVER TRIGGERS QUE POSSAM ESTAR CAUSANDO O ERRO
DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT event_object_schema, event_object_table, trigger_name
        FROM information_schema.triggers
        WHERE event_object_schema = 'public'
        AND trigger_name LIKE '%vehicles%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I',
            trig.trigger_name, trig.event_object_schema, trig.event_object_table);
    END LOOP;
END $$;

-- 4. GARANTIR PERMISSÕES PARA O ROLE ANON (usado pelo V1)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT INSERT ON vehicles TO anon;
GRANT INSERT ON vehicles TO authenticated;
GRANT UPDATE ON vehicles TO anon;
GRANT UPDATE ON vehicles TO authenticated;

GRANT INSERT ON vehicle_checklists TO anon;
GRANT INSERT ON vehicle_checklists TO authenticated;

GRANT INSERT ON fuel_registrations TO anon;
GRANT INSERT ON fuel_registrations TO authenticated;

GRANT INSERT ON routes TO anon;
GRANT INSERT ON routes TO authenticated;
GRANT UPDATE ON routes TO anon;
GRANT UPDATE ON routes TO authenticated;

GRANT INSERT ON route_points TO anon;
GRANT INSERT ON route_points TO authenticated;
GRANT UPDATE ON route_points TO anon;
GRANT UPDATE ON route_points TO authenticated;

-- 5. CORRIGIR USUÁRIOS COM ROLE VAZIA NO AUTH
UPDATE auth.users 
SET role = 'authenticated' 
WHERE role IS NULL OR role = '';

-- 6. VERIFICAR STATUS FINAL
SELECT 
    'TABELAS' as check_type,
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ATIVO - PROBLEMA!' ELSE 'RLS OK' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('vehicles', 'app_users', 'orders', 'routes', 'route_points')
ORDER BY tablename;
