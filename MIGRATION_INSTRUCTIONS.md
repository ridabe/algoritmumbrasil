# Instruções para Corrigir o Erro "column accounts.balance does not exist"

## Problema Identificado

O erro ocorre porque o código está tentando usar uma função RPC `update_account_balance` que não existe no banco de dados. Esta função é necessária para atualizar o saldo das contas quando transações são criadas ou modificadas.

## Solução

### 1. Executar a Migração SQL

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para o seu projeto `algoritmum`
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Cole o seguinte código SQL:

```sql
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
```

6. Clique em **Run** para executar a migração
7. Você deve ver uma mensagem de sucesso

### 2. Verificar se a Função foi Criada

Para verificar se a função foi criada corretamente, execute esta query:

```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'update_account_balance';
```

### 3. Testar a Aplicação

Após executar a migração:

1. Volte para a aplicação
2. Tente calcular o resumo novamente
3. O erro "column accounts.balance does not exist" deve ter sido resolvido

## Explicação Técnica

A função `update_account_balance` foi criada para:

- Receber um `account_id` (UUID da conta) e `amount_change` (valor da mudança)
- Atualizar o campo `initial_balance` da tabela `accounts`
- Atualizar automaticamente o campo `updated_at`
- Lançar uma exceção se a conta não for encontrada

Esta função é chamada automaticamente pelo código sempre que uma transação é criada, atualizada ou excluída, mantendo o saldo das contas sempre atualizado.

## Arquivos Relacionados

- `src/lib/db/migrations/002_create_update_balance_function.sql` - Migração criada
- `src/lib/services/transactions.ts` - Código que chama a função RPC
- `src/lib/services/accounts.ts` - Serviço de contas que mapeia `initial_balance` para `balance`