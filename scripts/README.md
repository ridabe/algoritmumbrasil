# Scripts Node.js

Esta pasta contém scripts Node.js que são executados no servidor/desenvolvimento, não no navegador.

## Arquivos:

### Scripts de Utilidade:
- **check-rpc-function.js**: Script para verificar se as funções RPC do Supabase estão funcionando corretamente
- **confirm-user-email.js**: Script para confirmar emails de usuários no Supabase
- **debug-transaction-error.js**: Script para debugar erros de transações

### Scripts de Teste:
- **test-accounts-hook.js**: Testa hooks de contas
- **test-accounts.js**: Testa funcionalidades de contas
- **test-api-transaction.js**: Testa API de transações
- **test-auth.js**: Testa autenticação
- **test-authenticated-transaction.js**: Testa transações autenticadas
- **test-form-accounts.js**: Testa formulários de contas
- **test-form-data.js**: Testa dados de formulários
- **test-transaction-form.js**: Testa formulário de transações

## Como executar:

```bash
# Executar um script específico
node scripts/check-rpc-function.js
node scripts/confirm-user-email.js
node scripts/debug-transaction-error.js
```

## Importante:

Estes arquivos usam `require()` e são específicos para Node.js. Eles **NÃO** devem ser incluídos no código do navegador, pois causariam o erro:

```
Uncaught ReferenceError: require is not defined
```

Por isso, foram movidos para esta pasta separada para evitar que sejam servidos pelo Next.js.