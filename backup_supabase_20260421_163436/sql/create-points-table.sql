-- Criar tabela de pontos de entrega
CREATE TABLE IF NOT EXISTS public.points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('Recife', 'Salvador')),
  address TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.points ENABLE ROW LEVEL SECURITY;

-- Política de acesso público
CREATE POLICY "Enable read access for all users" ON public.points FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.points FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.points FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.points FOR DELETE USING (true);
