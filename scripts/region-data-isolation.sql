-- ============================================================
-- ISOLAMENTO DE DADOS POR REGIÃO
-- Garante que dados de Recife e Salvador nunca se misturem
-- ============================================================
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. ORDERS - Isolamento por região
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_isolation" ON orders;
CREATE POLICY "orders_isolation" ON orders
  FOR ALL
  USING (
    -- Admin pode ver todas as regiões (mas dados não se misturam nas queries)
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    -- Usuários normais só veem sua região
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    -- Admin pode inserir/atualizar em qualquer região
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    -- Usuários só podem operar na sua região
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 2. APP_USERS - Usuários podem ver todos, mas operações restritas
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_users_read" ON app_users;
CREATE POLICY "app_users_read" ON app_users
  FOR SELECT
  USING (true); -- Todos podem ver todos os usuários

DROP POLICY IF EXISTS "app_users_write" ON app_users;
CREATE POLICY "app_users_write" ON app_users
  FOR ALL
  USING (
    -- Apenas admin pode criar/editar/deletar usuários
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
  );

-- 3. FRANCHISEES - Isolamento por região
ALTER TABLE franchisees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "franchisees_isolation" ON franchisees;
CREATE POLICY "franchisees_isolation" ON franchisees
  FOR ALL
  USING (
    -- Admin pode ver todas as regiões
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    -- Usuários só veem franqueados da sua região
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 4. PRODUCTS - Isolamento por região
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_isolation" ON products;
CREATE POLICY "products_isolation" ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 5. VEHICLES - Isolamento por região
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vehicles_isolation" ON vehicles;
CREATE POLICY "vehicles_isolation" ON vehicles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 6. DELIVERY_PRODUCTS - Isolamento por região
ALTER TABLE delivery_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "delivery_products_isolation" ON delivery_products;
CREATE POLICY "delivery_products_isolation" ON delivery_products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 7. VEHICLE_CHECKLISTS - Isolamento por região
ALTER TABLE vehicle_checklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vehicle_checklists_isolation" ON vehicle_checklists;
CREATE POLICY "vehicle_checklists_isolation" ON vehicle_checklists
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 8. FUEL_REGISTRATIONS - Isolamento por região
ALTER TABLE fuel_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fuel_registrations_isolation" ON fuel_registrations;
CREATE POLICY "fuel_registrations_isolation" ON fuel_registrations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 9. SCHEDULES - Isolamento por região
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schedules_isolation" ON schedules;
CREATE POLICY "schedules_isolation" ON schedules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    region = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 10. TRANSFERS - Isolamento por região
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transfers_isolation" ON transfers;
CREATE POLICY "transfers_isolation" ON transfers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    origin = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
    OR
    destination = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE app_users.id = auth.uid() 
      AND app_users.role = 'admin'
    )
    OR
    origin = (
      SELECT app_users.region FROM app_users 
      WHERE app_users.id = auth.uid()
    )
  );

-- 11. ORDER_ITEMS - Herda isolamento do pedido pai
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_isolation" ON order_items;
CREATE POLICY "order_items_isolation" ON order_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id
      AND (
        EXISTS (
          SELECT 1 FROM app_users 
          WHERE app_users.id = auth.uid() 
          AND app_users.role = 'admin'
        )
        OR
        orders.region = (
          SELECT app_users.region FROM app_users 
          WHERE app_users.id = auth.uid()
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id
      AND (
        EXISTS (
          SELECT 1 FROM app_users 
          WHERE app_users.id = auth.uid() 
          AND app_users.role = 'admin'
        )
        OR
        orders.region = (
          SELECT app_users.region FROM app_users 
          WHERE app_users.id = auth.uid()
        )
      )
    )
  );

-- ============================================================
-- VERIFICAÇÃO FINAL
-- ============================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND policyname LIKE '%isolation'
ORDER BY tablename, policyname;
