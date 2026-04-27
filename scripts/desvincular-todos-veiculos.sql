-- ============================================================
-- DESVINCULAR TODOS OS MOTORISTAS DE TODOS OS VEÍCULOS
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Limpar assigned_driver_id e driver_name de TODOS os veículos
UPDATE public.vehicles 
SET assigned_driver_id = NULL, 
    driver_name = NULL,
    status = 'available';

-- 2. Limpar campo vehicle de TODOS os motoristas (app_users)
UPDATE public.app_users 
SET vehicle = NULL 
WHERE role = 'motorista';

-- 3. Verificar resultado
SELECT 'Veículos desvinculados' as acao, COUNT(*) as total 
FROM public.vehicles 
WHERE assigned_driver_id IS NULL;
