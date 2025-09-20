# Configuração do Supabase para Algoritmum

Este guia explica como configurar o Supabase para o projeto Algoritmum.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha:
   - **Name**: algoritmum
   - **Database Password**: (gere uma senha segura)
   - **Region**: South America (São Paulo) - para melhor performance no Brasil
6. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

Após criar o projeto, vá em **Settings > API** e copie:

- **Project URL**
- **anon/public key**
- **service_role key** (mantenha em segredo)

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Database URL (para Drizzle ORM)
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.seu-projeto.supabase.co:5432/postgres
```

## 3. Configurar Autenticação

### 3.1 Configurar Providers

1. Vá em **Authentication > Providers**
2. Configure **Email**:
   - ✅ Enable email provider
   - ✅ Confirm email
   - ✅ Enable email confirmations

### 3.2 Configurar URLs de Callback

1. Vá em **Authentication > URL Configuration**
2. Adicione as URLs:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.com/auth/callback` (produção)

### 3.3 Configurar Templates de Email

1. Vá em **Authentication > Email Templates**
2. Personalize os templates conforme necessário

## 4. Executar Migrações do Banco

### 4.1 Instalar Dependências

```bash
npm install
```

### 4.2 Configurar Schema

O arquivo `src/lib/db/schema.ts` contém as definições das tabelas.

### 4.3 Gerar e Executar Migrações

```bash
# Gerar arquivos de migração
npm run db:generate

# Executar migrações
npm run db:migrate

# Ou usar push para desenvolvimento
npm run db:push
```

### 4.4 Visualizar Banco (Opcional)

```bash
# Abrir Drizzle Studio
npm run db:studio
```

## 5. Configurar Políticas RLS (Row Level Security)

No **SQL Editor** do Supabase, execute:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Política para profiles (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para accounts
CREATE POLICY "Users can manage own accounts" ON accounts
  FOR ALL USING (auth.uid() = user_id);

-- Política para transactions
CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Política para categories
CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- Política para budgets
CREATE POLICY "Users can manage own budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id);

-- Política para goals
CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);
```

## 6. Testar Configuração

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000`

3. Teste o fluxo:
   - Criar conta em `/auth/register`
   - Fazer login em `/auth/login`
   - Verificar redirecionamento para `/financas`

## 7. Configuração para Produção

### 7.1 Variáveis de Ambiente

No seu provedor de hosting (Vercel, Netlify, etc.), configure:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
DATABASE_URL=postgresql://postgres:[SENHA]@db.seu-projeto.supabase.co:5432/postgres
```

### 7.2 Atualizar URLs de Callback

No Supabase, atualize as URLs para seu domínio de produção.

## 8. Monitoramento

1. **Logs**: Vá em **Logs** para monitorar atividade
2. **Metrics**: Acompanhe uso em **Reports**
3. **Database**: Monitore performance em **Database**

## 9. Backup e Segurança

1. Configure backups automáticos
2. Monitore tentativas de login suspeitas
3. Revise políticas RLS regularmente
4. Mantenha as chaves seguras

## Troubleshooting

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Erro de Autenticação
- Verifique as URLs de callback
- Confirme se o email provider está habilitado

### Erro de Banco de Dados
- Execute as migrações: `npm run db:migrate`
- Verifique as políticas RLS

---

**Importante**: Mantenha suas chaves de API seguras e nunca as commite no repositório!