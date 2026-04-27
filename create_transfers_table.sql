-- Criar tabela de transferências de estoque
CREATE TABLE IF NOT EXISTS transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    items JSONB NOT NULL,
    total_items INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Concluído',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentário
COMMENT ON TABLE transfers IS 'Registro de transferências de estoque entre regiões';
