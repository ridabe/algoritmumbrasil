# Configuração do Supabase para Algoritmum

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Configure o projeto:
   - **Name**: algoritmum
   - **Database Password**: Crie uma senha segura
   - **Region**: Escolha a região mais próxima (ex: South America)
6. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

Após criar o projeto, vá em **Settings > API** e copie:

1. **Project URL** - Cole em `NEXT_PUBLIC_SUPABASE_URL`
2. **anon public** key - Cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **service_role** key - Cole em `SUPABASE_SERVICE_ROLE_KEY`

Atualize o arquivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

## 3. Executar Migrações do Banco

Você tem duas opções para configurar o banco de dados:

### Opção A: Migração Manual (Recomendado)
1. Acesse o SQL Editor no painel do Supabase
2. Execute o conteúdo do arquivo `src/lib/db/migrations/001_initial_setup.sql`
3. Isso criará todas as tabelas, índices, triggers e políticas RLS

### Opção B: Drizzle Migrations
```bash
npm run db:generate
npm run db:migrate
```

**Nota**: A Opção A é recomendada pois inclui configurações específicas do Supabase como RLS e categorias padrão.

## 4. Configurar Autenticação

No painel do Supabase:

1. Vá em **Authentication > Settings**
2. Configure **Site URL**: `http://localhost:3000`
3. Adicione **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://seu-dominio.vercel.app/auth/callback` (para produção)

### Configurar Google OAuth (Opcional)

1. Vá em **Authentication > Providers**
2. Habilite **Google**
3. Configure:
   - **Client ID**: Seu Google Client ID
   - **Client Secret**: Seu Google Client Secret

## 5. Configurar RLS (Row Level Security)

As políticas de segurança já estão definidas no schema. Para aplicá-las:

1. Vá em **SQL Editor** no Supabase
2. Execute o conteúdo do arquivo `src/lib/db/schema.ts` (as tabelas e políticas)

## 6. Testar Conexão

Após configurar tudo:

1. Reinicie o servidor de desenvolvimento
2. Acesse `http://localhost:3000`
3. Teste o registro e login de usuários
4. Verifique se o dashboard carrega corretamente

## Scripts Úteis

```bash
# Gerar migrações
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Visualizar banco (Drizzle Studio)
npm run db:studio

# Reset do banco (cuidado!)
npm run db:reset
```

## Estrutura do Banco

O sistema inclui as seguintes tabelas:

- **profiles**: Perfis de usuário
- **accounts**: Contas bancárias
- **income_sources**: Fontes de renda
- **categories**: Categorias de transações
- **transactions**: Transações financeiras
- **recurring_rules**: Regras de recorrência
- **budgets**: Orçamentos
- **goals**: Metas financeiras
- **audit_logs**: Logs de auditoria

Todas as tabelas possuem RLS habilitado para segurança.