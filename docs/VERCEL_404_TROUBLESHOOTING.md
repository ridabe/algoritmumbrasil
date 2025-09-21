# 🔧 Guia de Troubleshooting - Erro 404 no Vercel

## 🚨 Problema
Após deploy bem-sucedido no Vercel, a aplicação retorna:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: gru1::tcj28-1758384987644-198429e22ae8
```

## ✅ Soluções Implementadas

### 1. Arquivo vercel.json Criado
Adicionado arquivo de configuração específico para Next.js App Router:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/((?!api|_next/static|_next/image|favicon.ico).*)",
      "destination": "/"
    }
  ]
}
```

### 2. Configuração next.config.ts Ajustada
- Removida falha de build por variáveis de ambiente faltantes
- Mantidos avisos para configuração posterior
- Build agora funciona mesmo sem Supabase configurado

### 3. Verificações Necessárias no Vercel

#### A. Framework Preset
1. Acesse: Vercel Dashboard → Seu Projeto → Settings
2. Vá em "Build & Development Settings"
3. Certifique-se que "Framework Preset" está como **Next.js** (não "Other")

#### B. Build Settings
Verifique se estão corretos:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

#### C. Root Directory
- Deve estar vazio (raiz do projeto)
- Se estiver em monorepo, ajustar conforme necessário

### 4. Variáveis de Ambiente (Opcional)
Para funcionalidade completa do Supabase:

1. Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL = sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sua_chave_anonima
   ```
3. Obtenha em: https://supabase.com/dashboard/project/_/settings/api

## 🔄 Próximos Passos

1. **Commit e Push** das alterações:
   ```bash
   git add .
   git commit -m "fix: configuração Vercel para resolver 404"
   git push
   ```

2. **Aguardar Redeploy Automático** no Vercel

3. **Verificar Configurações** no Dashboard do Vercel

4. **Testar a Aplicação** após o deploy

## 📋 Checklist de Verificação

- [ ] Arquivo `vercel.json` criado
- [ ] `next.config.ts` não falha por variáveis faltantes
- [ ] Framework Preset = "Next.js" no Vercel
- [ ] Build Settings corretos
- [ ] Root Directory vazio
- [ ] Commit e push realizados
- [ ] Redeploy automático concluído
- [ ] Aplicação funcionando

## 🆘 Se o Problema Persistir

1. **Verificar Build Logs** no Vercel Dashboard
2. **Verificar Runtime Logs** para erros específicos
3. **Testar com Deploy Manual**: `vercel --prod`
4. **Verificar Domain Configuration** se usando domínio customizado
5. **Contatar Suporte Vercel** com o ID do erro

---

**Nota**: A aplicação agora deve funcionar mesmo sem configuração do Supabase. As funcionalidades de autenticação e banco de dados só funcionarão após configurar as variáveis de ambiente.