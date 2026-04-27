-- ============================================================
-- Dom da Empada — RPC: Sincronizar senha de motorista no Auth
-- Execute no Supabase Studio > SQL Editor ANTES de fazer deploy
-- ============================================================
-- Esta função é chamada pelo V1 quando o login falha, para
-- sincronizar a senha digitada diretamente no auth.users,
-- sem precisar do Admin API (que é bloqueado por CORS no browser).
-- ============================================================

CREATE OR REPLACE FUNCTION sync_driver_password(
  p_email    TEXT,
  p_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER   -- executa com privilégios do owner (postgres), não do chamador
AS $$
DECLARE
  v_user_id  UUID;
  v_app_user RECORD;
BEGIN
  -- 1. Buscar auth_uid a partir do email na app_users
  SELECT id, auth_uid INTO v_app_user
  FROM app_users
  WHERE email = p_email
  LIMIT 1;

  -- 2. Tentar encontrar o usuário no auth.users pelo auth_uid ou email
  IF v_app_user.auth_uid IS NOT NULL THEN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE id = v_app_user.auth_uid::UUID;
  END IF;

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email
    LIMIT 1;
  END IF;

  -- 3. Se encontrou no auth.users: atualizar senha e confirmar email
  IF v_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET
      encrypted_password  = crypt(p_password, gen_salt('bf')),
      email_confirmed_at  = COALESCE(email_confirmed_at, NOW()),
      updated_at          = NOW()
    WHERE id = v_user_id;

    -- Sincronizar auth_uid na app_users se estiver vazio
    IF v_app_user.auth_uid IS NULL THEN
      UPDATE app_users
      SET auth_uid = v_user_id::TEXT
      WHERE email = p_email;
    END IF;

    RETURN json_build_object('success', true, 'auth_uid', v_user_id);
  END IF;

  -- 4. Não existe no auth.users: criar usando a extensão pgcrypto
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),   -- email já confirmado
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO v_user_id;

  -- Atualizar auth_uid na app_users
  UPDATE app_users
  SET auth_uid = v_user_id::TEXT, password = p_password
  WHERE email = p_email;

  RETURN json_build_object('success', true, 'auth_uid', v_user_id, 'created', true);

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Permitir que anon e authenticated chamem esta função
GRANT EXECUTE ON FUNCTION sync_driver_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION sync_driver_password(TEXT, TEXT) TO authenticated;

-- Verificar se a função foi criada
SELECT proname, prosecdef FROM pg_proc WHERE proname = 'sync_driver_password';
