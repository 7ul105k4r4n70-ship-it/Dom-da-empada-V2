-- ============================================================
-- Dom da Empada - STORAGE FIX
-- Execute este SQL no Supabase Studio > SQL Editor para resolver
-- o erro de upload de fotos (buckets e políticas).
-- ============================================================

-- 1. Criar os buckets se não existirem
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('vehicle-photos', 'vehicle-photos', true),
  ('checklist-photos', 'checklist-photos', true),
  ('delivery-photos', 'delivery-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar políticas de Storage (se necessário)
-- Nota: Algumas versões do Supabase requerem que o RLS esteja ativado no storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas para evitar duplicatas (opcional mas recomendado)
DROP POLICY IF EXISTS "Public Select Vehicle Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Vehicle Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Select Checklist Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Checklist Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Select Delivery Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Delivery Photos" ON storage.objects;

-- 4. Criar novas políticas permissivas para ANON e AUTHENTICATED
-- VEÍCULOS
CREATE POLICY "Public Select Vehicle Photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'vehicle-photos');
CREATE POLICY "Public Insert Vehicle Photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'vehicle-photos');

-- CHECKLISTS
CREATE POLICY "Public Select Checklist Photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'checklist-photos');
CREATE POLICY "Public Insert Checklist Photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'checklist-photos');

-- ENTREGAS
CREATE POLICY "Public Select Delivery Photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'delivery-photos');
CREATE POLICY "Public Insert Delivery Photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'delivery-photos');

-- 5. Extra: Permitir delete/update se necessário (opcional)
CREATE POLICY "Public Update/Delete Vehicle Photos" ON storage.objects FOR ALL TO anon, authenticated USING (bucket_id = 'vehicle-photos') WITH CHECK (bucket_id = 'vehicle-photos');
