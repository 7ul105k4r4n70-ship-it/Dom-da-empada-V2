-- ============================================================
-- Criar tabela prices e migrar preços existentes
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Criar tabela prices se não existir
CREATE TABLE IF NOT EXISTS prices (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cost_price  DECIMAL(10,2) NOT NULL DEFAULT 0,
  sale_price  DECIMAL(10,2) NOT NULL DEFAULT 0,
  valid_from  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by  TEXT,
  region      TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_prices_product_date ON prices(product_id, valid_from DESC);

-- 3. Habilitar Row Level Security
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso
CREATE POLICY "Allow all for authenticated" ON prices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON prices FOR ALL TO anon USING (true) WITH CHECK (true);

-- 5. Adicionar à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE prices;

-- 6. Migrar preços existentes da tabela products para prices
-- (isso preserva os preços que já estão cadastrados)
INSERT INTO prices (product_id, cost_price, sale_price, valid_from, region, created_by)
SELECT 
  id as product_id,
  COALESCE(cost_price, 0) as cost_price,
  COALESCE(sell_price, 0) as sale_price,
  CURRENT_DATE as valid_from,
  region,
  'migration' as created_by
FROM products
WHERE cost_price IS NOT NULL AND cost_price::decimal > 0
ON CONFLICT DO NOTHING;

-- 7. Verificar migração
SELECT 
  COUNT(*) as total_precos_migrados,
  COUNT(DISTINCT region) as regioes
FROM prices
WHERE created_by = 'migration';

-- 8. Mostrar alguns exemplos
SELECT 
  p.name,
  pr.cost_price,
  pr.sale_price,
  pr.region,
  pr.valid_from
FROM prices pr
JOIN products p ON p.id = pr.product_id
WHERE pr.created_by = 'migration'
ORDER BY pr.created_at DESC
LIMIT 10;
