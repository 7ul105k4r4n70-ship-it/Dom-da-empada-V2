-- ============================================================
-- Atualiza a constraint de categoria da tabela products
-- para incluir a nova categoria "Empadas Doces"
-- Execute no: Supabase Studio > SQL Editor
-- ============================================================

-- 1. Remove a constraint antiga
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_category_check;

-- 2. Adiciona a nova constraint com "Empadas Doces" incluído
ALTER TABLE products 
ADD CONSTRAINT products_category_check 
CHECK (category IN ('Empadas', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento'));
