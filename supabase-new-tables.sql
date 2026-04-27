-- ============================================================
-- Dom da Empada - NOVAS TABELAS (apenas para integração App↔Portal)
-- Execute este SQL no Supabase Studio > SQL Editor
-- ============================================================

-- Tabela de checklists veiculares
CREATE TABLE IF NOT EXISTS vehicle_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES app_users(id),
  vehicle TEXT NOT NULL,
  km INTEGER NOT NULL,
  checks JSONB NOT NULL DEFAULT '{}'::jsonb,
  photos TEXT[] DEFAULT '{}',
  observations TEXT,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'problem')),
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos entregues em cada pedido
CREATE TABLE IF NOT EXISTS delivery_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  driver_id UUID REFERENCES app_users(id),
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de rotas
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES app_users(id),
  vehicle TEXT,
  name TEXT NOT NULL,
  total_distance DECIMAL(10,2),
  estimated_time INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de pontos de rota
CREATE TABLE IF NOT EXISTS route_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  name TEXT NOT NULL,
  address TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  sequence INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Tabela de rastreamento GPS
CREATE TABLE IF NOT EXISTS gps_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES app_users(id),
  route_id UUID REFERENCES routes(id),
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  speed DECIMAL(5,2),
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Habilitar Realtime nas novas tabelas (ignore erro se já existir)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_checklists;
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_products;
ALTER PUBLICATION supabase_realtime ADD TABLE routes;
ALTER PUBLICATION supabase_realtime ADD TABLE route_points;
ALTER PUBLICATION supabase_realtime ADD TABLE gps_tracking;

-- ============================================================
-- RLS para novas tabelas
-- ============================================================
ALTER TABLE vehicle_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_tracking ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas
CREATE POLICY "Allow all for authenticated" ON vehicle_checklists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON delivery_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON routes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON route_points FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON gps_tracking FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon read" ON vehicle_checklists FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON vehicle_checklists FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON vehicle_checklists FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON vehicle_checklists FOR DELETE TO anon;

CREATE POLICY "Allow anon read" ON delivery_products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON delivery_products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON delivery_products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON delivery_products FOR DELETE TO anon;

CREATE POLICY "Allow anon read" ON routes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON routes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON routes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON routes FOR DELETE TO anon;

CREATE POLICY "Allow anon read" ON route_points FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON route_points FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON route_points FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON route_points FOR DELETE TO anon;

CREATE POLICY "Allow anon read" ON gps_tracking FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON gps_tracking FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON gps_tracking FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON gps_tracking FOR DELETE TO anon;
