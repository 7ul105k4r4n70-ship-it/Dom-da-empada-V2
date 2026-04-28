-- ============================================================
-- CRIAR USUARIO ADMIN MASTER
-- Cole este SQL no Supabase SQL Editor e clique em Run
-- ============================================================

-- PASSO 1: Criar usuario no Supabase Auth
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin.master@domdaempada.com.br') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      created_at,
      updated_at,
      last_sign_in_at,
      aud,
      role,
      is_sso_user,
      is_anonymous
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'admin.master@domdaempada.com.br',
      crypt('T05122020d*', gen_salt('bf')),
      NOW(),
      '{"name": "admin.master", "role": "admin"}'::jsonb,
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      NOW(),
      NOW(),
      NOW(),
      'authenticated',
      'authenticated',
      false,
      false
    );
    RAISE NOTICE 'Usuario auth criado com sucesso!';
  ELSE
    RAISE NOTICE 'Usuario auth ja existe, pulando criacao.';
  END IF;
END $$;

-- PASSO 2: Criar identidade para o usuario (necessario para login)
DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'admin.master@domdaempada.com.br';
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = uid) THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      uid,
      jsonb_build_object('sub', uid::text, 'email', 'admin.master@domdaempada.com.br'),
      'email',
      NOW(),
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Identidade criada com sucesso!';
  ELSE
    RAISE NOTICE 'Identidade ja existe.';
  END IF;
END $$;

-- PASSO 3: Criar registro na tabela app_users
DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'admin.master@domdaempada.com.br';
  IF NOT EXISTS (SELECT 1 FROM app_users WHERE email = 'admin.master@domdaempada.com.br') THEN
    INSERT INTO app_users (name, email, role, region, status, auth_uid)
    VALUES ('admin.master', 'admin.master@domdaempada.com.br', 'admin', 'Recife', 'Ativo', uid);
    RAISE NOTICE 'Registro em app_users criado!';
  ELSE
    UPDATE app_users
    SET auth_uid = uid, role = 'admin', status = 'Ativo'
    WHERE email = 'admin.master@domdaempada.com.br';
    RAISE NOTICE 'Registro em app_users atualizado!';
  END IF;
END $$;

-- VERIFICACAO FINAL: Deve retornar o usuario criado
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  a.name,
  a.role,
  a.status
FROM auth.users u
LEFT JOIN app_users a ON a.auth_uid = u.id
WHERE u.email = 'admin.master@domdaempada.com.br';
