-- SOLUÇÃO PARA O ERRO "Erro de permissão no banco de dados" NO APP DO MOTORISTA
-- O erro ocorre porque o token (login) do motorista diz que ele tem a "role" motorista, 
-- mas essa função (role) não foi criada explicitamente no banco de dados do Supabase.

-- Rode este código no SQL Editor do Supabase (onde você estava agorinha):

DO
$$
BEGIN
    -- Cria a role 'motorista' se não existir
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'motorista') THEN
        CREATE ROLE motorista nologin;
    END IF;

    -- Cria a role 'franqueado' se não existir
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'franqueado') THEN
        CREATE ROLE franqueado nologin;
    END IF;

    -- Cria a role 'admin' se não existir
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin nologin;
    END IF;

    -- Permite que o Supabase acesse essas roles
    GRANT motorista TO authenticator;
    GRANT franqueado TO authenticator;
    GRANT admin TO authenticator;
    
    -- Dar permissões para essas roles acessarem a schema public
    GRANT USAGE ON SCHEMA public TO motorista;
    GRANT USAGE ON SCHEMA public TO franqueado;
    GRANT USAGE ON SCHEMA public TO admin;
    
    -- Dar permissões para lerem as tabelas principais
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO motorista;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO franqueado;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO admin;
END
$$;
