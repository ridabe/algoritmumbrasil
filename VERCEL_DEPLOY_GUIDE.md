# Guia de Deploy no Vercel - Correções para Problema de CSS

## Problema Identificado
O sistema estava sendo implantado no Vercel sem erros, mas a página `https://algoritmumbrasil.com.br/` aparecia sem formatação CSS, embora funcionasse corretamente localmente.

## Correções Implementadas

### 1. Configuração do Next.js (`next.config.ts`)
- Removidas configurações experimentais que causavam conflitos
- Adicionados headers específicos para arquivos CSS
- Configurações otimizadas para compatibilidade com Vercel

### 2. Configuração do Vercel (`vercel.json`)
- Removidos headers duplicados
- Adicionadas configurações específicas para assets estáticos
- Configuração de build otimizada

### 3. Componente de CSS Crítico (`CriticalCSS.tsx`)
- Criado componente para garantir carregamento de estilos essenciais
- CSS inline para evitar FOUC (Flash of Unstyled Content)
- Verificação automática se Tailwind CSS foi carregado
- Fallback para recarregamento em caso de falha no CSS

### 4. Layout Principal (`layout.tsx`)
- Adicionadas meta tags essenciais
- Preload de arquivos CSS críticos
- Integração do componente CriticalCSS
- Força carregamento do CSS no servidor

## Variáveis de Ambiente Necessárias no Vercel

Certifique-se de que as seguintes variáveis estão configuradas no painel do Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
DATABASE_URL=your_postgres_connection_string_here
NEXT_PUBLIC_APP_URL=https://algoritmumbrasil.com.br
STORAGE_BUCKET=comprovantes
TZ=America/Sao_Paulo
SKIP_ENV_VALIDATION=true
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max-old-space-size=4096
```

## Comandos de Deploy

### Deploy Manual
```bash
# Instalar dependências
pnpm install --frozen-lockfile

# Build de produção
pnpm run build

# Deploy no Vercel
vercel --prod
```

### Deploy Automático
O deploy automático está configurado para ser executado a cada push na branch `main`.

## Verificações Pós-Deploy

1. **CSS Carregado**: Verificar se os estilos Tailwind estão sendo aplicados
2. **Fontes**: Confirmar se a fonte Inter está carregando corretamente
3. **Responsividade**: Testar em diferentes dispositivos
4. **Performance**: Verificar tempos de carregamento

## Troubleshooting

### Se o CSS ainda não carregar:
1. Limpar cache do Vercel: `vercel --prod --force`
2. Verificar se todas as variáveis de ambiente estão configuradas
3. Verificar logs de build no painel do Vercel
4. Testar localmente com `pnpm run build && pnpm run start`

### Logs Úteis
- Build logs: Painel Vercel > Functions > View Function Logs
- Runtime logs: Painel Vercel > Functions > View Function Logs
- Edge logs: Painel Vercel > Edge Network > View Logs

## Arquivos Modificados

- `next.config.ts` - Configurações do Next.js
- `vercel.json` - Configurações do Vercel
- `src/app/layout.tsx` - Layout principal
- `src/components/CriticalCSS.tsx` - Componente de CSS crítico (novo)
- `tailwind.config.ts` - Configuração do Tailwind
- `postcss.config.js` - Configuração do PostCSS

## Notas Importantes

- O componente `CriticalCSS` inclui verificação automática de carregamento do Tailwind
- Headers específicos garantem que arquivos CSS sejam servidos corretamente
- Configurações de preload melhoram a performance de carregamento
- Fallback CSS inline garante que a página não apareça sem estilo

---

**Data da Correção**: Janeiro 2025  
**Status**: ✅ Resolvido  
**Próximo Deploy**: Testar em produção