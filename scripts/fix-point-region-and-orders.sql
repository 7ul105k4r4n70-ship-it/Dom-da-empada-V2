-- ============================================================
-- CORREÇÃO COMPLETA: Pedidos devem usar REGIÃO DO PONTO
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- PARTE 1: Adicionar campo 'region' aos pontos existentes
-- ============================================================

-- 1.1 Verificar estrutura atual dos pontos
SELECT 
  id,
  name,
  region as "Região do Franqueado",
  jsonb_array_elements(points) as "Ponto"
FROM franchisees
LIMIT 5;

-- 1.2 Adicionar campo 'region' aos pontos que não têm
UPDATE franchisees
SET points = (
  SELECT jsonb_agg(
    CASE 
      WHEN point->>'region' IS NULL OR point->>'region' = '' THEN
        jsonb_set(point, '{region}', to_jsonb(f.region))
      ELSE point
    END
  )
  FROM jsonb_array_elements(f.points) as point
)
FROM franchisees f
WHERE franchisees.id = f.id
AND EXISTS (
  SELECT 1 
  FROM jsonb_array_elements(f.points) as point
  WHERE point->>'region' IS NULL OR point->>'region' = ''
);

-- 1.3 Verificar se os pontos agora têm região
SELECT 
  f.name,
  f.region as "Região do Franqueado",
  point->>'name' as "Nome do Ponto",
  point->>'region' as "Região do Ponto",
  CASE 
    WHEN point->>'region' = f.region THEN '✅ Igual'
    WHEN point->>'region' IS NULL THEN '⚠️ Sem região'
    ELSE '🔄 Diferente (CORRETO!)'
  END as Status
FROM franchisees f,
     jsonb_array_elements(f.points) as point
WHERE f.name ILIKE '%Gustavo%'
ORDER BY point->>'name';


-- PARTE 2: Corrigir pedidos existentes
-- ============================================================

-- 2.1 Verificar pedidos com região errada
SELECT 
  o.id,
  o.order_code,
  o.point_name,
  o.region as "Região do Pedido",
  f.region as "Região do Franqueado",
  CASE 
    WHEN o.region = f.region THEN '✅ Igual'
    ELSE '❌ Diferente (precisa corrigir)'
  END as Status
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE o.franchisee_id IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 50;

-- 2.2 Atualizar TODOS os pedidos para usar a região do PONTO
UPDATE orders o
SET region = (
  SELECT (point->>'region')::text
  FROM franchisees f,
       jsonb_array_elements(f.points) as point
  WHERE f.id = o.franchisee_id::uuid
    AND point->>'id' = o.point_id
    AND point->>'region' IS NOT NULL
  LIMIT 1
)
WHERE o.franchisee_id IS NOT NULL
  AND o.region != (
    SELECT (point->>'region')::text
    FROM franchisees f,
         jsonb_array_elements(f.points) as point
    WHERE f.id = o.franchisee_id::uuid
      AND point->>'id' = o.point_id
      AND point->>'region' IS NOT NULL
    LIMIT 1
  )
  AND EXISTS (
    SELECT 1
    FROM franchisees f,
         jsonb_array_elements(f.points) as point
    WHERE f.id = o.franchisee_id::uuid
      AND point->>'id' = o.point_id
      AND point->>'region' IS NOT NULL
  );

-- 2.3 Verificar se a correção funcionou
SELECT 
  o.order_code,
  o.point_name,
  o.region as "Nova Região do Pedido",
  f.region as "Região do Franqueado",
  CASE 
    WHEN o.region = (
      SELECT (point->>'region')::text
      FROM jsonb_array_elements(f.points) as point
      WHERE point->>'id' = o.point_id
      LIMIT 1
    ) THEN '✅ Correto (região do ponto)'
    ELSE '⚠️ Usando região do franqueado'
  END as Status
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE o.franchisee_id IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 20;
