-- Atualizar o nome da categoria de 'Empadas' para 'Empada Salgada' na tabela de produtos
UPDATE public.products 
SET category = 'Empada Salgada' 
WHERE category = 'Empadas';
