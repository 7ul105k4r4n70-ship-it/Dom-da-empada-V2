-- Verificar se há preços cadastrados na tabela prices
SELECT 
  p.name,
  pr.cost_price,
  pr.sale_price,
  pr.valid_from,
  pr.region
FROM products p
LEFT JOIN prices pr ON p.id = pr.product_id
WHERE p.region = 'Recife'
ORDER BY pr.valid_from DESC
LIMIT 20;

-- Se não houver preços, você pode inserir preços de exemplo:
-- INSERT INTO prices (product_id, cost_price, sale_price, valid_from, region)
-- SELECT id, 50.00, 75.00, CURRENT_DATE, region
-- FROM products
-- WHERE category IN ('Empada Salgada', 'Empadas Doces', 'Pastéis')
-- AND region = 'Recife';
