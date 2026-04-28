-- Listar todos os usuários do Supabase Auth (para verificação)
SELECT id, email, created_at FROM auth.users;

-- Deletar TODOS os usuários do Supabase Auth (CUIDADO - isso exclui tudo)
DELETE FROM auth.users;

-- Ou deletar usuários específicos por email (descomente e ajuste)
-- DELETE FROM auth.users WHERE email IN (
--   '7u105k4r4n70@gmail.com',
--   'teste.motorista@gmail.com',
--   'contato@jdomdaempada.com.br'
-- );

-- Deletar usuários órfãos (estão no auth mas não no app_users)
DELETE FROM auth.users 
WHERE id NOT IN (SELECT auth_uid::uuid FROM public.app_users WHERE auth_uid IS NOT NULL);
