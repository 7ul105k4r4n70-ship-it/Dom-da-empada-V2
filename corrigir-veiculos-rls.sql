-- SOLUÇÃO: Os dados já existem no banco (3 veículos), mas estão sendo bloqueados pelo RLS (Row Level Security).
-- As tabelas orders e fuel_registrations têm RLS desativado, o que permite a leitura normal.
-- As tabelas vehicles e vehicle_checklists estão com RLS ativado, mas sem políticas permissivas.

-- Opção 1: Criar políticas permissivas de leitura (Recomendado se quiser manter RLS ativado para edições)
DROP POLICY IF EXISTS "Allow anon read vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow authenticated read vehicles" ON public.vehicles;

CREATE POLICY "Allow anon read vehicles" ON public.vehicles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read vehicles" ON public.vehicles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon read vehicle_checklists" ON public.vehicle_checklists;
DROP POLICY IF EXISTS "Allow authenticated read vehicle_checklists" ON public.vehicle_checklists;

CREATE POLICY "Allow anon read vehicle_checklists" ON public.vehicle_checklists FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read vehicle_checklists" ON public.vehicle_checklists FOR SELECT TO authenticated USING (true);

-- =========================================================================================

-- Opção 2: Desativar o RLS completamente nessas tabelas (Para ficar igual à tabela de orders)
-- Descomente as linhas abaixo se preferir essa abordagem:
-- ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.vehicle_checklists DISABLE ROW LEVEL SECURITY;
