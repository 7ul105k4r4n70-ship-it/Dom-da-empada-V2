-- Atualizar a role para todos os usuários que estão com role vazia
CREATE OR REPLACE FUNCTION fix_auth_roles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar quem tem role vazia ou nula para 'authenticated'
  UPDATE auth.users 
  SET role = 'authenticated' 
  WHERE role IS NULL OR role = '';
END;
$$;
