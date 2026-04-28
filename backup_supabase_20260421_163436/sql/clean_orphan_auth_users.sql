-- Habilitar extensão pgcrypto (necessária para crypt/gen_salt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para deletar usuário do auth pelo email
CREATE OR REPLACE FUNCTION public.delete_auth_user_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    DELETE FROM auth.users WHERE id = user_id;
    RETURN TRUE;
END;
$$;

-- Função para deletar usuários órfãos (estão no auth mas não no app_users)
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
        LEFT JOIN public.app_users pu ON pu.auth_uid = au.id
        WHERE pu.id IS NULL
    LOOP
        DELETE FROM auth.users WHERE id = user_record.id;
        deleted_count := deleted_count + 1;
    END LOOP;
    
    RETURN deleted_count;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.delete_auth_user_by_email TO anon;
GRANT EXECUTE ON FUNCTION public.delete_orphan_auth_users TO anon;

-- Drop function first to change return type
DROP FUNCTION IF EXISTS public.reset_user_password(text,text);

-- Função para redefinir senha do usuário
CREATE OR REPLACE FUNCTION public.reset_user_password(user_email TEXT, new_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RETURN 'USER_NOT_FOUND';
    END IF;
    
    UPDATE auth.users SET encrypted_password = crypt(new_password, gen_salt('bf')) WHERE id = user_id;
    RETURN 'SUCCESS';
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_user_password TO anon;

-- Função para criar usuário no auth com senha e email confirmado
CREATE OR REPLACE FUNCTION public.create_auth_user(user_email TEXT, user_password TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        aud,
        role,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        user_email,
        crypt(user_password, gen_salt('bf')),
        NOW(),
        'authenticated',
        'authenticated',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        NOW(),
        NOW(),
        '',
        ''
    );

    -- Create identity
    INSERT INTO auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        new_user_id,
        user_email,
        jsonb_build_object('sub', new_user_id::text, 'email', user_email),
        'email',
        NOW(),
        NOW(),
        NOW()
    );

    RETURN new_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_auth_user TO anon;

-- Função para verificar login (nome + senha) sem depender do GoTrue
CREATE OR REPLACE FUNCTION public.verify_user_login(user_name TEXT, user_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    app_user RECORD;
    auth_user RECORD;
BEGIN
    -- Buscar usuário pelo nome
    SELECT * INTO app_user FROM public.app_users 
    WHERE LOWER(name) = LOWER(user_name) LIMIT 1;
    
    IF app_user IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'USER_NOT_FOUND');
    END IF;
    
    IF app_user.status = 'Inativo' THEN
        RETURN json_build_object('success', false, 'error', 'USER_INACTIVE');
    END IF;
    
    IF app_user.auth_uid IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'NO_AUTH');
    END IF;
    
    -- Verificar senha no auth.users
    SELECT * INTO auth_user FROM auth.users 
    WHERE id = app_user.auth_uid::uuid;
    
    IF auth_user IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'AUTH_NOT_FOUND');
    END IF;
    
    IF auth_user.encrypted_password != crypt(user_password, auth_user.encrypted_password) THEN
        RETURN json_build_object('success', false, 'error', 'WRONG_PASSWORD');
    END IF;
    
    -- Login OK - retornar dados do usuário
    RETURN json_build_object(
        'success', true,
        'user_id', app_user.id,
        'name', app_user.name,
        'email', app_user.email,
        'role', app_user.role,
        'region', app_user.region,
        'auth_uid', app_user.auth_uid
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_user_login TO anon;

-- Função para confirmar email de um usuário
CREATE OR REPLACE FUNCTION public.confirm_user_email(user_id_input UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    UPDATE auth.users 
    SET email_confirmed_at = NOW(), 
        confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = user_id_input;
END;
$$;

GRANT EXECUTE ON FUNCTION public.confirm_user_email TO anon;
