-- ============================================================
-- DIAGNÓSTICO COMPLETO: function gen_salt(unknown) does not exist
-- Execute no Supabase Studio > SQL Editor e cole o resultado
-- ============================================================

-- 1. Verificar se pgcrypto está instalado e em qual schema
SELECT 
    e.extname,
    n.nspname as schema,
    e.extversion,
    CASE WHEN e.extname = 'pgcrypto' THEN '✅ pgcrypto instalado' ELSE '❌ NÃO instalado' END as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'pgcrypto';

-- 2. Verificar se a função gen_salt existe e em qual schema
SELECT 
    n.nspname as schema,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    CASE WHEN p.proname = 'gen_salt' THEN '✅ gen_salt existe' ELSE '' END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'gen_salt';

-- 3. Verificar search_path atual
SHOW search_path;

-- 4. Tentar chamar gen_salt diretamente para testar
SELECT gen_salt('bf') as test_gen_salt;

-- 5. Verificar quais schemas têm pgcrypto
SELECT 
    n.nspname,
    COUNT(*) as function_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN ('gen_salt', 'crypt', 'gen_random_uuid')
GROUP BY n.nspname;

-- 6. Verificar se há funções/triggers que chamam gen_salt sem schema
SELECT 
    p.proname as function_name,
    n.nspname as schema,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) ILIKE '%gen_salt%'
AND n.nspname NOT IN ('extensions', 'pg_catalog');
