# 🚀 Guia de Deploy - Algoritmum

## ❌ Erro Comum: Variáveis de Ambiente Não Configuradas

Se você está vendo este erro durante o deploy:

```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## ✅ Solução: Configurar Variáveis de Ambiente

### 1. Obter Credenciais do Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá para **Settings** → **API**
3. Copie as seguintes informações:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Project API Key** → **anon public** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Project API Key** → **service_role** (SUPABASE_SERVICE_ROLE_KEY)

### 2. Configurar no Vercel

```bash
# Via CLI do Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

Ou via Dashboard do Vercel:
1. Acesse seu projeto no Vercel
2. Vá para **Settings** → **Environment Variables**
3. Adicione cada variável:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://seu-projeto.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Production, Preview, Development |

### 3. Configurar em Outros Provedores

#### Netlify
```bash
# Via CLI do Netlify
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://seu-projeto.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "sua-anon-key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "sua-service-role-key"
```

#### Railway
1. Acesse seu projeto no Railway
2. Vá para **Variables**
3. Adicione as variáveis necessárias

#### Docker
```dockerfile
# No seu Dockerfile ou docker-compose.yml
ENV NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
ENV SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 4. Variáveis Obrigatórias

```env
# ⚠️ OBRIGATÓRIAS para funcionamento
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# 📝 Opcionais mas recomendadas
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
DATABASE_URL=postgresql://...
STORAGE_BUCKET=comprovantes
TZ=America/Sao_Paulo
```

### 5. Verificar Configuração

Após configurar as variáveis:

1. **Redeploy** seu projeto
2. Verifique os logs de build
3. Teste a autenticação na aplicação

### 6. Troubleshooting

#### Erro persiste após configurar variáveis?
- Verifique se as variáveis estão nos ambientes corretos (Production, Preview)
- Confirme que não há espaços extras nas chaves/valores
- Teste localmente com as mesmas variáveis

#### Como testar localmente?
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite .env.local com suas credenciais reais
# Execute o projeto
npm run dev
```

## 🔒 Segurança

- ✅ **NUNCA** commite arquivos `.env` com credenciais reais
- ✅ Use `.env.example` como template
- ✅ Configure variáveis diretamente no provedor de deploy
- ✅ Rotacione chaves periodicamente no Supabase

## 📞 Suporte

Se o problema persistir:
1. Verifique a documentação do seu provedor de deploy
2. Confirme as credenciais no dashboard do Supabase
3. Teste a conexão localmente primeiro