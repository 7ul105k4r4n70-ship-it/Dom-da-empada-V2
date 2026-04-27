-- ============================================================
-- CORREÇÃO: function gen_salt(unknown) does not exist






-- Instala pgcrypto no schema public + cria aliases se necessário
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Tentar instalar pgcrypto no schema public
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA public;

-- 2. Criar aliases no schema public (funcionam se pgcrypto estiver em outro schema)
CREATE OR REPLACE FUNCTION public.gen_salt(text) RETURNS text AS $$
  SELECT extensions.gen_salt($1);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.gen_salt(text, integer) RETURNS text AS $$
  SELECT extensions.gen_salt($1, $2);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.crypt(text, text) RETURNS text AS $$
  SELECT extensions.crypt($1, $2);
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Testar
SELECT gen_salt('bf') as test_result;
