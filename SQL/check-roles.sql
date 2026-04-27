-- Verificar roles existentes no PostgreSQL
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles
ORDER BY rolname;

-- Verificar se o role 'anon' existe
SELECT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = 'anon'
) as anon_exists;

-- Verificar se o role 'authenticated' existe
SELECT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = 'authenticated'
) as authenticated_exists;

-- Verificar se o role 'service_role' existe
SELECT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = 'service_role'
) as service_role_exists;
