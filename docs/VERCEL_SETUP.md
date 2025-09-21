# 🚀 Configuração do Vercel para Deploy

## ❌ Erro Atual
```
❌ Variáveis de ambiente obrigatórias não configuradas:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## ✅ Solução: Configurar Variáveis de Ambiente no Vercel

### 1. Obter Credenciais do Supabase

1. Acesse: https://supabase.com/dashboard/project/_/settings/api
2. Copie as seguintes informações:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 2. Configurar no Vercel Dashboard

#### Opção A: Via Dashboard Web
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **algoritmum**
3. Vá em **Settings** → **Environment Variables**
4. Adicione as variáveis:

```
NEXT_PUBLIC_SUPABASE_URL = sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY = sua_chave_anonima
```

#### Opção B: Via Vercel CLI
```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login no Vercel
vercel login

# Configurar variáveis
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Redeploy do Projeto

Após configurar as variáveis:

#### Via Dashboard:
1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**

#### Via Git Push:
```bash
# Fazer um commit vazio para triggerar novo deploy
git commit --allow-empty -m "trigger: redeploy with env vars"
git push origin main
```

### 4. Verificar Deploy

O build deve passar com sucesso mostrando:
```
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## 🔧 Troubleshooting

### Problema: Variáveis não aparecem
- **Solução**: Aguarde 1-2 minutos e faça redeploy
- **Verificação**: Vá em Settings → Environment Variables

### Problema: Build ainda falha
- **Causa**: Valores incorretos das variáveis
- **Solução**: Verifique se copiou corretamente do Supabase

### Problema: URL inválida
- **Formato correto**: `https://seuprojectid.supabase.co`
- **Não inclua**: `/auth/v1` ou outros paths

## 📋 Checklist Final

- [ ] ✅ Variáveis configuradas no Vercel
- [ ] ✅ Valores corretos do Supabase
- [ ] ✅ Redeploy executado
- [ ] ✅ Build passou sem erros
- [ ] ✅ Site funcionando

## 🔗 Links Úteis

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase API Settings](https://supabase.com/dashboard/project/_/settings/api)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**💡 Dica**: Após configurar, o deploy deve funcionar automaticamente. Se persistir o erro, verifique se as credenciais estão corretas no painel do Supabase.