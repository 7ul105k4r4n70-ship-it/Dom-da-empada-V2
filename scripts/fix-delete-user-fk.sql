-- ============================================================
-- CORREÇÃO: Usuários não podem ser excluídos por FK constraint
-- vehicle_checklists.driver_id referencia app_users.id
-- mas não permite ON DELETE, impedindo a exclusão
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Remover FK antiga (que impede delete)
ALTER TABLE public.vehicle_checklists 
DROP CONSTRAINT IF EXISTS vehicle_checklists_driver_id_fkey;

-- 2. Recriar FK com ON DELETE SET NULL
-- Isso permite excluir o motorista sem perder o histórico de checklists
-- (o driver_id fica NULL, preservando os registros)
ALTER TABLE public.vehicle_checklists 
ADD CONSTRAINT vehicle_checklists_driver_id_fkey 
FOREIGN KEY (driver_id) REFERENCES public.app_users(id) ON DELETE SET NULL;

-- 3. Verificar se há outras tabelas com FK para app_users sem ON DELETE
-- (apenas diagnóstico — não altera nada)
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'app_users'
AND rc.delete_rule = 'NO ACTION';
