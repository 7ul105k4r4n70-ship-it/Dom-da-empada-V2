-- Habilitar RLS na tabela transfers
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT para usuários autenticados
CREATE POLICY "Allow insert for authenticated users" ON transfers
  FOR INSERT TO authenticated WITH CHECK (true);

-- Política para permitir SELECT para usuários autenticados
CREATE POLICY "Allow select for authenticated users" ON transfers
  FOR SELECT TO authenticated USING (true);

-- Alternativa: permitir tudo para anon (se necessário)
-- CREATE POLICY "Allow all for anon" ON transfers FOR ALL TO anon USING (true) WITH CHECK (true);
