-- Fix product ordering across all modules (V1, V2, V3)
-- Standard sequence for both regions (Recife and Salvador)

-- Add sort_order column if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Define the exact product ordering as requested
-- Empadas Salgadas (1-13)
-- Empadas Doces (14-18)
-- Pastel (19-22)

-- Update sort_order for each product by name (case-insensitive matching)
WITH product_ordering AS (
  SELECT unnest(ARRAY[
    'Palmito',
    'Frango Puro',
    'Frango com Bacon',
    'Franco com Azeitona',
    'Frango com Cheddar',
    'Frango com Requeijão',
    'Alho Poró',
    '2 queijos',
    'Camarão',
    'Camarão com requeijão',
    'Bacalhau',
    'Charque',
    'Carne de Sol',
    'Nordestina',
    'Vazada',
    'Chocolate',
    'Paçoca',
    'Romeu e Julieta',
    'Banana com Doce de Leite',
    'Camarão com Requeijão',
    'Carne com Azeitona',
    'Frango com Requeijão',
    'Pizza'
  ]) as name,
  generate_series(1, 23) as sort_order
)
UPDATE products p
SET sort_order = po.sort_order
FROM product_ordering po
WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(po.name));

-- For any products not matched, set them to a high sort_order (999)
UPDATE products
SET sort_order = 999
WHERE sort_order = 0;

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order, region);

-- Verify the ordering
SELECT category, name, sort_order 
FROM products 
ORDER BY sort_order, name;
