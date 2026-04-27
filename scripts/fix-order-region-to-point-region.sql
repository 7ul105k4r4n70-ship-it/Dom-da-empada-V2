-- ============================================================
-- CORREÇÃO: Pedidos devem usar a REGIÃO DO PONTO, não do franqueado
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Verificar situação atual: pedidos com região diferente do ponto
SELECT 
  o.id,
  o.order_code,
  o.point_name,
  o.region as "Região do Pedido",
  f.region as "Região do Franqueado",
  f.name as "Franqueado",
  CASE 
    WHEN o.region = f.region THEN '✅ Igual'
    ELSE '❌ Diferente (precisa corrigir)'
  END as Status
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE o.franchisee_id IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 50;

-- 2. Contar quantos pedidos estão com região errada
SELECT 
  COUNT(*) as "Total de Pedidos",
  COUNT(CASE WHEN o.region != f.region THEN 1 END) as "Região Errada",
  COUNT(CASE WHEN o.region = f.region THEN 1 END) as "Região Correta"
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE o.franchisee_id IS NOT NULL;

-- 3. VER a estrutura JSON dos pontos do franqueado para encontrar a região correta
SELECT 
  f.id,
  f.name,
  f.region as "Região do Franqueado",
  jsonb_array_elements(f.points) as "Ponto JSON"
FROM franchisees f
WHERE f.id = '5ecc2433-addf-40e4-8ee9-e489213d421c'  -- Substitua pelo ID do franqueado
LIMIT 10;

-- 4. CORREÇÃO: Atualizar região dos pedidos baseado na região do ponto de entrega
-- ATENÇÃO: Este script corrige TODOS os pedidos existentes
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

-- 5. Verificar se a correção funcionou
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
    ) THEN '✅ Correto (usando região do ponto)'
    ELSE '⚠️ Usando região do franqueado'
  END as Status
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE o.franchisee_id IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 20;

-- 6. Exemplo de casos específicos para verificar
SELECT 
  o.order_code,
  o.point_name,
  o.region as "Região do Pedido",
  f.name as "Franqueado",
  f.region as "Região do Franqueado",
  (
    SELECT point->>'region'
    FROM jsonb_array_elements(f.points) as point
    WHERE point->>'id' = o.point_id
    LIMIT 1
  ) as "Região do Ponto no JSON"
FROM orders o
LEFT JOIN franchisees f ON o.franchisee_id::uuid = f.id
WHERE f.name ILIKE '%Gustavo%'  -- Substitua pelo nome do franqueado
ORDER BY o.created_at DESC;
