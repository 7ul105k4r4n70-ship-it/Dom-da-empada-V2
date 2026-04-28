-- ============================================================
-- FIX DEFINITIVO
-- ============================================================

-- 1. Coluna password (login direto sem Auth)
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Role constraint
ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_role_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_role_check
  CHECK (role = ANY (ARRAY['admin','usuario','motorista','franqueado']));

-- 3. RLS permissivo total em app_users
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all app_users" ON app_users;
DROP POLICY IF EXISTS "Allow all for authenticated" ON app_users;
DROP POLICY IF EXISTS "Allow anon read" ON app_users;
DROP POLICY IF EXISTS "Allow anon write" ON app_users;
DROP POLICY IF EXISTS "Allow anon update" ON app_users;
DROP POLICY IF EXISTS "Allow anon delete" ON app_users;
CREATE POLICY "app_users_all" ON app_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. RLS franchisees
ALTER TABLE franchisees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all franchisees" ON franchisees;
DROP POLICY IF EXISTS "Allow anon franchisees" ON franchisees;
CREATE POLICY "franchisees_all" ON franchisees FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Remover duplicatas de franqueados (manter apenas 1 por nome)
DELETE FROM app_users
WHERE role = 'franqueado'
  AND ctid NOT IN (
    SELECT MIN(ctid)
    FROM app_users
    WHERE role = 'franqueado'
    GROUP BY lower(trim(name))
  );

-- 6. Categorias de produtos
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category = ANY (ARRAY['Empada Salgada','Empadas Doces','Pastéis','Descartáveis','Fardamento']));

SELECT 
  'Pronto! Franqueados restantes: ' || COUNT(*)::text AS status
FROM app_users WHERE role = 'franqueado';
