-- Adiciona ID curto sequencial global para pedidos
-- Substitui UUIDs longos por números simples (1, 2, 3...)

-- 1. Cria sequence global para IDs de pedido
CREATE SEQUENCE IF NOT EXISTS order_short_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MAXVALUE;

-- 2. Adiciona coluna short_id na tabela orders (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'short_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN short_id BIGINT UNIQUE;
  END IF;
END $$;

-- 3. Preenche short_id para pedidos existentes (ordem cronológica)
WITH numbered_orders AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM orders
  WHERE short_id IS NULL
)
UPDATE orders o
SET short_id = no.rn
FROM numbered_orders no
WHERE o.id = no.id;

-- 4. Garante que novos pedidos recebam short_id automaticamente
CREATE OR REPLACE FUNCTION set_order_short_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.short_id IS NULL THEN
    NEW.short_id := nextval('order_short_id_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Cria trigger para auto-preencher short_id
DROP TRIGGER IF EXISTS trg_set_order_short_id ON orders;
CREATE TRIGGER trg_set_order_short_id
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_short_id();

-- 6. Sincroniza a sequence com o maior ID existente
SELECT setval('order_short_id_seq', COALESCE((SELECT MAX(short_id) FROM orders), 0) + 1, false);

-- Verificação
SELECT 'Configuração concluída. Próximo ID será: ' || nextval('order_short_id_seq') as status;
