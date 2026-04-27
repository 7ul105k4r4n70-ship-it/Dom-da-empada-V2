-- ============================================================
-- CORREÇÃO: function gen_salt(unknown) does not exist
-- Habilita extensão pgcrypto necessária para hash de senhas
-- Execute no Supabase Studio > SQL Editor
-- ============================================================

-- 1. Habilitar extensão pgcrypto (necessária para gen_salt() e crypt())
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verificar se foi habilitada
SELECT 
    extname,
    extversion,
    CASE WHEN extname = 'pgcrypto' THEN '✅ pgcrypto habilitado' ELSE '❌ Falha' END as status
FROM pg_extension 
WHERE extname = 'pgcrypto';
