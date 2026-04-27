-- ============================================================
-- CORREÇÕES: Perfil, Cadastro de Usuários e Limpeza de Órfãos
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Corrigir a função de limpeza de usuários órfãos
--    (resolvia erro: "operator does not exist: text = uuid")
CREATE OR REPLACE FUNCTION public.delete_orphan_auth_users()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    deleted_count INTEGER := 0;
    user_record RECORD;
BEGIN
    FOR user_record IN
        SELECT au.id, au.email
        FROM auth.users au
        LEFT JOIN public.app_users pu ON pu.auth_uid = au.id::text
        WHERE pu.id IS NULL
          AND au.email NOT IN ('admin.master@domdaempada.com.br', '7ul105k4r4n70@gmail.com')
    LOOP
        DELETE FROM auth.users WHERE id = user_record.id;
        deleted_count := deleted_count + 1;
    END LOOP;
    RETURN deleted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_orphan_auth_users TO anon;
GRANT EXECUTE ON FUNCTION public.delete_orphan_auth_users TO authenticated;


-- 2. Função auxiliar: buscar o auth_uid de um usuário pelo email
--    (usada ao cadastrar usuário cujo email já existe no Auth)
CREATE OR REPLACE FUNCTION public.get_auth_uid_by_email(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    found_id UUID;
BEGIN
    SELECT id INTO found_id FROM auth.users WHERE email = user_email LIMIT 1;
    RETURN found_id::text;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_uid_by_email TO anon;
GRANT EXECUTE ON FUNCTION public.get_auth_uid_by_email TO authenticated;


-- 3. Garantir que a coluna password existe em app_users
--    (necessária para login por nome+senha no app mobile)
ALTER TABLE public.app_users
    ADD COLUMN IF NOT EXISTS password TEXT;

-- 4. Garantir que photo_url existe (pode ser photo_url ou photoUrl)
ALTER TABLE public.app_users
    ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- ============================================================
-- FIM DAS CORREÇÕES
-- ============================================================
