-- ============================================================
-- ÍNDICES DE PERFORMANCE - Portal Administrativo Dom da Empada
-- ============================================================
-- Estes índices otimizam as consultas mais pesadas do sistema
-- Executar no Supabase SQL Editor ou via psql
-- ============================================================

-- 1. ÍNDICES PARA TABELA ORDERS (consultas por região e data)
-- ============================================================

-- Índice composto para filtros por região + data (usado no Dashboard e Reports)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_region_created_at 
ON orders(region, created_at DESC);

-- Índice para filtro por status (usado em todas as páginas)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status 
ON orders(status);

-- Índice para filtro por data de entrega
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_delivered_at 
ON orders(delivered_at DESC) WHERE delivered_at IS NOT NULL;

-- Índice para busca por ponto de entrega
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_point_name 
ON orders(point_name) WHERE point_name IS NOT NULL;

-- Índice para busca por motorista
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_driver_name 
ON orders(driver_name) WHERE driver_name IS NOT NULL;


-- 2. ÍNDICES PARA TABELA DELIVERY_PRODUCTS
-- ============================================================

-- Índice para buscar produtos por pedido (usado no Reports.tsx)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_delivery_products_order_id 
ON delivery_products(order_id);

-- Índice composto para busca por pedido + categoria
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_delivery_products_order_category 
ON delivery_products(order_id, category) WHERE category IS NOT NULL;


-- 3. ÍNDICES PARA TABELA DELIVERY_POINT_DETAILS
-- ============================================================

-- Índice para buscar detalhes por pedido
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_delivery_point_details_order_id 
ON delivery_point_details(order_id);


-- 4. ÍNDICES PARA TABELA ORDER_ITEMS
-- ============================================================

-- Índice para buscar itens por pedido (usado no Reports.tsx)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id 
ON order_items(order_id);

-- Índice composto para busca por pedido + produto
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_product 
ON order_items(order_id, product_name);


-- 5. ÍNDICES PARA TABELA APP_USERS
-- ============================================================

-- Índice para busca por região + role (usado em várias páginas)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_app_users_region_role 
ON app_users(region, role) WHERE status = 'Ativo';

-- Índice para busca por role (motoristas)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_app_users_role 
ON app_users(role) WHERE role IN ('motorista', 'driver');


-- 6. ÍNDICES PARA TABELA PRODUCTS
-- ============================================================

-- Índice para busca por região + categoria (usado no Reports.tsx)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_region_category 
ON products(region, category) WHERE status = 'Ativo';

-- Índice para ordenação por sort_order
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_sort_order 
ON products(region, sort_order);


-- 7. ÍNDICES PARA TABELA FRANCHISEES
-- ============================================================

-- Índice para busca por região
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_franchisees_region 
ON franchisees(region);


-- ============================================================
-- VERIFICAÇÃO DE ÍNDICES EXISTENTES
-- ============================================================
-- Execute esta query para verificar se os índices foram criados:

-- SELECT 
--     schemaname,
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
--   AND indexname LIKE 'idx_%'
-- ORDER BY tablename, indexname;


-- ============================================================
-- OTIMIZAÇÃO ADICIONAL: VACUUM E ANALYZE
-- ============================================================
-- Após criar os índices, execute para atualizar estatísticas:

-- VACUUM ANALYZE orders;
-- VACUUM ANALYZE delivery_products;
-- VACUUM ANALYZE delivery_point_details;
-- VACUUM ANALYZE order_items;
-- VACUUM ANALYZE app_users;
-- VACUUM ANALYZE products;
-- VACUUM ANALYZE franchisees;


-- ============================================================
-- MONITORAMENTO DE PERFORMANCE
-- ============================================================
-- Query para identificar consultas lentas (executar periodicamente):

-- SELECT 
--     query,
--     calls,
--     total_time,
--     mean_time,
--     rows
-- FROM pg_stat_statements 
-- WHERE query LIKE '%orders%' OR query LIKE '%delivery%'
-- ORDER BY mean_time DESC 
-- LIMIT 10;


-- ============================================================
-- ROLLBACK (se necessário remover os índices)
-- ============================================================
-- DROP INDEX CONCURRENTLY IF EXISTS idx_orders_region_created_at;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_orders_status;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_orders_delivered_at;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_orders_point_name;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_orders_driver_name;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_delivery_products_order_id;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_delivery_products_order_category;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_delivery_point_details_order_id;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_order_items_order_id;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_order_items_order_product;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_app_users_region_role;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_app_users_role;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_products_region_category;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_products_sort_order;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_franchisees_region;