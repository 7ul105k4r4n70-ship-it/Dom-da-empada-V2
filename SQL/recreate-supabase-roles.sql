-- ============================================================
-- SCRIPT DE EMERGÊNCIA: Recriar Roles do Supabase
-- EXECUTAR NO SQL EDITOR DO SUPABASE STUDIO
-- ============================================================

-- 1. Verificar roles existentes
SELECT 'Verificando roles existentes...' as step;
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin')
ORDER BY rolname;

-- 2. Recriar role 'anon' se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
    RAISE NOTICE 'Role anon criado com sucesso';
  ELSE
    RAISE NOTICE 'Role anon já existe';
  END IF;
END $$;

-- 3. Recriar role 'authenticated' se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
    RAISE NOTICE 'Role authenticated criado com sucesso';
  ELSE
    RAISE NOTICE 'Role authenticated já existe';
  END IF;
END $$;

-- 4. Recriar role 'service_role' se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
    RAISE NOTICE 'Role service_role criado com sucesso';
  ELSE
    RAISE NOTICE 'Role service_role já existe';
  END IF;
END $$;

-- 5. Corrigir usuários com role vazia no auth.users
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
    UPDATE auth.users 
    SET role = 'authenticated' 
    WHERE role IS NULL OR role = '';
    
    IF FOUND THEN
      RAISE NOTICE 'Usuários com role vazia corrigidos: %', FOUND;
    ELSE
      RAISE NOTICE 'Nenhum usuário com role vazia encontrado';
    END IF;
  ELSE
    RAISE NOTICE 'Tabela auth.users não encontrada';
  END IF;
END $$;

-- 6. Verificar schemas e permissões
DO $$
BEGIN
  -- Garantir que anon e authenticated têm acesso ao schema public
  GRANT USAGE ON SCHEMA public TO anon, authenticated;
  GRANT ALL ON SCHEMA public TO service_role;
  
  -- Garantir permissões em tabelas existentes
  GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
  
  RAISE NOTICE 'Permissões de schema configuradas';
END $$;

-- 7. Verificação final
SELECT 'Verificação final - Roles criados:' as step;
SELECT rolname, rolcanlogin 
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY rolname;

SELECT 'EXECUÇÃO CONCLUÍDA - FAZER LOGOUT E LOGIN NOVAMENTE' as status;
