-- Migração para criar função RPC update_account_balance
-- Esta função atualiza o saldo de uma conta baseado em mudanças de valor

BEGIN;

-- Criar função para atualizar saldo da conta
CREATE OR REPLACE FUNCTION update_account_balance(
    account_id UUID,
    amount_change DECIMAL(15,2)
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Atualizar o saldo inicial da conta
    UPDATE accounts 
    SET 
        initial_balance = initial_balance + amount_change,
        updated_at = NOW()
    WHERE id = account_id;
    
    -- Verificar se a conta foi encontrada
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conta com ID % não encontrada', account_id;
    END IF;
END;
$$;

-- Conceder permissões para usuários autenticados
GRANT EXECUTE ON FUNCTION update_account_balance(UUID, DECIMAL) TO authenticated;

COMMIT;