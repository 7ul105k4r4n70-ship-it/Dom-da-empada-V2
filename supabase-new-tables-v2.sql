-- ============================================================
-- Dom da Empada — Novas Tabelas v2
-- Tabelas necessárias para integração V3→V2→V1
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- ─── 1. Disponibilidade de Produtos (V2 Módulo 9 → V3) ───────────────────────
-- Controla quais produtos estão "Em Falta" por região
-- Admin/Coordenador altera no V2; V3 reflete em tempo real
CREATE TABLE IF NOT EXISTS product_availability (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  region      TEXT NOT NULL CHECK (region IN ('Recife', 'Salvador')),
  status      TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock')),
  updated_by  TEXT,                          -- nome/email do admin que alterou
  reason      TEXT,                          -- motivo opcional
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, region)                -- uma entrada por produto/região
);

-- ─── 2. Itens dos Pedidos dos Franqueados (V3 → V2 Módulo 4 → V1) ────────────
-- Relaciona cada pedido com seus produtos e quantidades
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity     DECIMAL(10,2) NOT NULL DEFAULT 0,  -- decimal para suportar 0.5 (meia caixa)
  cost_price   DECIMAL(10,2) NOT NULL DEFAULT 0,
  sale_price   DECIMAL(10,2) NOT NULL DEFAULT 0,
  region       TEXT NOT NULL CHECK (region IN ('Recife', 'Salvador')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Preços de Produtos (V2 Módulo 7 → V3) ────────────────────────────────
-- Tabela versionada de preços com data de vigência
-- V3 lê o preço mais recente com valid_from <= NOW()
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

-- ─── 4. Atualizar tabela products para PRD §9 (categorias corretas) ───────────
-- Adicionar campos faltantes para o catálogo unificado do V3
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS unit        TEXT DEFAULT 'Caixa',
  ADD COLUMN IF NOT EXISTS allow_half  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS active      BOOLEAN DEFAULT TRUE;

-- Atualizar constraint de category para incluir todas as categorias do PRD
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN (
    'food_sweet',     -- Empadas Doces (allow_half = true)
    'food_salty',     -- Empadas Salgadas
    'supply',         -- Suprimentos (embalagens, forminhas, etc.)
    'uniform',        -- Uniformes (camisetas, touca, avental)
    -- Labels legados (compatibilidade com dados existentes)
    'Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento',
    'Salgadas', 'Doces', 'Vazadas'
  ));

-- ─── 5. Atualizar tabela orders para pedidos do V3 ────────────────────────────
-- Adicionar campos necessários para pedidos de franqueados
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS franchisee_id  UUID REFERENCES app_users(id),
  ADD COLUMN IF NOT EXISTS pdf_url        TEXT,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW();

-- Atualizar constraint de status para incluir estados do ciclo de vida do PRD
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'Recebido', 'Em Entrega', 'Entregue', 'Cancelado',    -- estados V3/V1
    'IDLE', 'IN PROGRESS', 'COMPLETED', 'AWAITING LOGISTICS' -- estados legados V2
  ));

-- ─── 6. Adicionar campos faltantes em app_users para franqueados e motoristas ─
ALTER TABLE app_users
  ADD COLUMN IF NOT EXISTS store_name  TEXT,   -- nome da loja do franqueado
  ADD COLUMN IF NOT EXISTS cnpj        TEXT;   -- CNPJ do franqueado

-- Atualizar constraint de role para incluir todos os papéis do PRD
ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_role_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_role_check
  CHECK (role IN (
    'admin', 'coordinator', 'analyst',  -- papéis V2
    'driver',                           -- motorista V1
    'franchisee',                       -- franqueado V3 (inglês — legado)
    'franqueado',                       -- franqueado V3 (português — portal V2)
    -- legados
    'usuario', 'motorista'
  ));

-- ─── 7. Habilitar Realtime nas novas tabelas ─────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE product_availability;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE prices;

-- ─── 8. RLS — Políticas de acesso ────────────────────────────────────────────
ALTER TABLE product_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices               ENABLE ROW LEVEL SECURITY;

-- Acesso total para autenticados
CREATE POLICY "Allow all for authenticated" ON product_availability FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON order_items          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON prices               FOR ALL USING (true) WITH CHECK (true);

-- Acesso anon (self-hosted sem auth obrigatório)
CREATE POLICY "Allow anon all" ON product_availability FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON order_items          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON prices               FOR ALL TO anon USING (true) WITH CHECK (true);

-- ─── 9. Seed inicial: disponibilidade padrão ─────────────────────────────────
-- Após criar produtos, rode isto para inicializar disponibilidade como 'available'
-- INSERT INTO product_availability (product_id, region, status, updated_by)
-- SELECT id, 'Recife',   'available', 'sistema' FROM products;
-- INSERT INTO product_availability (product_id, region, status, updated_by)
-- SELECT id, 'Salvador', 'available', 'sistema' FROM products
-- ON CONFLICT (product_id, region) DO NOTHING;

-- ─── 10. Índices de performance ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_region_franchisee ON orders(region, franchisee_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order         ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_avail_region      ON product_availability(product_id, region);
CREATE INDEX IF NOT EXISTS idx_prices_product_date       ON prices(product_id, valid_from DESC);

-- ─── 11. Tabela vehicles (frota — V1 e V2) ─────────────────────────────────
-- V1 lê veículos disponíveis por região; V2 gerencia a frota
CREATE TABLE IF NOT EXISTS vehicles (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  plate           TEXT NOT NULL UNIQUE,
  capacity        TEXT,
  fuel_level      INTEGER DEFAULT 100 CHECK (fuel_level BETWEEN 0 AND 100),
  status          TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'inactive')),
  region          TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  current_km      INTEGER DEFAULT 0,
  next_oil_change INTEGER DEFAULT 0,
  photo_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON vehicles FOR ALL TO anon USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;

-- ─── 12. Tabela schedules (agendamentos V2 → V1) ───────────────────────────
-- V2 Módulo 2 cria agendamentos; V1 lê as viagens do dia por motorista e região
CREATE TABLE IF NOT EXISTS schedules (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id       UUID REFERENCES app_users(id),
  vehicle_id      UUID REFERENCES vehicles(id),
  title           TEXT NOT NULL,
  scheduled_date  DATE NOT NULL,
  scheduled_time  TIME,
  stops_count     INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'Pendente' CHECK (status IN ('Confirmada', 'Pendente', 'Cancelada', 'Concluída')),
  region          TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON schedules FOR ALL TO anon USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;

-- ─── 13. Tabela fueling_records (abastecimentos V1 → V2) ──────────────────
-- V1 registra abastecimentos; V2 Módulo 6 exibe histórico e KPIs
CREATE TABLE IF NOT EXISTS fueling_records (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id   UUID REFERENCES app_users(id),
  vehicle_id  UUID REFERENCES vehicles(id),
  liters      DECIMAL(10,2) NOT NULL,
  km_at_fill  INTEGER,
  station     TEXT,
  cost        DECIMAL(10,2),
  region      TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fueling_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON fueling_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all" ON fueling_records FOR ALL TO anon USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE fueling_records;

CREATE INDEX IF NOT EXISTS idx_schedules_driver_region ON schedules(driver_id, region, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_fueling_driver_region   ON fueling_records(driver_id, region, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicles_region         ON vehicles(region, status);

