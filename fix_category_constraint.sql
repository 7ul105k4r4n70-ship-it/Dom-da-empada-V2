-- Remover a constraint existente
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Adicionar nova constraint com a categoria "Entrega extra"
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN ('Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento', 'Entrega extra'));
