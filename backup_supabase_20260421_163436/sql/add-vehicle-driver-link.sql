-- Adicionar campo para vincular motorista ao veículo
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS assigned_driver_id UUID REFERENCES public.app_users(id) ON DELETE SET NULL;

-- Adicionar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_driver ON public.vehicles(assigned_driver_id);
