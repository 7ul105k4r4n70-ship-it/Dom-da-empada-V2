-- ============================================================
-- CORREÇÃO SEGURA DO ERRO "role '' does not exist"
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- FUNÇÃO PARA DESATIVAR RLS SE A TABELA EXISTIR
CREATE OR REPLACE FUNCTION disable_rls_if_exists(table_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = table_name
    ) THEN
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
        RAISE NOTICE 'RLS desativado em: %', table_name;
    ELSE
        RAISE NOTICE 'Tabela não existe: %', table_name;
    END IF;
END;
$$;

-- 1. DESATIVAR RLS EM TODAS AS TABELAS QUE EXISTEM
SELECT disable_rls_if_exists('orders');
SELECT disable_rls_if_exists('app_users');
SELECT disable_rls_if_exists('franchisees');
SELECT disable_rls_if_exists('products');
SELECT disable_rls_if_exists('vehicles');
SELECT disable_rls_if_exists('delivery_products');
SELECT disable_rls_if_exists('vehicle_checklists');
SELECT disable_rls_if_exists('fuel_registrations');
SELECT disable_rls_if_exists('schedules');
SELECT disable_rls_if_exists('transfers');
SELECT disable_rls_if_exists('order_items');
SELECT disable_rls_if_exists('routes');
SELECT disable_rls_if_exists('route_points');

-- 2. REMOVER TODAS AS POLICIES (USANDO LOOP SEGURO)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                pol.policyname, pol.schemaname, pol.tablename);
            RAISE NOTICE 'Policy removida: %', pol.policyname;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Erro ao remover policy %: %', pol.policyname, SQLERRM;
        END;
    END LOOP;
END $$;

-- 3. GARANTIR PERMISSÕES BÁSICAS
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 4. GRANT SELECT EM TODAS AS TABELAS EXISTENTES
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('GRANT SELECT ON %I TO anon', tbl.tablename);
            EXECUTE format('GRANT SELECT ON %I TO authenticated', tbl.tablename);
            RAISE NOTICE 'SELECT concedido em: %', tbl.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Erro em %: %', tbl.tablename, SQLERRM;
        END;
    END LOOP;
END $$;

-- 5. GRANT INSERT/UPDATE EM TABELAS ESPECÍFICAS DO V1 (SE EXISTIREM)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vehicles') THEN
        GRANT INSERT, UPDATE ON vehicles TO anon;
        GRANT INSERT, UPDATE ON vehicles TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vehicle_checklists') THEN
        GRANT INSERT ON vehicle_checklists TO anon;
        GRANT INSERT ON vehicle_checklists TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fuel_registrations') THEN
        GRANT INSERT ON fuel_registrations TO anon;
        GRANT INSERT ON fuel_registrations TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'routes') THEN
        GRANT INSERT, UPDATE ON routes TO anon;
        GRANT INSERT, UPDATE ON routes TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'route_points') THEN
        GRANT INSERT, UPDATE ON route_points TO anon;
        GRANT INSERT, UPDATE ON route_points TO authenticated;
    END IF;
END $$;

-- 6. VERIFICAR STATUS FINAL
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '⚠️ RLS ATIVO' ELSE '✅ RLS OK' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
