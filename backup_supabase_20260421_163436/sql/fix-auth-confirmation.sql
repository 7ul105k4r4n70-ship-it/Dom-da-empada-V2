-- ============================================================
-- Dom da Empada - AUTH CONFIRMATION FIX
-- Resolve o erro "Invalid login credentials" auto-confirmando
-- os e-mails dos usuários criados pelo administrador.
-- ============================================================

-- 1. Confirmar todos os usuários existentes que não estão confirmados
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW(),
    last_sign_in_at = COALESCE(last_sign_in_at, NOW())
WHERE email_confirmed_at IS NULL;

-- 2. Criar função para auto-confirmar novos usuários
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger na tabela auth.users
DROP TRIGGER IF EXISTS tr_auto_confirm_user ON auth.users;
CREATE TRIGGER tr_auto_confirm_user
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_user();

-- 4. Garantir que o usuário admin.master também esteja ok
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'admin.master@domdaempada.com.br';

-- Verificação final
SELECT email, email_confirmed_at, role 
FROM auth.users;
