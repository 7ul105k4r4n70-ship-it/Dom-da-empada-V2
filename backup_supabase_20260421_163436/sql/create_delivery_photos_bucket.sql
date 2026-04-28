-- Execute no SQL Editor do Supabase (pgAdmin ou Dashboard)

-- 1. Criar bucket delivery-photos no Storage (se não existir)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'delivery-photos', 
  'delivery-photos', 
  true, 
  5242880, -- 5MB limite
  '{"image/jpeg", "image/png", "image/jpg"}'
)
on conflict (id) do nothing;

-- 2. Política de acesso público para leitura
-- Qualquer um pode visualizar as fotos (necessário para o relatório)
create policy "Delivery Photos Public Access"
on storage.objects for select
using ( bucket_id = 'delivery-photos' );

-- 3. Política para motoristas/motoristas inserirem fotos
-- Usuários autenticados podem fazer upload
create policy "Delivery Photos Upload"
on storage.objects for insert
with check ( bucket_id = 'delivery-photos' );

-- 4. Política para usuários autenticados deletarem fotos (opcional)
create policy "Delivery Photos Delete"
on storage.objects for delete
using ( bucket_id = 'delivery-photos' );

-- 5. Verificar se a coluna deliveryPhoto existe na tabela orders
-- Se não existir, adicionar:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'deliveryPhoto'
    ) THEN
        ALTER TABLE orders ADD COLUMN "deliveryPhoto" text;
    END IF;
END $$;

-- 6. Verificar se a coluna driverPhoto existe (também usada)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'driverPhoto'
    ) THEN
        ALTER TABLE orders ADD COLUMN "driverPhoto" text;
    END IF;
END $$;
