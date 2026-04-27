-- ============================================================
-- Criar Usuário Master (admin.master)
-- Acessa tanto App Motorista quanto Portal Administrativo
-- ============================================================

-- 1. Verificar se o usuário já existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin.master@domdaempada.com.br') THEN
    -- Criar usuário no Supabase Auth
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at,
      aud,
      role
    ) VALUES (
      gen_random_uuid(),
      'admin.master@domdaempada.com.br',
      crypt('T05122020d*', gen_salt('bf')),
      NOW(),
      '{"name": "admin.master", "role": "admin"}'::jsonb,
      NOW(),
      NOW(),
      NOW(),
      'authenticated',
      'authenticated'
    );
    RAISE NOTICE 'Usuário auth criado com sucesso!';
  ELSE
    RAISE NOTICE 'Usuário auth já existe, pulando criação.';
  END IF;
END $$;

-- 2. Criar registro na tabela app_users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM app_users WHERE name = 'admin.master') THEN
    INSERT INTO app_users (
      name,
      email,
      role,
      region,
      status,
      auth_uid
    )
    SELECT
      'admin.master',
      email,
      'admin',
      'Recife',
      'Ativo',
      id
    FROM auth.users
    WHERE email = 'admin.master@domdaempada.com.br';
    RAISE NOTICE 'Usuário app_users criado com sucesso!';
  ELSE
    RAISE NOTICE 'Usuário app_users já existe, pulando criação.';
  END IF;
END $$;

-- Verificação
SELECT 'Usuário master criado com sucesso!' AS status;
