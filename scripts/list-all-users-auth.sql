-- ============================================================
-- CONSULTA COMPLETA DE USUÁRIOS - SUPABASE AUTH
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Ver todos os usuários do auth.users com informações completas
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as "Nome Completo",
  raw_user_meta_data->>'name' as "Nome (alternativo)",
  raw_user_meta_data->>'user_name' as "Username",
  raw_user_meta_data->>'display_name' as "Nome de Exibição",
  raw_user_meta_data->>'role' as "Função (metadata)",
  raw_user_meta_data->>'region' as "Região (metadata)",
  phone,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '⚠️ Pendente'
  END as "Status Email"
FROM auth.users
ORDER BY created_at DESC;

-- 2. Ver informações de perfil (se existir a tabela profiles)
SELECT 
  u.id,
  u.email,
  p.name as "Nome do Perfil",
  p.role as "Função",
  p.region as "Região",
  p.phone as "Telefone",
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 3. Ver usuários da tabela app_users (sistema customizado)
SELECT 
  id,
  name as "Nome",
  email as "Email",
  role as "Função",
  region as "Região",
  created_at
FROM app_users
ORDER BY created_at DESC;

-- 4. Ver metadata completa de um usuário específico (substitua o ID)
-- SELECT raw_user_meta_data FROM auth.users WHERE email = 'admin@domdaempada.com';

-- 5. Atualizar metadata para adicionar nome completo aos usuários existentes
-- EXECUTE APENAS SE NECESSÁRIO - descomente e ajuste conforme necessidade:

/*
-- Exemplo: Atualizar nome de um usuário específico
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{full_name}',
  '"Nome do Usuário"'::jsonb
)
WHERE email = 'usuario@exemplo.com';

-- Exemplo: Atualizar nome de TODOS os usuários que têm email mas não têm nome
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{full_name}',
  ('"' || SPLIT_PART(email, '@', 1) || '"')::jsonb
)
WHERE raw_user_meta_data->>'full_name' IS NULL 
AND email IS NOT NULL;
*/

-- 6. Contagem de usuários por status
SELECT 
  COUNT(*) as "Total de Usuários",
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as "Email Confirmado",
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as "Email Pendente",
  COUNT(CASE WHEN raw_user_meta_data->>'full_name' IS NOT NULL THEN 1 END) as "Com Nome",
  COUNT(CASE WHEN raw_user_meta_data->>'full_name' IS NULL THEN 1 END) as "Sem Nome"
FROM auth.users;
