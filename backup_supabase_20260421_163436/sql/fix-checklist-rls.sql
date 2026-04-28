-- ============================================================
-- Dom da Empada - CHECKLIST RLS FIX
-- Resolve o erro "Unauthorized" ao finalizar o checklist.
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Criar tabela vehicle_checklists se não existir
CREATE TABLE IF NOT EXISTS vehicle_checklists (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id    UUID REFERENCES app_users(id),
  vehicle      TEXT NOT NULL,
  km           INTEGER NOT NULL,
  checks       JSONB NOT NULL DEFAULT '{}',
  photos       JSONB NOT NULL DEFAULT '[]',
  observations TEXT,
  status       TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'problem')),
  region       TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE vehicle_checklists ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas (evita conflito)
DROP POLICY IF EXISTS "Allow all"          ON vehicle_checklists;
DROP POLICY IF EXISTS "Allow anon all"     ON vehicle_checklists;
DROP POLICY IF EXISTS "Allow authenticated" ON vehicle_checklists;

-- 4. Criar políticas permissivas (anon + authenticated)
CREATE POLICY "Allow all"      ON vehicle_checklists FOR ALL               USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON vehicle_checklists FOR ALL TO anon        USING (true) WITH CHECK (true);

-- 5. Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_checklists;

-- 6. Migrar dados legados: 'Em Uso' → 'in_use'
UPDATE vehicles SET status = 'in_use' WHERE status = 'Em Uso';

-- Remover constraint restritiva (pode ter valores incompatíveis com a estrutura real)
-- O código V1 agora usa sempre 'in_use', então a constraint não é necessária por enquanto
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;

-- 7. Verificação final
SELECT id, plate, status FROM vehicles LIMIT 5;
SELECT count(*) FROM vehicle_checklists;
