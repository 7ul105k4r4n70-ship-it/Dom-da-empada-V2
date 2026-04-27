-- ============================================================
-- Dom da Empada — FIX: Login de Motoristas no App V1
-- Execute no Supabase Studio > SQL Editor
-- ============================================================
-- PROBLEMA: Motoristas cadastrados no V2 não conseguem logar no V1
-- CAUSA: A senha no app_users pode estar dessincronizada com o Supabase Auth,
--        OU o motorista não tem auth_uid preenchido.
-- ============================================================

-- 1. DIAGNÓSTICO: Ver motoristas sem auth_uid (não conseguirão logar nunca)
SELECT 
  id, 
  name, 
  email, 
  role,
  status,
  auth_uid,
  password,
  created_at
FROM app_users
WHERE role = 'motorista'
ORDER BY created_at DESC;

-- ============================================================
-- 2. FUNÇÃO: Confirmar email de usuário (se não estiver confirmado no Auth)
-- Esta função precisa existir no banco para o V1 funcionar corretamente
-- ============================================================
CREATE OR REPLACE FUNCTION confirm_user_email(user_id_input UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
  WHERE id = user_id_input;
END;
$$;

-- ============================================================
-- 3. CORREÇÃO: Confirmar email de todos os motoristas no Supabase Auth
--    que estão na tabela app_users com auth_uid preenchido
-- ============================================================
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE id IN (
  SELECT auth_uid::UUID 
  FROM app_users 
  WHERE auth_uid IS NOT NULL 
    AND role = 'motorista'
    AND status = 'Ativo'
);

-- ============================================================
-- 4. VERIFICAÇÃO: Motoristas no app_users vs auth.users
-- Mostra quais motoristas têm auth_uid mas o email não está confirmado
-- ============================================================
SELECT 
  u.name,
  u.email,
  u.role,
  u.auth_uid,
  u.password AS senha_banco,
  au.email_confirmed_at,
  au.created_at AS auth_criado_em,
  CASE 
    WHEN au.id IS NULL THEN '❌ SEM REGISTRO NO AUTH'
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ EMAIL NÃO CONFIRMADO'
    ELSE '✅ OK'
  END AS situacao
FROM app_users u
LEFT JOIN auth.users au ON au.id = u.auth_uid::UUID
WHERE u.role = 'motorista'
ORDER BY u.created_at DESC;

-- ============================================================
-- 5. GARANTIR que a policy de leitura anon existe na app_users
--    (O V1 lê app_users ANTES de autenticar, usando o papel anon)
-- ============================================================
DROP POLICY IF EXISTS "Allow anon read app_users" ON app_users;
CREATE POLICY "Allow anon read app_users" ON app_users 
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon update app_users" ON app_users;
CREATE POLICY "Allow anon update app_users" ON app_users 
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
