-- ============================================================
-- TABELA: franchisees (Rede de Franqueados)
-- Verificado e sincronizado com o formulário React em 2026-04-13
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- Cria a tabela (se não existir)
CREATE TABLE IF NOT EXISTS public.franchisees (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,                  -- e-mail interno gerado automaticamente (login Supabase Auth)
  region      TEXT NOT NULL CHECK (region IN ('Recife', 'Salvador')),
  initials    TEXT NOT NULL,         -- 2 letras iniciais do nome
  uf          TEXT,                  -- UF do franqueado (ex: PE, BA)
  city        TEXT,                  -- cidade principal do franqueado
  state       TEXT,                  -- nome completo do estado
  points      JSONB DEFAULT '[]'::jsonb, -- array de pontos de entrega
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.franchisees ENABLE ROW LEVEL SECURITY;

-- ── Políticas de acesso ──────────────────────────────────────
-- SELECT: usuários autenticados
CREATE POLICY "franchisees_select" ON public.franchisees
  FOR SELECT USING (auth.role() = 'authenticated');

-- INSERT: usuários autenticados
CREATE POLICY "franchisees_insert" ON public.franchisees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: usuários autenticados
CREATE POLICY "franchisees_update" ON public.franchisees
  FOR UPDATE USING (auth.role() = 'authenticated');

-- DELETE: usuários autenticados
CREATE POLICY "franchisees_delete" ON public.franchisees
  FOR DELETE USING (auth.role() = 'authenticated');

-- ── Verificação final ────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'franchisees'
ORDER BY ordinal_position;
