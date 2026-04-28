-- ============================================================
-- Dom da Empada - Supabase Schema
-- Execute este SQL no Supabase Studio > SQL Editor
-- ============================================================

-- Tabela de usuários do sistema (motoristas, admins, etc.)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'usuario' CHECK (role IN ('admin', 'usuario', 'motorista')),
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  phone TEXT,
  vehicle TEXT,
  photo_url TEXT,
  auth_uid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT NOT NULL,
  point_id TEXT,
  point_name TEXT NOT NULL,
  units INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'IDLE',
  type TEXT NOT NULL DEFAULT 'REGULAR',
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  driver_name TEXT,
  vehicle TEXT,
  photo_url TEXT,
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos (preços)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento')),
  cost_price TEXT DEFAULT '0',
  sell_price TEXT DEFAULT '0',
  region TEXT NOT NULL DEFAULT 'Recife' CHECK (region IN ('Recife', 'Salvador')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  read BOOLEAN DEFAULT FALSE,
  user_id TEXT NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Habilitar Realtime nas tabelas (comentado se já existirem)
-- ============================================================
-- NOTA: Se der erro "already member", ignore - as tabelas já estão com realtime habilitado
-- ALTER PUBLICATION supabase_realtime ADD TABLE app_users;
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;
-- ALTER PUBLICATION supabase_realtime ADD TABLE products;
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================
-- Row Level Security (RLS) - Desabilitar para simplificar
-- Em produção, habilite e configure políticas adequadas
-- ============================================================
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (acesso total para usuários autenticados)
CREATE POLICY "Allow all for authenticated" ON app_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Também permitir acesso anon (para o self-hosted sem auth obrigatório)
CREATE POLICY "Allow anon read" ON app_users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON app_users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON app_users FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON app_users FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon read" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON orders FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon read" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON products FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon read" ON notifications FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon write" ON notifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON notifications FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON notifications FOR DELETE TO anon USING (true);

-- ============================================================
-- NOVAS TABELAS PARA INTEGRAÇÃO APP ↔ PORTAL
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
-- Habilitar Realtime nas novas tabelas
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

-- ============================================================
-- Storage Buckets (executar em Storage > New Bucket)
-- ============================================================
-- 1. checklist-photos (para fotos dos checklists veiculares)
-- 2. delivery-photos (para fotos das entregas)
--
-- Configurar políticas públicas de leitura para ambos
-- ============================================================
