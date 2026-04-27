-- ============================================================
-- CORREÇÃO: Erro ao excluir usuário - foreign key constraint
-- Altera FKs para permitir exclusão de usuários (ON DELETE SET NULL)
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Remover FK antiga e recriar com ON DELETE SET NULL em vehicle_checklists
ALTER TABLE public.vehicle_checklists 
DROP CONSTRAINT IF EXISTS vehicle_checklists_driver_id_fkey;

ALTER TABLE public.vehicle_checklists 
ADD CONSTRAINT vehicle_checklists_driver_id_fkey 
FOREIGN KEY (driver_id) REFERENCES public.app_users(id) ON DELETE SET NULL;

-- 2. Verificar outras tabelas que podem ter FK para app_users
-- orders (driver_name é text, não FK direta)
-- vehicles (assigned_driver_id pode ser FK)
ALTER TABLE public.vehicles 
DROP CONSTRAINT IF EXISTS vehicles_assigned_driver_id_fkey;

ALTER TABLE public.vehicles 
ADD CONSTRAINT vehicles_assigned_driver_id_fkey 
FOREIGN KEY (assigned_driver_id) REFERENCES public.app_users(id) ON DELETE SET NULL;

-- 3. Verificar se existe FK em outras tabelas (delivery_photos, etc.)
-- Se houver erro em outra tabela, adicione aqui

-- 4. Teste: verificar constraints atualizadas
SELECT 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'app_users';
