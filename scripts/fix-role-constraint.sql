-- ============================================================
-- FIX: Adicionar role 'franqueado' na constraint app_users
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- Remove a constraint atual e recria incluindo 'franqueado'
ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_role_check;

ALTER TABLE app_users ADD CONSTRAINT app_users_role_check
  CHECK (role IN (
    'admin', 'coordinator', 'analyst',  -- papéis V2
    'driver',                           -- motorista V1
    'franchisee',                       -- franqueado V3 (inglês — legado)
    'franqueado',                       -- franqueado V3 (português — usado pelo portal)
    'usuario', 'motorista'              -- legados V1/V2
  ));

-- Verificação
SELECT conname, pg_get_constraintdef(oid) AS constraint_def
FROM pg_constraint
WHERE conname = 'app_users_role_check';
